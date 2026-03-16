"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils";
import { Clock, ChevronRight, SkipForward } from "lucide-react";
import type { DiagnosticTier } from "./diagnostic-flow";

interface Question {
  id: string;
  paper_id: number;
  topic_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
  topics: { name: string };
}

interface Props {
  userId: string;
  sessionId: string;
  diagnosticTier: DiagnosticTier;
  onComplete: () => void;
}

const PAPER_NAMES: Record<number, string> = {
  1: "Accounts", 2: "Laws", 3: "Maths", 4: "Economics"
};

const TIER_CONFIG: Record<DiagnosticTier, {
  duration: number;
  questionsPerPaper: { easy: number; medium: number; hard: number };
  totalCap: number;
  title: string;
  subtitle: string;
}> = {
  aptitude: {
    duration: 15 * 60,
    questionsPerPaper: { easy: 4, medium: 0, hard: 0 },
    totalCap: 15,
    title: "Aptitude Assessment",
    subtitle: "Quick baseline check — don't worry if you can't answer everything",
  },
  foundation: {
    duration: 25 * 60,
    questionsPerPaper: { easy: 5, medium: 2, hard: 1 },
    totalCap: 30,
    title: "Foundation Assessment",
    subtitle: "Testing your basics across all 4 papers",
  },
  intermediate: {
    duration: 35 * 60,
    questionsPerPaper: { easy: 3, medium: 5, hard: 3 },
    totalCap: 45,
    title: "Intermediate Diagnostic",
    subtitle: "Comprehensive assessment of your preparation level",
  },
  advanced: {
    duration: 45 * 60,
    questionsPerPaper: { easy: 5, medium: 7, hard: 3 },
    totalCap: 60,
    title: "Full Diagnostic Assessment",
    subtitle: "Deep profiling across all topics and difficulty levels",
  },
};

const TIER_LABELS: Record<DiagnosticTier, string> = {
  aptitude: "Aptitude",
  foundation: "Foundation",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function DiagnosticTest({ userId, sessionId, diagnosticTier, onComplete }: Props) {
  const supabase = createClient();
  const config = TIER_CONFIG[diagnosticTier];

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(config.duration);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions
  useEffect(() => {
    loadQuestions();
  }, []);

  // Timer
  useEffect(() => {
    if (questions.length === 0) return;
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
    return () => clearInterval(timerRef.current!);
  }, [questions.length]);

  async function loadQuestions() {
    try {
      // Check if responses already exist for this session
      const { data: existingResponsesData } = await supabase
        .from("diagnostic_responses")
        .select("question_id, selected_option")
        .eq("session_id", sessionId);

      const existingResponses = (existingResponsesData as any[]) ?? [];
      const existingMap: Record<string, string> = {};
      existingResponses.forEach((r: any) => {
        if (r.selected_option) existingMap[r.question_id] = r.selected_option;
      });

      if (Object.keys(existingMap).length > 0) {
        setAnswers(existingMap);
      }

      const allQuestions: Question[] = [];
      const { questionsPerPaper, totalCap } = config;

      // For all tiers, loop through papers and fetch questions per difficulty
      for (const paperId of [1, 2, 3, 4]) {
        for (const [diff, count] of [
          ["easy", questionsPerPaper.easy],
          ["medium", questionsPerPaper.medium],
          ["hard", questionsPerPaper.hard],
        ] as [string, number][]) {
          if (count === 0) continue;
          const { data } = await supabase
            .from("questions")
            .select("*, topics(name)")
            .eq("paper_id", paperId)
            .eq("difficulty", diff as "easy" | "medium" | "hard")
            .eq("status", "approved")
            .eq("is_diagnostic", true)
            .limit(count);
          if (data) allQuestions.push(...(data as Question[]));
        }
      }

      // Cap total questions
      const capped = allQuestions.slice(0, totalCap);

      if (capped.length === 0) {
        toast.error("No diagnostic questions available yet. Please contact support.");
        return;
      }

      setQuestions(capped);
    } catch (err) {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  }

  const handleAnswer = useCallback(async (questionId: string, option: string) => {
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    setAnswers((prev) => ({ ...prev, [questionId]: option }));

    // Save response to DB
    const question = questions.find((q) => q.id === questionId);
    const isCorrect = question?.correct_option === option;

    await (supabase.from("diagnostic_responses") as any).upsert({
      session_id: sessionId,
      question_id: questionId,
      selected_option: option,
      is_correct: isCorrect,
      time_spent_sec: timeTaken,
    }, { onConflict: "session_id,question_id" });
  }, [questionStartTime, questions, sessionId]);

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setQuestionStartTime(Date.now());
    }
  }

  function handleSkip() {
    handleNext();
  }

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current!);

    try {
      // Mark session as completed
      await (supabase.from("diagnostic_sessions") as any)
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", sessionId);

      // Compute readiness scores
      await computeAndSaveScores();

      toast.success("Diagnostic complete! Generating your profile...");
      onComplete();
    } catch (err) {
      toast.error("Failed to submit. Please try again.");
      setSubmitting(false);
    }
  }, [submitting, sessionId, answers, questions]);

  async function computeAndSaveScores() {
    // Fetch all responses for this session
    const { data: responsesData } = await supabase
      .from("diagnostic_responses")
      .select("question_id, is_correct")
      .eq("session_id", sessionId);

    const responses = (responsesData as any[]) ?? [];
    if (!responses) return;

    const correctMap = new Set(responses.filter((r: any) => r.is_correct).map((r: any) => r.question_id));

    // Per-paper scores
    const paperScores: Record<string, number> = {};
    const paperTotals: Record<string, number> = {};
    const topicScores: Record<string, { correct: number; total: number }> = {};

    for (const q of questions) {
      const paperKey = String(q.paper_id);
      if (!paperScores[paperKey]) paperScores[paperKey] = 0;
      if (!paperTotals[paperKey]) paperTotals[paperKey] = 0;

      paperTotals[paperKey]++;
      if (correctMap.has(q.id)) paperScores[paperKey]++;

      if (!topicScores[q.topic_id]) topicScores[q.topic_id] = { correct: 0, total: 0 };
      topicScores[q.topic_id].total++;
      if (correctMap.has(q.id)) topicScores[q.topic_id].correct++;
    }

    // Normalize paper scores to 0-100 using actual questions per paper
    const paperScoresNorm: Record<string, number> = {};
    for (const [k, v] of Object.entries(paperScores)) {
      const total = paperTotals[k] || 1;
      paperScoresNorm[k] = Math.round((v / total) * 100);
    }

    const paperCount = Object.keys(paperScoresNorm).length || 1;
    const overall = Math.round(Object.values(paperScoresNorm).reduce((a, b) => a + b, 0) / paperCount);

    // Topic scores with colour
    const topicScoresOut: Record<string, { score: number; color: string }> = {};
    for (const [tid, { correct, total }] of Object.entries(topicScores)) {
      const pct = Math.round((correct / total) * 100);
      const color = pct >= 75 ? "green" : pct >= 50 ? "amber" : "red";
      topicScoresOut[tid] = { score: pct, color };
    }

    // Get self-assessment data
    const { data: profileData } = await supabase
      .from("student_profiles")
      .select("self_assessment")
      .eq("user_id", userId)
      .single();

    const profile = profileData as any;

    await (supabase.from("readiness_scores") as any).upsert({
      user_id: userId,
      overall_score: overall,
      paper_scores: paperScoresNorm,
      topic_scores: topicScoresOut,
      sub_topic_scores: {},
      self_assessment: profile?.self_assessment ?? {},
      computed_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    // Mark diagnostic completed on profile
    await (supabase.from("student_profiles") as any)
      .update({
        diagnostic_completed_at: new Date().toISOString(),
        diagnostic_locked_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("user_id", userId);

    // Seed a free subscription if none exists
    await (supabase.from("subscriptions") as any).upsert({
      user_id: userId,
      tier: "free",
      papers_unlocked: [],
      valid_from: new Date().toISOString(),
      valid_until: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: "user_id" });

    // Init study streak
    await (supabase.from("study_streaks") as any).upsert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: new Date().toISOString().split("T")[0],
    }, { onConflict: "user_id" });
  }

  // Compute per-paper question counts from actual loaded questions
  function getQuestionsForPaper(paperId: number): Question[] {
    return questions.filter((q) => q.paper_id === paperId);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Loading your diagnostic questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-600">No questions available. Please contact support.</p>
      </div>
    );
  }

  const q = questions[current];
  const answered = answers[q.id];
  const answered_count = Object.keys(answers).length;
  const timerColor = timeLeft <= 600 ? "text-red-600" : timeLeft <= 1800 ? "text-yellow-600" : "text-gray-700";

  // Determine which paper group the current question belongs to
  const currentPaperId = q.paper_id;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Test header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {config.title}
          </h1>
          <p className="text-sm text-gray-500">{config.subtitle}</p>
          <p className="text-sm text-gray-500 mt-0.5">{answered_count} of {questions.length} answered</p>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timerColor}`}>
          <Clock className="h-5 w-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={(current / questions.length) * 100} className="mb-4 h-2" />

      {/* Tier info banner — shown for aptitude and foundation tiers */}
      {(diagnosticTier === "aptitude" || diagnosticTier === "foundation") && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
          <span className="font-semibold">{TIER_LABELS[diagnosticTier]} tier</span>
          {" — "}
          {diagnosticTier === "aptitude"
            ? "This is a quick aptitude check to understand your baseline. Don't worry if you can't answer all questions — this helps us plan your study journey."
            : "We're testing your basics across all 4 papers. Take your time — accuracy matters more than speed at this stage."}
        </div>
      )}

      {/* Tier info banner for intermediate and advanced */}
      {(diagnosticTier === "intermediate" || diagnosticTier === "advanced") && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4 text-sm text-indigo-800">
          <span className="font-semibold">{TIER_LABELS[diagnosticTier]} tier</span>
          {" — "}
          {diagnosticTier === "intermediate"
            ? "This comprehensive test covers medium and hard questions to accurately gauge your preparation level."
            : "Full diagnostic across all topics and difficulty levels. This will give us the most detailed picture of your strengths and gaps."}
        </div>
      )}

      {/* Paper indicator */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[1, 2, 3, 4].map((p) => {
          const paperQuestions = getQuestionsForPaper(p);
          const paperTotal = paperQuestions.length;
          if (paperTotal === 0) return null;
          const paperAnswered = paperQuestions.filter((pq) => answers[pq.id]).length;
          return (
            <Badge
              key={p}
              variant={currentPaperId === p ? "default" : "secondary"}
              className="text-xs"
            >
              P{p}: {paperAnswered}/{paperTotal}
            </Badge>
          );
        })}
      </div>

      {/* Question card */}
      <Card className="mb-4">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Q{current + 1}/{questions.length}</Badge>
              <Badge
                variant={q.difficulty === "hard" ? "destructive" : q.difficulty === "medium" ? "warning" : "secondary"}
                className="text-xs capitalize"
              >
                {q.difficulty}
              </Badge>
              <span className="text-xs text-gray-500">{PAPER_NAMES[q.paper_id]} · {q.topics?.name}</span>
            </div>
          </div>

          <p className="text-gray-900 font-medium leading-relaxed mb-6 text-base">{q.question_text}</p>

          {/* Options */}
          <div className="space-y-3">
            {(["a", "b", "c", "d"] as const).map((opt) => {
              const text = q[`option_${opt}` as keyof Question] as string;
              if (!text) return null;
              const isSelected = answered === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(q.id, opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${
                    isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {opt.toUpperCase()}
                  </span>
                  {text}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleSkip}
          disabled={current === questions.length - 1}
        >
          <SkipForward className="h-4 w-4 mr-1" />
          Skip
        </Button>

        <div className="flex items-center gap-3">
          {current === questions.length - 1 ? (
            <Button onClick={handleSubmit} loading={submitting} className="min-w-40">
              {diagnosticTier === "aptitude" || diagnosticTier === "foundation"
                ? "Submit Assessment"
                : "Submit Diagnostic"}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Your answers are saved automatically. You can close and resume within 72 hours.
      </p>
    </div>
  );
}
