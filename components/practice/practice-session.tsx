"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatTime, calculateAccuracy } from "@/lib/utils";
import {
  BookmarkPlus, BookmarkCheck, Flag, ChevronLeft, ChevronRight,
  Clock, CheckCircle2, XCircle, SkipForward, BarChart3, Sparkles,
} from "lucide-react";
import { SessionSummary } from "./session-summary";
import { SubjectiveAnswer } from "./subjective-answer";

interface Question {
  id: string;
  paper_id: number;
  topic_id: string;
  sub_topic_id: string;
  question_text: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  correct_option: string | null;
  correct_answer_text: string | null;
  explanation: string;
  difficulty: string;
  question_type: string;
  model_answer: string | null;
  max_marks: number;
  marking_rubric: Record<string, number> | null;
  topics: { name: string; paper_id: number };
}

interface Props {
  userId: string;
  questions: Record<string, unknown>[];
  sessionType: string;
  topicId?: string;
  paperId?: number;
  bookmarkedIds: Set<string>;
  topicName?: string;
}

const PAPER_NAMES: Record<number, string> = {
  1: "Accounts", 2: "Laws", 3: "Maths", 4: "Economics"
};

export function PracticeSession({ userId, questions: rawQuestions, sessionType, topicId, paperId, bookmarkedIds, topicName }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const qs = rawQuestions as unknown as Question[];

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selected: string; isCorrect: boolean; timeSec: number }>>({});
  const [revealed, setRevealed] = useState<Set<string>>(new Set()); // revealed after answering
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(bookmarkedIds));
  const [sessionDone, setSessionDone] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [subjectiveResults, setSubjectiveResults] = useState<Record<string, {
    answerText: string; score: number; maxMarks: number; feedback: string;
    rubricScores: Record<string, number>; keyPointsMissed: string[]; grade: string; timeSec: number;
  }>>({});
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    createSession();
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  async function createSession() {
    const { data } = await (supabase.from("practice_sessions") as any).insert({
      user_id: userId,
      session_type: sessionType as "topic"|"mixed"|"weak_area"|"revision"|"exam_sim"|"challenge",
      paper_id: paperId ?? null,
      topic_id: topicId ?? null,
      status: "in_progress",
      total_questions: qs.length,
      correct: 0,
      wrong: 0,
      skipped: 0,
      time_spent_sec: 0,
    }).select().single();
    if (data) setSessionId((data as any).id);
  }

  const handleAnswer = useCallback(async (questionId: string, option: string) => {
    if (answers[questionId]) return; // already answered
    const q = qs.find((q) => q.id === questionId);
    if (!q) return;
    const timeSec = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = option === q.correct_option;

    setAnswers((prev) => ({ ...prev, [questionId]: { selected: option, isCorrect, timeSec } }));
    setRevealed((prev) => new Set(prev).add(questionId));

    // Save to DB
    if (sessionId) {
      await (supabase.from("practice_responses") as any).insert({
        session_id: sessionId,
        question_id: questionId,
        user_id: userId,
        selected_option: option,
        is_correct: isCorrect,
        time_spent_sec: timeSec,
        is_bookmarked: bookmarks.has(questionId),
        attempt_seq: 1,
      });

      // Update topic progress
      await (supabase as any).rpc("update_topic_progress", {
        p_user_id: userId,
        p_topic_id: q.topic_id,
        p_correct: isCorrect ? 1 : 0,
        p_attempted: 1,
      });
    }
  }, [answers, qs, questionStartTime, sessionId, userId, bookmarks]);

  const handleSkip = useCallback(() => {
    const q = qs[current];
    setSkipped((prev) => new Set(prev).add(q.id));
    goNext();
  }, [current, qs]);

  function goNext() {
    if (current < qs.length - 1) {
      setCurrent(current + 1);
      setQuestionStartTime(Date.now());
    }
  }

  function goPrev() {
    if (current > 0) {
      setCurrent(current - 1);
      setQuestionStartTime(Date.now());
    }
  }

  async function toggleBookmark(questionId: string) {
    if (bookmarks.has(questionId)) {
      setBookmarks((prev) => { const s = new Set(prev); s.delete(questionId); return s; });
      await supabase.from("bookmarks").delete().eq("user_id", userId).eq("question_id", questionId);
    } else {
      setBookmarks((prev) => new Set(prev).add(questionId));
      await (supabase.from("bookmarks") as any).upsert({ user_id: userId, question_id: questionId });
    }
  }

  async function reportQuestion(questionId: string) {
    await (supabase.from("question_reports") as any).insert({
      question_id: questionId,
      user_id: userId,
      reason: "Reported from practice session",
      status: "open",
    });
    toast.success("Question reported. Thank you!");
  }

  async function explainWithAI(questionId: string) {
    if (aiExplanations[questionId] || aiLoading) return;
    const q = qs.find((q) => q.id === questionId);
    if (!q) return;
    setAiLoading(questionId);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: q.question_text,
          options: { a: q.option_a, b: q.option_b, c: q.option_c, d: q.option_d },
          correctOption: q.correct_option,
          userSelected: answers[questionId]?.selected,
          explanation: q.explanation,
          topicName: q.topics?.name,
          paperName: PAPER_NAMES[q.topics?.paper_id ?? q.paper_id],
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setAiExplanations((prev) => ({ ...prev, [questionId]: data.explanation }));
      } else {
        toast.error(data.error || "Could not generate explanation");
      }
    } catch {
      toast.error("Failed to connect to AI service");
    } finally {
      setAiLoading(null);
    }
  }

  async function handleSubjectiveAnswer(questionId: string, answerText: string) {
    const q = qs.find((q) => q.id === questionId);
    if (!q) return null;
    const timeSec = Math.floor((Date.now() - questionStartTime) / 1000);
    setEvaluatingId(questionId);

    try {
      // Save raw answer first
      if (sessionId) {
        await (supabase.from("subjective_responses") as any).insert({
          session_id: sessionId,
          question_id: questionId,
          user_id: userId,
          answer_text: answerText,
          word_count: answerText.split(/\s+/).length,
          time_spent_sec: timeSec,
        });
      }

      // Call AI evaluation
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: q.question_text,
          modelAnswer: q.model_answer,
          markingRubric: q.marking_rubric,
          studentAnswer: answerText,
          maxMarks: q.max_marks || 5,
          topicName: q.topics?.name,
          paperName: PAPER_NAMES[q.topics?.paper_id ?? q.paper_id],
        }),
      });
      const data = await res.json();

      const result = {
        answerText,
        score: data.score ?? 0,
        maxMarks: q.max_marks || 5,
        feedback: data.feedback ?? "Evaluation completed.",
        rubricScores: data.rubricScores ?? {},
        keyPointsMissed: data.keyPointsMissed ?? [],
        grade: data.grade ?? "Satisfactory",
        timeSec,
      };

      setSubjectiveResults((prev) => ({ ...prev, [questionId]: result }));
      setRevealed((prev) => new Set(prev).add(questionId));

      // Update DB with AI results
      if (sessionId) {
        await (supabase.from("subjective_responses") as any)
          .update({
            ai_score: result.score,
            ai_feedback: result.feedback,
            ai_rubric_scores: result.rubricScores,
            ai_model_used: "claude-haiku-4-5-20251001",
            evaluated_at: new Date().toISOString(),
          })
          .eq("session_id", sessionId)
          .eq("question_id", questionId);
      }

      // Update topic progress
      if (sessionId) {
        const isCorrect = result.score >= (q.max_marks || 5) * 0.5;
        await (supabase as any).rpc("update_topic_progress", {
          p_user_id: userId,
          p_topic_id: q.topic_id,
          p_correct: isCorrect ? 1 : 0,
          p_attempted: 1,
        });
      }

      return result;
    } catch {
      toast.error("Failed to evaluate answer. Please try again.");
      return null;
    } finally {
      setEvaluatingId(null);
    }
  }

  async function handleFinish() {
    clearInterval(timerRef.current!);
    const correct = Object.values(answers).filter((a) => a.isCorrect).length;
    const wrong = Object.values(answers).filter((a) => !a.isCorrect).length;

    // Calculate subjective scores
    const subjScoreTotal = Object.values(subjectiveResults).reduce((s, r) => s + r.score, 0);
    const subjMaxTotal = Object.values(subjectiveResults).reduce((s, r) => s + r.maxMarks, 0);

    if (sessionId) {
      await (supabase.from("practice_sessions") as any).update({
        status: "completed",
        correct,
        wrong,
        skipped: skipped.size,
        time_spent_sec: elapsed,
        subjective_score: subjScoreTotal,
        subjective_total: subjMaxTotal,
        completed_at: new Date().toISOString(),
      }).eq("id", sessionId);

      // Update study streak
      await (supabase as any).rpc("update_study_streak", { p_user_id: userId });
    }
    setSessionDone(true);
  }

  if (sessionDone) {
    return (
      <SessionSummary
        questions={qs}
        answers={answers}
        skipped={skipped}
        totalTime={elapsed}
        sessionType={sessionType}
        topicName={topicName}
        subjectiveResults={subjectiveResults}
      />
    );
  }

  if (qs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">📭</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No questions available</h2>
        <p className="text-gray-500 mb-6">Questions are being added to this section. Check back soon!</p>
        <Button onClick={() => router.push("/practice")}>← Back to Practice</Button>
      </div>
    );
  }

  const q = qs[current];
  const isAnswered = !!answers[q.id] || !!subjectiveResults[q.id];
  const answer = answers[q.id];
  const isBookmarked = bookmarks.has(q.id);
  const correct = Object.values(answers).filter((a) => a.isCorrect).length;
  const total_answered = Object.keys(answers).length + Object.keys(subjectiveResults).length;

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
      {/* Session header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900">
            {topicName ?? `${sessionType.replace("_", " ")} Practice`}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Q{current + 1}/{qs.length} · {total_answered} answered · {calculateAccuracy(correct, total_answered || 1)}% accuracy
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            {formatTime(elapsed)}
          </div>
          <Button variant="outline" size="sm" onClick={handleFinish}>
            <BarChart3 className="h-4 w-4 mr-1" />
            End Session
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Progress value={(current / qs.length) * 100} className="h-1.5" />

      {/* Question card */}
      <Card>
        <CardContent className="p-6">
          {/* Question meta */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">Q{current + 1}</Badge>
              <Badge
                variant={q.difficulty === "hard" ? "destructive" : q.difficulty === "medium" ? "warning" : "secondary"}
                className="text-xs capitalize"
              >
                {q.difficulty}
              </Badge>
              <span className="text-xs text-gray-500">
                {PAPER_NAMES[q.topics?.paper_id ?? q.paper_id]} · {q.topics?.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(q.id)}
                className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? "text-blue-500 bg-blue-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                title={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
              </button>
              <button
                onClick={() => reportQuestion(q.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Report question"
              >
                <Flag className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Question text */}
          <p className="text-gray-900 font-medium leading-relaxed mb-6 text-base">{q.question_text}</p>

          {/* Options */}
          {q.question_type === "mcq" && (
            <div className="space-y-3">
              {(["a", "b", "c", "d"] as const).map((opt) => {
                const text = q[`option_${opt}` as keyof Question] as string;
                if (!text) return null;
                const isSelected = answer?.selected === opt;
                const isCorrectOpt = q.correct_option === opt;
                let cls = "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50";
                if (isAnswered) {
                  if (isCorrectOpt) cls = "border-green-400 bg-green-50 text-green-900";
                  else if (isSelected && !isCorrectOpt) cls = "border-red-400 bg-red-50 text-red-900";
                  else cls = "border-gray-100 bg-gray-50 text-gray-500";
                } else if (isSelected) {
                  cls = "border-blue-500 bg-blue-50 text-blue-900";
                }

                return (
                  <button
                    key={opt}
                    onClick={() => !isAnswered && handleAnswer(q.id, opt)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${cls} ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 flex-shrink-0 ${
                      isAnswered && isCorrectOpt ? "bg-green-500 text-white"
                      : isAnswered && isSelected && !isCorrectOpt ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-500"
                    }`}>
                      {opt.toUpperCase()}
                    </span>
                    {text}
                    {isAnswered && isCorrectOpt && <CheckCircle2 className="inline h-4 w-4 text-green-500 ml-2" />}
                    {isAnswered && isSelected && !isCorrectOpt && <XCircle className="inline h-4 w-4 text-red-500 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Subjective Answer */}
          {q.question_type === "subjective" && (
            <SubjectiveAnswer
              questionId={q.id}
              maxMarks={q.max_marks || 5}
              modelAnswer={q.model_answer ?? undefined}
              onSubmit={(text) => handleSubjectiveAnswer(q.id, text)}
              existingResult={subjectiveResults[q.id]}
              isEvaluating={evaluatingId === q.id}
            />
          )}

          {/* Explanation */}
          {isAnswered && q.question_type === "mcq" && (
            <div className="mt-5 space-y-3 animate-slide-up">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  {answer.isCorrect ? (
                    <><CheckCircle2 className="h-4 w-4 text-green-600" /><span className="text-sm font-bold text-green-700">Correct!</span></>
                  ) : (
                    <><XCircle className="h-4 w-4 text-red-600" /><span className="text-sm font-bold text-red-700">Incorrect</span>
                    <span className="text-xs text-gray-500 ml-1">· Correct answer: {q.correct_option?.toUpperCase()}</span></>
                  )}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>
              </div>

              {/* AI Explain Button */}
              {!aiExplanations[q.id] && (
                <button
                  onClick={() => explainWithAI(q.id)}
                  disabled={aiLoading === q.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 text-sm font-medium hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`h-4 w-4 ${aiLoading === q.id ? "animate-spin" : ""}`} />
                  {aiLoading === q.id ? "Thinking..." : "Explain with AI"}
                </button>
              )}

              {/* AI Explanation */}
              {aiExplanations[q.id] && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-bold text-purple-700">AI Explanation</span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{aiExplanations[q.id]}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goPrev} disabled={current === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </Button>

        <div className="flex items-center gap-2">
          {!isAnswered && (
            <Button variant="ghost" onClick={handleSkip} disabled={current === qs.length - 1}>
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
          )}
          {current === qs.length - 1 ? (
            <Button onClick={handleFinish} className="min-w-36">
              Finish Session
            </Button>
          ) : (
            <Button onClick={goNext}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
