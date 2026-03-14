"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatTime, calculateAccuracy } from "@/lib/utils";
import { Maximize2, Clock, AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { MockTestReport } from "./mock-test-report";

interface Question {
  id: string;
  paper_id: number;
  topic_id: string;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_option: string | null;
  explanation: string;
  difficulty: string;
  topics?: { name: string };
}

interface Props {
  userId: string;
  mock: Record<string, unknown>;
  questions: Record<string, unknown>[];
  existingAttemptId?: string;
  existingResponses: Record<string, string>;
  existingStartTime?: string;
}

type QStatus = "not_visited" | "answered" | "marked_review" | "not_answered";

export function MockTestEnvironment({ userId, mock, questions: rawQs, existingAttemptId, existingResponses, existingStartTime }: Props) {
  const supabase = createClient();
  const qs = rawQs as unknown as Question[];

  const paper = mock.papers as Record<string, unknown>;
  const durationSeconds = ((paper?.duration_minutes as number) ?? 120) * 60;
  const hasNegativeMarking = (paper?.negative_marking as number) > 0;
  const isReadingTime = (paper?.format as string) === "objective";

  // Timer: compute remaining from start time
  const startedAt = existingStartTime ? new Date(existingStartTime).getTime() : Date.now();
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  const initial = Math.max(0, durationSeconds - elapsed);

  const [attemptId, setAttemptId] = useState<string | null>(existingAttemptId ?? null);
  const [answers, setAnswers] = useState<Record<string, string>>(existingResponses);
  const [markedReview, setMarkedReview] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initial);
  const [readingTimeLeft, setReadingTimeLeft] = useState(isReadingTime ? 15 * 60 : 0);
  const [isReading, setIsReading] = useState(isReadingTime);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [exitWarnings, setExitWarnings] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!existingAttemptId) createAttempt();
    setupFullscreenListener();
    enterFullscreen();
    return () => { clearInterval(timerRef.current!); document.removeEventListener("fullscreenchange", onFsChange); };
  }, []);

  useEffect(() => {
    if (submitted) return;
    if (isReading && isReadingTime) {
      timerRef.current = setInterval(() => {
        setReadingTimeLeft((t) => {
          if (t <= 1) { clearInterval(timerRef.current!); setIsReading(false); startMainTimer(); return 0; }
          return t - 1;
        });
      }, 1000);
    } else if (!isReading) {
      startMainTimer();
    }
    return () => clearInterval(timerRef.current!);
  }, [isReading]);

  function startMainTimer() {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  async function createAttempt() {
    const { data } = await (supabase.from("mock_test_attempts") as any).insert({
      user_id: userId,
      mock_test_id: mock.id as string,
      status: "in_progress",
      fullscreen_exit_count: 0,
    }).select().single();
    if (data) setAttemptId(data.id);
  }

  function setupFullscreenListener() {
    document.addEventListener("fullscreenchange", onFsChange);
  }

  function onFsChange() {
    if (!document.fullscreenElement && !submitted) {
      setFullscreenExits((n) => n + 1);
      setExitWarnings((w) => {
        const next = w + 1;
        if (next >= 3) {
          toast.error("Auto-submitting: repeated fullscreen exits detected");
          handleSubmit();
        } else {
          toast.error(`Warning ${next}/3: Please stay in fullscreen during the test`);
          enterFullscreen();
        }
        return next;
      });
    }
  }

  function enterFullscreen() {
    try {
      if (containerRef.current && !document.fullscreenElement) {
        containerRef.current.requestFullscreen?.();
      }
    } catch {}
  }

  function saveQuestionTime(questionId: string) {
    const elapsed = Math.floor((Date.now() - questionStart) / 1000);
    setQuestionTimes((prev) => ({ ...prev, [questionId]: (prev[questionId] ?? 0) + elapsed }));
    setQuestionStart(Date.now());
  }

  function handleSelectAnswer(questionId: string, option: string) {
    if (isReading) return;
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: option };
      // Auto-save to DB
      if (attemptId) {
        (supabase.from("mock_test_responses") as any).upsert({
          attempt_id: attemptId,
          question_id: questionId,
          selected_option: option,
          is_correct: qs.find((q) => q.id === questionId)?.correct_option === option,
          time_spent_sec: questionTimes[questionId] ?? 0,
          marked_for_review: markedReview.has(questionId),
        }, { onConflict: "attempt_id,question_id" });
      }
      return updated;
    });
  }

  function toggleMarkReview(questionId: string) {
    setMarkedReview((prev) => {
      const s = new Set(prev);
      if (s.has(questionId)) s.delete(questionId); else s.add(questionId);
      return s;
    });
  }

  function navigateTo(idx: number) {
    saveQuestionTime(qs[current].id);
    setCurrent(idx);
    setQuestionStart(Date.now());
  }

  const handleSubmit = useCallback(async () => {
    if (submitting || submitted) return;
    clearInterval(timerRef.current!);
    setSubmitting(true);

    // Exit fullscreen
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch {}

    // Compute scores
    let totalScore = 0;
    const paperNegMarking = (paper?.negative_marking as number) ?? 0;
    const topicMap: Record<string, { correct: number; total: number }> = {};

    for (const q of qs) {
      const selected = answers[q.id];
      const topicId = q.topic_id;
      if (!topicMap[topicId]) topicMap[topicId] = { correct: 0, total: 0 };
      topicMap[topicId].total++;
      if (selected) {
        if (selected === q.correct_option) {
          totalScore += 1;
          topicMap[topicId].correct++;
        } else if (paperNegMarking > 0) {
          totalScore -= paperNegMarking;
        }
      }
    }

    const maxScore = (paper?.total_marks as number) ?? 100;
    const percentage = Math.max(0, (totalScore / qs.length) * 100);

    const topicScores = Object.fromEntries(
      Object.entries(topicMap).map(([tid, { correct, total }]) => [
        tid,
        { correct, total, pct: Math.round((correct / total) * 100) },
      ])
    );

    if (attemptId) {
      await (supabase.from("mock_test_attempts") as any).update({
        status: "completed",
        total_score: Math.max(0, totalScore),
        percentage,
        topic_scores: topicScores,
        time_analytics: questionTimes,
        fullscreen_exit_count: fullscreenExits,
        completed_at: new Date().toISOString(),
      }).eq("id", attemptId);
    }

    setSubmitted(true);
    setSubmitting(false);
  }, [submitting, submitted, answers, qs, attemptId, fullscreenExits, questionTimes, paper]);

  if (submitted && attemptId) {
    return (
      <MockTestReport
        userId={userId}
        attemptId={attemptId}
        questions={qs}
        answers={answers}
        mock={mock}
        topicTimes={questionTimes}
      />
    );
  }

  if (qs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">No questions found for this mock test. Please contact support.</p>
      </div>
    );
  }

  const q = qs[current];
  const timerColor = timeLeft <= 600 ? "text-red-600" : timeLeft <= 1800 ? "text-yellow-600" : "text-gray-800";

  function getStatusClass(questionId: string, idx: number): string {
    if (markedReview.has(questionId)) return "bg-orange-200 border-orange-400 text-orange-800";
    if (answers[questionId]) return "bg-green-200 border-green-400 text-green-800";
    if (idx === current) return "bg-blue-200 border-blue-400 text-blue-800";
    return "bg-gray-100 border-gray-300 text-gray-600";
  }

  return (
    <div ref={containerRef} className="mock-fullscreen no-select flex flex-col bg-gray-50" onContextMenu={(e) => e.preventDefault()}>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="font-bold text-gray-900 text-sm">
            P{mock.paper_id as number} · Mock {mock.test_number as number} — {mock.title as string}
          </div>
          {hasNegativeMarking && (
            <Badge variant="destructive" className="text-xs">-0.25 per wrong</Badge>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isReading && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
              <Clock className="h-4 w-4" />
              Reading: {formatTime(readingTimeLeft)}
            </div>
          )}
          <div className={`flex items-center gap-1.5 font-mono text-lg font-bold ${timerColor}`}>
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          <button onClick={enterFullscreen} className="p-1.5 rounded hover:bg-gray-100" title="Enter fullscreen">
            <Maximize2 className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Question area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">Q{current + 1}/{qs.length}</Badge>
              <Badge variant={q.difficulty === "hard" ? "destructive" : "secondary"} className="capitalize">{q.difficulty}</Badge>
              {q.topics?.name && <span className="text-xs text-gray-500">{q.topics.name}</span>}
              <button
                onClick={() => toggleMarkReview(q.id)}
                className={`ml-auto text-xs px-3 py-1 rounded-full border transition-colors ${
                  markedReview.has(q.id) ? "bg-orange-100 border-orange-400 text-orange-700" : "border-gray-300 text-gray-600 hover:border-orange-300"
                }`}
              >
                {markedReview.has(q.id) ? "✓ Marked for Review" : "Mark for Review"}
              </button>
            </div>

            <p className="text-gray-900 font-medium leading-relaxed mb-6 text-base">{q.question_text}</p>

            <div className="space-y-3">
              {(["a", "b", "c", "d"] as const).map((opt) => {
                const text = q[`option_${opt}` as keyof Question] as string;
                if (!text) return null;
                const isSelected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectAnswer(q.id, opt)}
                    disabled={isReading}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : isReading
                        ? "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer"
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 flex-shrink-0 ${
                      isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {opt.toUpperCase()}
                    </span>
                    {text}
                  </button>
                );
              })}
            </div>

            {isReading && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  <strong>Reading Time:</strong> You can read questions and plan your approach, but answers are locked until reading time ends.
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => navigateTo(current - 1)} disabled={current === 0}>← Prev</Button>
              {current < qs.length - 1 ? (
                <Button onClick={() => navigateTo(current + 1)}>Next →</Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Test
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question palette sidebar */}
        <div className="w-52 border-l border-gray-200 bg-white flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-500 uppercase mb-2">Question Palette</div>
            <div className="flex flex-wrap gap-1">
              {[
                { color: "bg-green-200 border-green-400", label: "Answered" },
                { color: "bg-orange-200 border-orange-400", label: "Marked" },
                { color: "bg-gray-100 border-gray-300", label: "Not visited" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1 text-xs text-gray-500">
                  <span className={`w-3 h-3 rounded border ${s.color}`} />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-4 gap-1.5">
              {qs.map((question, idx) => (
                <button
                  key={question.id}
                  onClick={() => navigateTo(idx)}
                  className={`h-8 w-8 text-xs font-bold rounded border transition-colors ${getStatusClass(question.id, idx)}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">
              {Object.keys(answers).length}/{qs.length} answered
            </div>
            <Button
              onClick={handleSubmit}
              loading={submitting}
              className="w-full bg-green-600 hover:bg-green-700 text-sm"
              size="sm"
            >
              Submit Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
