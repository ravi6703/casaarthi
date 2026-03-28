import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getHeatClass } from "@/lib/utils";
import dynamic from "next/dynamic";
import { PersonalInfoForm } from "@/components/profile/personal-info-form";
import { BadgeGallery } from "@/components/profile/badge-gallery";
import { ReferralCard } from "@/components/profile/referral-card";

const TopicHeatCharts = dynamic(
  () => import("@/components/profile/topic-heat-charts").then((m) => m.TopicHeatCharts),
  { loading: () => <div className="h-48 flex items-center justify-center text-gray-400 animate-pulse">Loading charts...</div> }
);

export const metadata = { title: "My Profile" };

const PAPERS = [
  { id: 1, name: "Accounts",  short: "P1" },
  { id: 2, name: "Laws",      short: "P2" },
  { id: 3, name: "Maths",     short: "P3" },
  { id: 4, name: "Economics", short: "P4" },
];

const SELF_ASSESSMENT_NUM: Record<string, number> = {
  "Very Weak": 20, "Weak": 35, "Average": 50, "Good": 70, "Very Good": 85,
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [scoresRes, profileRes, topicsRes, streakRes, progressRes] = await Promise.all([
    supabase.from("readiness_scores").select("*").eq("user_id", user.id).single(),
    supabase.from("student_profiles").select("*").eq("user_id", user.id).single(),
    supabase.from("topics").select("id, name, paper_id, slug").order("paper_id").order("sort_order"),
    supabase.from("study_streaks").select("*").eq("user_id", user.id).single(),
    supabase.from("topic_progress").select("topic_id, total_attempted, total_correct, accuracy_rate, last_practiced_at").eq("user_id", user.id),
  ]);

  const scores = scoresRes.data as any;
  const profile = profileRes.data as any;
  const topics = (topicsRes.data as any[]) ?? [];
  const streak = streakRes.data as any;
  const progress = (progressRes.data as any[]) ?? [];

  if (!profile || !profile.diagnostic_completed_at) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete your diagnostic first</h1>
        <p className="text-gray-500 mb-6">Your profile is generated after the 45-minute diagnostic test</p>
        <Link href="/diagnostic"><Button>Start Diagnostic →</Button></Link>
      </div>
    );
  }

  const overallScore = scores?.overall_score ?? 0;
  const paperScores = (scores?.paper_scores as Record<string, number>) ?? {};
  const topicScores = (scores?.topic_scores as Record<string, { score: number; color: string }>) ?? {};
  const selfAssessment = (scores?.self_assessment as Record<string, string>) ?? {};
  const progressMap = Object.fromEntries(progress.map((p: any) => [p.topic_id, p]));

  const gapFlags = Object.entries(selfAssessment).map(([paperId, selfRating]) => {
    const selfNum = SELF_ASSESSMENT_NUM[selfRating] ?? 50;
    const actualScore = paperScores[paperId] ?? 0;
    const gap = selfNum - actualScore;
    const paperName = PAPERS.find((p) => String(p.id) === paperId)?.name ?? "";
    return { paperId, paperName, selfRating, actualScore, gap };
  }).filter((g) => Math.abs(g.gap) >= 20);

  const totalAttempted = progress.reduce((s: number, p: any) => s + p.total_attempted, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Your CA Foundation preparation passport</p>
        </div>
        {profile.diagnostic_locked_until && new Date(profile.diagnostic_locked_until as string) > new Date() && (
          <Badge variant="secondary" className="text-xs">
            Retake diagnostic available {new Date(profile.diagnostic_locked_until as string).toLocaleDateString("en-IN")}
          </Badge>
        )}
      </div>

      {/* Personal Information */}
      <PersonalInfoForm
        userEmail={user.email ?? ""}
        userMetadata={user.user_metadata ?? {}}
      />

      {/* Overview cards */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] text-white border-0">
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold">{overallScore}</div>
            <div className="text-white text-opacity-90 text-sm">Readiness Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-orange-500">🔥 {streak?.current_streak ?? 0}</div>
            <div className="text-gray-500 text-sm">Day Streak</div>
            <div className="text-xs text-gray-400 mt-1">Best: {streak?.longest_streak ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-green-600">{totalAttempted}</div>
            <div className="text-gray-500 text-sm">Questions Practiced</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-purple-600">{profile.attempt_number}</div>
            <div className="text-gray-500 text-sm">Attempt Number</div>
            <div className="text-xs text-gray-400 mt-1">{profile.target_exam_cycle} {profile.target_exam_year}</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <BadgeGallery />

      {/* Refer a Friend */}
      <ReferralCard
        referralCode={profile?.referral_code ?? null}
        referralCount={profile?.referral_count ?? 0}
      />

      {/* Paper readiness */}
      <Card>
        <CardHeader><CardTitle>Paper-wise Readiness</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PAPERS.map((paper) => {
              const score = paperScores[String(paper.id)] ?? 0;
              return (
                <div key={paper.id} className="text-center p-4 rounded-xl bg-gray-50">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">{paper.short}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{score}</div>
                  <div className="text-xs text-gray-500 mb-3">{paper.name}</div>
                  <Progress value={score} className="h-2" indicatorClassName={score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Heat Map — Bar Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Topic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <TopicHeatCharts
            papers={PAPERS}
            topicsByPaper={Object.fromEntries(
              PAPERS.map((paper) => [
                paper.id,
                topics
                  .filter((t: any) => t.paper_id === paper.id)
                  .map((topic: any) => {
                    const ts = topicScores[topic.id];
                    const p = progressMap[topic.id];
                    const score = p?.total_attempted > 0 ? Math.round(p.accuracy_rate) : ts?.score ?? null;
                    return { name: topic.name, score, attempted: p?.total_attempted ?? 0 };
                  }),
              ])
            )}
          />
        </CardContent>
      </Card>

      {/* Gap vs Claim */}
      {gapFlags.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 text-base">⚠️ Gap vs. Claim Analysis</CardTitle>
            <p className="text-sm text-yellow-700">Discrepancies between your self-assessment and diagnostic performance</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gapFlags.map((g) => (
                <div key={g.paperId} className="bg-yellow-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{g.paperName}</div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Self-rated: <strong>{g.selfRating}</strong> · Diagnostic: <strong>{g.actualScore}%</strong>
                    </p>
                  </div>
                  <Badge variant={g.gap > 0 ? "destructive" : "success"}>
                    {g.gap > 0 ? "Overconfident" : "Underestimated"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Practice progress table */}
      <Card>
        <CardHeader>
          <CardTitle>Practice Progress by Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                  <th className="pb-2 font-medium">Topic</th>
                  <th className="pb-2 font-medium text-right">Attempted</th>
                  <th className="pb-2 font-medium text-right">Accuracy</th>
                  <th className="pb-2 font-medium text-right">Last Practiced</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topics.filter((t: any) => progressMap[t.id]?.total_attempted > 0).map((topic: any) => {
                  const p = progressMap[topic.id];
                  const daysSince = p?.last_practiced_at
                    ? Math.floor((Date.now() - new Date(p.last_practiced_at).getTime()) / 86400000)
                    : null;
                  return (
                    <tr key={topic.id} className="hover:bg-gray-50">
                      <td className="py-2.5 font-medium text-gray-900">{topic.name}</td>
                      <td className="py-2.5 text-right text-gray-600">{p?.total_attempted}</td>
                      <td className="py-2.5 text-right">
                        <span className={`font-bold ${p?.accuracy_rate >= 70 ? "text-green-600" : p?.accuracy_rate >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                          {Math.round(p?.accuracy_rate ?? 0)}%
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-gray-500 text-xs">
                        {daysSince !== null ? (daysSince === 0 ? "Today" : `${daysSince}d ago`) : "—"}
                        {daysSince !== null && daysSince >= 7 && <span className="ml-1 text-orange-500">⚠️</span>}
                      </td>
                      <td className="py-2.5 text-right">
                        <Link href={`/practice/session?type=topic&topicId=${topic.id}`}>
                          <Button size="sm" variant="ghost" className="text-xs h-7">Practice</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {progress.filter((p: any) => p.total_attempted > 0).length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No practice sessions recorded yet</p>
                <Link href="/practice" className="mt-2 inline-block">
                  <Button size="sm">Start Practicing →</Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
