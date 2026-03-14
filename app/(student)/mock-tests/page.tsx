import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export const metadata = { title: "Mock Tests" };

const PAPERS = [
  { id: 1, name: "Accounts",  color: "blue",   emoji: "📊" },
  { id: 2, name: "Laws",      color: "purple", emoji: "⚖️" },
  { id: 3, name: "Maths",     color: "green",  emoji: "🔢" },
  { id: 4, name: "Economics", color: "orange", emoji: "📈" },
];

export default async function MockTestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [mocksRes, attemptsRes, practiceRes, subRes] = await Promise.all([
    supabase.from("mock_tests").select("*").eq("is_active", true).order("paper_id").order("test_number"),
    supabase.from("mock_test_attempts").select("mock_test_id, total_score, percentage, status, started_at").eq("user_id", user.id).eq("status", "completed"),
    supabase.from("practice_sessions").select("paper_id", { count: "exact" }).eq("user_id", user.id).eq("status", "completed"),
    supabase.from("subscriptions").select("tier, papers_unlocked").eq("user_id", user.id).single(),
  ]);

  const mocks = (mocksRes.data as any[]) ?? [];
  const attempts = (attemptsRes.data as any[]) ?? [];
  const subscription = subRes.data as any;

  // Count practice sessions per paper
  const { count: totalPracticeSessions } = await supabase
    .from("practice_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  const attemptMap = Object.fromEntries(
    attempts.map((a: any) => [a.mock_test_id, a])
  );

  // Check unlock conditions
  function isUnlocked(mock: any): boolean {
    const condition = mock.unlock_condition as string;
    if (condition === "always") return true;
    if (condition === "after_500_questions") return (totalPracticeSessions ?? 0) >= 500;
    if (condition === "after_mock_3") {
      const paper_id = mock.paper_id as number;
      const mock3 = mocks.find((m: any) => m.paper_id === paper_id && m.test_number === 3);
      return mock3 ? !!attemptMap[mock3.id] : false;
    }
    if (condition === "within_60_days") return true; // simplified
    return false;
  }

  const isFreeTier = subscription?.tier === "free" || !subscription;

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mock Test Series</h1>
        <p className="text-gray-500 mt-1">Full-length ICAI-pattern tests with detailed analytics</p>
      </div>

      {isFreeTier && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-blue-900">Free tier: Mock Test 1 available for all papers</p>
            <p className="text-sm text-blue-700 mt-0.5">Upgrade to unlock all 40 mock tests</p>
          </div>
          <Link href="/upgrade">
            <Button size="sm">Upgrade →</Button>
          </Link>
        </div>
      )}

      {PAPERS.map((paper) => {
        const paperMocks = mocks.filter((m: any) => m.paper_id === paper.id);
        const completedCount = paperMocks.filter((m: any) => attemptMap[m.id]).length;
        const avgScore = completedCount > 0
          ? Math.round(paperMocks.filter((m: any) => attemptMap[m.id]).reduce((s: number, m: any) => s + (attemptMap[m.id]?.percentage ?? 0), 0) / completedCount)
          : null;

        return (
          <div key={paper.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{paper.emoji}</span>
                <div>
                  <h2 className="font-bold text-gray-900">Paper {paper.id} — {paper.name}</h2>
                  <p className="text-sm text-gray-500">{completedCount}/{paperMocks.length} completed{avgScore !== null ? ` · Avg ${avgScore}%` : ""}</p>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {paperMocks.map((mock: any) => {
                const attempt = attemptMap[mock.id];
                const unlocked = isUnlocked(mock) && (!isFreeTier || mock.test_number === 1);
                const isPassed = (attempt?.percentage ?? 0) >= 40;

                return (
                  <Card
                    key={mock.id}
                    className={`relative transition-all ${unlocked ? "hover:shadow-md" : "opacity-60"}`}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">#{mock.test_number}</div>
                      <Badge
                        variant={mock.difficulty_label === "exam-mode" ? "destructive" : mock.difficulty_label === "warm-up" ? "success" : "secondary"}
                        className="text-xs mb-3 capitalize"
                      >
                        {mock.difficulty_label}
                      </Badge>

                      {attempt ? (
                        <div className="mb-3">
                          <div className={`text-2xl font-bold ${isPassed ? "text-green-600" : "text-red-600"}`}>
                            {attempt.percentage?.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {isPassed ? "Passed" : "Below 40%"}
                          </div>
                          <CheckCircle2 className={`h-4 w-4 mx-auto mt-1 ${isPassed ? "text-green-500" : "text-orange-400"}`} />
                        </div>
                      ) : (
                        <div className="mb-3">
                          {unlocked ? (
                            <Clock className="h-6 w-6 mx-auto text-gray-300 mb-1" />
                          ) : (
                            <Lock className="h-6 w-6 mx-auto text-gray-300 mb-1" />
                          )}
                          <div className="text-xs text-gray-400">{unlocked ? "Not attempted" : "Locked"}</div>
                        </div>
                      )}

                      {unlocked ? (
                        <Link href={`/mock-tests/${mock.id}`}>
                          <Button size="sm" variant={attempt ? "outline" : "default"} className="w-full">
                            {attempt ? "Retake" : "Start"}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full" disabled>
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
