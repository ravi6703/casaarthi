import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, FileText, Target, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { getReadinessBgColor, calculateAccuracy } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

const PAPERS = [
  { id: 1, code: "P1", name: "Accounts",  color: "blue"   },
  { id: 2, code: "P2", name: "Laws",      color: "purple" },
  { id: 3, code: "P3", name: "Maths",     color: "green"  },
  { id: 4, code: "P4", name: "Economics", color: "orange" },
];

const PAPER_COLORS: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-800 border-blue-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  green:  "bg-green-100 text-green-800 border-green-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";

  // Parallel fetch
  const [profileRes, scoresRes, streakRes, practiceRes, recsRes, mockRes] = await Promise.all([
    supabase.from("student_profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("readiness_scores").select("*").eq("user_id", user.id).single(),
    supabase.from("study_streaks").select("*").eq("user_id", user.id).single(),
    supabase.from("practice_sessions")
      .select("correct, total_questions, completed_at")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(5),
    supabase.from("recommendations")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_seen", false)
      .gte("expires_at", new Date().toISOString())
      .order("generated_at", { ascending: false })
      .limit(3),
    supabase.from("mock_test_attempts")
      .select("total_score, percentage, completed_at, mock_tests(paper_id, test_number)")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(3),
  ]);

  const profile = profileRes.data as any;
  const scores = scoresRes.data as any;
  const streak = streakRes.data as any;
  const recentPractice = (practiceRes.data as any[]) ?? [];
  const recommendations = (recsRes.data as any[]) ?? [];
  const recentMocks = (mockRes.data as any[]) ?? [];

  // If no onboarding, redirect to diagnostic
  if (!profile || !profile.onboarding_completed_at) {
    redirect("/diagnostic");
  }

  const overallScore = scores?.overall_score ?? 0;
  const paperScores: Record<string, number> = (scores?.paper_scores as Record<string, number>) ?? {};

  // Compute total practice accuracy
  const totalCorrect = recentPractice.reduce((s: number, r: any) => s + r.correct, 0);
  const totalQ = recentPractice.reduce((s: number, r: any) => s + r.total_questions, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good {getGreeting()}, {firstName(userName)} 👋</h1>
          <p className="text-gray-500 mt-1">Here is your preparation snapshot for today</p>
        </div>
        {streak && streak.current_streak > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="font-bold text-orange-700">{streak.current_streak} day streak!</div>
              <div className="text-xs text-orange-600">Keep it up</div>
            </div>
          </div>
        )}
      </div>

      {/* Readiness Score Banner */}
      <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Exam Readiness Score</p>
              <div className="flex items-end gap-3 mt-1">
                <span className="text-5xl font-bold">{overallScore}</span>
                <span className="text-blue-200 text-lg mb-1">/100</span>
              </div>
              <p className="text-blue-200 text-sm mt-1">
                {overallScore >= 70 ? "Excellent — you are on track to pass!" :
                 overallScore >= 50 ? "Good progress — keep pushing!" :
                 overallScore >= 30 ? "Getting there — focus on weak areas" :
                 "Early stage — complete your diagnostic to get guidance"}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-center">
              <ReadinessRing score={overallScore} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paper Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PAPERS.map((paper) => {
          const score = paperScores[String(paper.id)] ?? 0;
          return (
            <Card key={paper.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold mb-3 border ${PAPER_COLORS[paper.color]}`}>
                  {paper.code}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{score}<span className="text-sm text-gray-400 font-normal">/100</span></div>
                <div className="text-xs text-gray-500 mb-2">{paper.name}</div>
                <Progress value={score} className="h-1.5" indicatorClassName={score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Study Today Card — M4 Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Study Today
            </h2>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec: any) => {
                const content = rec.content as Record<string, string>;
                return (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{getRecIcon(rec.type)}</span>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{content.title ?? "Study recommendation"}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{content.description ?? ""}</div>
                        </div>
                      </div>
                      <Link href={content.action_url ?? "/practice"}>
                        <Button size="sm" variant="ghost">
                          Go <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Target className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No recommendations yet. Complete some practice sessions to get personalised guidance.</p>
                <Link href="/practice" className="mt-3 inline-block">
                  <Button size="sm">Start Practicing</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { href: "/practice", icon: <BookOpen className="h-5 w-5 text-blue-500" />, label: "Practice", sub: "Topic drill-down" },
              { href: "/mock-tests", icon: <FileText className="h-5 w-5 text-purple-500" />, label: "Mock Test", sub: "Full exam simulation" },
              { href: "/profile", icon: <TrendingUp className="h-5 w-5 text-green-500" />, label: "My Profile", sub: "Heat map & progress" },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">{action.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{action.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{action.sub}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recent Practice */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                Recent Activity
                {totalQ > 0 && (
                  <Badge variant="secondary">{calculateAccuracy(totalCorrect, totalQ)}% accuracy</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {recentPractice.length > 0 ? (
                <div className="space-y-2">
                  {recentPractice.map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{s.total_questions} questions</span>
                      <span className={`font-medium ${calculateAccuracy(s.correct, s.total_questions) >= 70 ? "text-green-600" : "text-orange-600"}`}>
                        {calculateAccuracy(s.correct, s.total_questions)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">No practice sessions yet</p>
              )}
              <Link href="/practice" className="mt-3 block">
                <Button variant="outline" size="sm" className="w-full">Start Practice →</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Mocks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Mock Tests</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {recentMocks.length > 0 ? (
                <div className="space-y-2">
                  {recentMocks.map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        P{m.mock_tests?.paper_id} · Mock {m.mock_tests?.test_number}
                      </span>
                      <span className={`font-bold ${(m.percentage ?? 0) >= 50 ? "text-green-600" : "text-red-600"}`}>
                        {m.percentage?.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">No mock tests taken yet</p>
              )}
              <Link href="/mock-tests" className="mt-3 block">
                <Button variant="outline" size="sm" className="w-full">Take a Mock →</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Diagnostic prompt if not completed */}
          {!profile.diagnostic_completed_at && (
            <Card className="border-yellow-300 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Complete your diagnostic</p>
                    <p className="text-xs text-yellow-700 mt-1">Take the 45-minute test to get your personalised study plan</p>
                    <Link href="/diagnostic">
                      <Button size="sm" className="mt-3 bg-yellow-600 hover:bg-yellow-700">Start Diagnostic →</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function firstName(name: string) {
  return name.split(" ")[0];
}

function getRecIcon(type: string) {
  const icons: Record<string, string> = {
    study_today:   "📖",
    revision_alert:"🔔",
    danger_flag:   "⚠️",
    next_level:    "🚀",
    countdown:     "⏳",
  };
  return icons[type] ?? "💡";
}

function ReadinessRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
      <circle
        cx="45" cy="45" r={r} fill="none"
        stroke="white" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
      <text x="45" y="50" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{score}</text>
    </svg>
  );
}
