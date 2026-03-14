"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDuration, calculateAccuracy, getHeatClass } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";

interface Question {
  id: string;
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
  attemptId: string;
  questions: Question[];
  answers: Record<string, string>;
  mock: Record<string, unknown>;
  topicTimes: Record<string, number>;
}

export function MockTestReport({ userId, attemptId, questions, answers, mock, topicTimes }: Props) {
  const supabase = createClient();
  const [previousAttempts, setPreviousAttempts] = useState<Array<{ percentage: number; started_at: string }>>([]);
  const [topics, setTopics] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [attemptsRes, topicsRes] = await Promise.all([
      supabase
        .from("mock_test_attempts")
        .select("percentage, started_at")
        .eq("user_id", userId)
        .eq("mock_test_id", mock.id as string)
        .eq("status", "completed")
        .order("started_at"),
      supabase.from("topics").select("id, name"),
    ]);
    setPreviousAttempts(attemptsRes.data ?? []);
    setTopics(topicsRes.data ?? []);
  }

  const paper = mock.papers as Record<string, unknown>;
  const negMarking = (paper?.negative_marking as number) ?? 0;

  // Compute scores
  let rawScore = 0;
  const correct: string[] = [];
  const wrong: string[] = [];
  const unanswered: string[] = [];

  for (const q of questions) {
    const sel = answers[q.id];
    if (!sel) { unanswered.push(q.id); continue; }
    if (sel === q.correct_option) { rawScore += 1; correct.push(q.id); }
    else { rawScore -= negMarking; wrong.push(q.id); }
  }

  const netScore = Math.max(0, rawScore);
  const percentage = (netScore / questions.length) * 100;
  const passed = percentage >= 40;

  // Topic-wise accuracy
  const topicMap: Record<string, { correct: number; total: number; name: string }> = {};
  for (const q of questions) {
    const tId = q.topic_id;
    const tName = q.topics?.name ?? topics.find((t) => t.id === tId)?.name ?? "Unknown";
    if (!topicMap[tId]) topicMap[tId] = { correct: 0, total: 0, name: tName };
    topicMap[tId].total++;
    if (correct.includes(q.id)) topicMap[tId].correct++;
  }

  // Time analytics
  const avgTime = questions.length > 0
    ? Math.round(Object.values(topicTimes).reduce((s, t) => s + t, 0) / questions.length)
    : 0;

  const dangerTopics = Object.entries(topicMap).filter(([, v]) => v.total > 0 && (v.correct / v.total) < 0.4);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up p-4 md:p-6">
      {/* Hero */}
      <div className="text-center py-6">
        <div className="text-5xl mb-3">{passed ? "🏆" : "📚"}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Mock {mock.test_number as number} Complete
        </h1>
        <p className="text-gray-500">Paper {mock.paper_id as number}</p>
      </div>

      {/* Score card */}
      <Card className={`border-0 ${passed ? "bg-gradient-to-r from-green-600 to-emerald-600" : "bg-gradient-to-r from-red-500 to-rose-600"} text-white`}>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold">{percentage.toFixed(1)}%</div>
              <div className="text-sm opacity-80">Score</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-200">{correct.length}</div>
              <div className="text-sm opacity-80">Correct</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-200">{wrong.length}</div>
              <div className="text-sm opacity-80">Wrong</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white/70">{unanswered.length}</div>
              <div className="text-sm opacity-80">Unanswered</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Badge variant="outline" className={`border-white/50 text-white text-sm ${passed ? "" : ""}`}>
              {passed ? "✓ Above 40% — Passed this paper" : "✗ Below 40% — Needs improvement"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Time analytics */}
      <Card>
        <CardContent className="p-4 flex items-center justify-around text-center">
          <div><div className="font-bold text-gray-900">{formatDuration(avgTime)}</div><div className="text-xs text-gray-500">Avg per question</div></div>
          <div><div className="font-bold text-gray-900">{calculateAccuracy(correct.length, questions.length - unanswered.length)}%</div><div className="text-xs text-gray-500">Attempt accuracy</div></div>
          <div><div className="font-bold text-gray-900">{Math.round((questions.length - unanswered.length) / questions.length * 100)}%</div><div className="text-xs text-gray-500">Attempt rate</div></div>
        </CardContent>
      </Card>

      {/* Topic-wise */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Topic-wise Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(topicMap).map(([topicId, { correct: c, total, name }]) => {
              const pct = Math.round((c / total) * 100);
              return (
                <div key={topicId} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-48 flex-shrink-0 truncate">{name}</span>
                  <Progress value={pct} className="flex-1 h-2" indicatorClassName={pct >= 60 ? "bg-green-500" : pct >= 40 ? "bg-yellow-500" : "bg-red-500"} />
                  <span className={`text-sm font-bold w-10 text-right ${pct >= 60 ? "text-green-600" : pct >= 40 ? "text-yellow-600" : "text-red-600"}`}>{pct}%</span>
                  <span className="text-xs text-gray-400 w-12">{c}/{total}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Danger zones */}
      {dangerTopics.length > 0 && (
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Danger Zone — Needs Urgent Revision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {dangerTopics.map(([topicId, { name }]) => (
                <Link key={topicId} href={`/practice/session?type=topic&topicId=${topicId}`}>
                  <Badge variant="destructive" className="cursor-pointer hover:opacity-80">
                    {name} → Practice now
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wrong answers review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            Wrong Answers ({wrong.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {wrong.map((qId) => {
              const q = questions.find((q) => q.id === qId);
              if (!q) return null;
              const correctText = q[`option_${q.correct_option}` as keyof Question] as string;
              const selectedText = q[`option_${answers[qId]}` as keyof Question] as string;
              return (
                <div key={qId} className="border border-red-100 rounded-xl p-4 bg-red-50/20">
                  <p className="text-sm font-medium text-gray-900 mb-2">{q.question_text}</p>
                  <div className="space-y-1 text-sm mb-2">
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="h-3 w-3 flex-shrink-0" />
                      Your answer: {answers[qId].toUpperCase()} — {selectedText}
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                      Correct: {q.correct_option?.toUpperCase()} — {correctText}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 bg-white p-2 rounded border border-blue-100">{q.explanation}</p>
                </div>
              );
            })}
            {wrong.length === 0 && (
              <div className="text-center py-4">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Perfect — no wrong answers!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trend */}
      {previousAttempts.length > 1 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Score Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-16">
              {previousAttempts.map((a, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(a.percentage / 100) * 56}px`, minHeight: "4px" }}
                  />
                  <span className="text-xs text-gray-500">{i + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Link href="/mock-tests" className="flex-1">
          <Button variant="outline" className="w-full">← All Mock Tests</Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full">Dashboard <ArrowRight className="h-4 w-4 ml-1" /></Button>
        </Link>
      </div>
    </div>
  );
}
