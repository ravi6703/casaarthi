import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";
import LeaderboardTabs from "@/components/leaderboard/leaderboard-tabs";

export const metadata = { title: "Leaderboard — CA Saarthi" };

type LeaderboardEntry = {
  user_id: string;
  name: string;
  value: number;
  rank: number;
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = await createAdminClient();

  // Fetch top 50 for each leaderboard category (avoids fetching all users)
  const [scoresRes, streaksRes, progressRes] = await Promise.all([
    admin.from("readiness_scores").select("user_id, overall_score").order("overall_score", { ascending: false }).gt("overall_score", 0).limit(50),
    admin.from("study_streaks").select("user_id, current_streak").order("current_streak", { ascending: false }).gt("current_streak", 0).limit(50),
    admin.from("topic_progress").select("user_id, total_attempted").gt("total_attempted", 0),
  ]);

  const scores = (scoresRes.data as any[]) ?? [];
  const streaks = (streaksRes.data as any[]) ?? [];
  const progress = (progressRes.data as any[]) ?? [];

  // Collect unique user IDs from top entries only
  const allUserIds = new Set<string>();
  scores.forEach((r: any) => allUserIds.add(r.user_id));
  streaks.forEach((r: any) => allUserIds.add(r.user_id));
  progress.forEach((r: any) => allUserIds.add(r.user_id));

  // Fetch user names - only for IDs we need (paginate if needed)
  const userNames: Record<string, string> = {};
  if (allUserIds.size > 0) {
    const { data: usersData } = await admin.auth.admin.listUsers({ perPage: Math.min(allUserIds.size + 10, 500) });
    if (usersData?.users) {
      for (const u of usersData.users) {
        if (allUserIds.has(u.id)) {
          const name =
            u.user_metadata?.full_name ||
            u.email?.split("@")[0] ||
            "Student";
          userNames[u.id] = name;
        }
      }
    }
  }

  function getName(userId: string) {
    return userNames[userId] ?? "Student";
  }

  // Build Overall Score leaderboard
  const overallScore: LeaderboardEntry[] = scores
    .filter((r: any) => r.overall_score > 0)
    .map((r: any, i: number) => ({
      user_id: r.user_id,
      name: getName(r.user_id),
      value: Math.round(r.overall_score),
      rank: i + 1,
    }));

  // Build Streak Champions leaderboard
  const streakChampions: LeaderboardEntry[] = streaks
    .filter((r: any) => r.current_streak > 0)
    .map((r: any, i: number) => ({
      user_id: r.user_id,
      name: getName(r.user_id),
      value: r.current_streak,
      rank: i + 1,
    }));

  // Build Practice Warriors leaderboard (aggregate total_attempted per user, top 50)
  const practiceMap = new Map<string, number>();
  for (const row of progress) {
    practiceMap.set(row.user_id, (practiceMap.get(row.user_id) ?? 0) + row.total_attempted);
  }
  const practiceWarriors: LeaderboardEntry[] = Array.from(practiceMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([userId, total], i) => ({
      user_id: userId,
      name: getName(userId),
      value: total,
      rank: i + 1,
    }));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-500 text-sm">See how you rank among fellow CA aspirants</p>
        </div>
      </div>

      <LeaderboardTabs
        data={{ overallScore, streakChampions, practiceWarriors }}
        currentUserId={user.id}
      />
    </div>
  );
}
