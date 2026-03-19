import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { PeerComparison } from "@/components/analytics/peer-comparison";

const AnalyticsCharts = dynamic(
  () => import("@/components/analytics/analytics-charts").then((m) => m.AnalyticsCharts),
  { loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading charts...</div></div> }
);

export const metadata = { title: "Analytics" };

const PAPERS: Record<number, { name: string; color: string }> = {
  1: { name: "Accounts", color: "#3b82f6" },
  2: { name: "Laws",     color: "#8b5cf6" },
  3: { name: "Maths",    color: "#22c55e" },
  4: { name: "Economics",color: "#f97316" },
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Parallel data fetches
  const [weeklyRes, recentRes, allPracticeRes, topicRes, scoresRes] = await Promise.all([
    // Weekly practice (last 7 days)
    supabase
      .from("practice_sessions")
      .select("total_questions, completed_at")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .gte("completed_at", sevenDaysAgo.toISOString())
      .order("completed_at", { ascending: true }),

    // Recent sessions for accuracy trend (last 10)
    supabase
      .from("practice_sessions")
      .select("correct, total_questions, completed_at")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(10),

    // All practice sessions for total time
    supabase
      .from("practice_sessions")
      .select("time_spent_sec")
      .eq("user_id", user.id)
      .eq("status", "completed"),

    // Topic progress
    supabase
      .from("topic_progress")
      .select("topic_id, total_attempted, accuracy_rate")
      .eq("user_id", user.id),

    // Readiness scores (paper scores)
    supabase
      .from("readiness_scores")
      .select("overall_score, paper_scores")
      .eq("user_id", user.id)
      .single(),
  ]);

  // Peer comparison: use count queries instead of fetching all scores
  const userScore = (scoresRes.data as any)?.overall_score ?? 0;
  const [totalRes, belowRes] = await Promise.all([
    supabase.from("readiness_scores").select("id", { count: "exact", head: true }),
    supabase.from("readiness_scores").select("id", { count: "exact", head: true }).lt("overall_score", userScore),
  ]);
  const totalStudents = totalRes.count ?? 0;
  const belowUser = belowRes.count ?? 0;
  const percentile = totalStudents > 0 ? Math.round((belowUser / totalStudents) * 100) : 0;

  const weeklySessions = (weeklyRes.data as any[]) ?? [];
  const recentSessions = (recentRes.data as any[]) ?? [];
  const allPractice    = (allPracticeRes.data as any[]) ?? [];
  const topicProgress  = (topicRes.data as any[]) ?? [];
  const scores         = scoresRes.data as any;

  // ── Weekly practice: aggregate questions per day ──
  const dayMap: Record<string, number> = {};
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = 0;
  }
  for (const s of weeklySessions) {
    if (s.completed_at) {
      const key = new Date(s.completed_at).toISOString().slice(0, 10);
      if (key in dayMap) dayMap[key] += s.total_questions;
    }
  }
  const weeklyPractice = Object.entries(dayMap).map(([dateStr, questions]) => {
    const d = new Date(dateStr);
    return { day: dayNames[d.getDay()], questions };
  });

  // ── Accuracy trend (reversed so oldest first) ──
  const accuracyTrend = [...recentSessions].reverse().map((s, i) => ({
    session: `#${i + 1}`,
    accuracy: s.total_questions > 0 ? Math.round((s.correct / s.total_questions) * 100) : 0,
  }));

  // ── Paper-wise performance ──
  const paperScores: Record<string, number> = (scores?.paper_scores as Record<string, number>) ?? {};
  const paperPerformance = Object.entries(PAPERS).map(([id, info]) => ({
    paper: info.name,
    score: paperScores[id] ?? 0,
    fill: info.color,
  }));

  // ── Total hours ──
  const totalSeconds = allPractice.reduce((s: number, r: any) => s + (r.time_spent_sec ?? 0), 0);
  const totalHours = totalSeconds / 3600;
  const totalSessions = allPractice.length;

  // ── Topic mastery distribution ──
  let strong = 0, good = 0, average = 0, weak = 0;
  for (const t of topicProgress) {
    if (t.total_attempted === 0) continue;
    const acc = t.accuracy_rate ?? 0;
    if (acc >= 80) strong++;
    else if (acc >= 60) good++;
    else if (acc >= 40) average++;
    else weak++;
  }
  const topicMastery = [
    { name: "Strong",  value: strong },
    { name: "Good",    value: good },
    { name: "Average", value: average },
    { name: "Weak",    value: weak },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your preparation progress over time</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Dashboard
          </Button>
        </Link>
      </div>

      {/* Peer Comparison */}
      <PeerComparison percentile={percentile} totalStudents={totalStudents} userScore={userScore} />

      <AnalyticsCharts
        weeklyPractice={weeklyPractice}
        accuracyTrend={accuracyTrend}
        paperPerformance={paperPerformance}
        totalHours={totalHours}
        totalSessions={totalSessions}
        topicMastery={topicMastery}
      />
    </div>
  );
}
