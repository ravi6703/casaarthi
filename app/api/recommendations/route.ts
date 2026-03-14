import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Rule-based recommendation engine (v1)
// Called on demand; results cached for 1 hour in recommendations table

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = user.id;

  // Clear expired/old recommendations
  await supabase
    .from("recommendations")
    .delete()
    .eq("user_id", userId)
    .lt("expires_at", new Date().toISOString());

  // Check if fresh recommendations exist
  const { data: existing } = await supabase
    .from("recommendations")
    .select("id")
    .eq("user_id", userId)
    .gte("expires_at", new Date().toISOString())
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ cached: true });
  }

  // Gather data for engine
  const [scoresRes, progressRes, streakRes, mockRes] = await Promise.all([
    supabase.from("readiness_scores").select("*").eq("user_id", userId).single(),
    supabase.from("topic_progress").select("topic_id, accuracy_rate, last_practiced_at, total_attempted").eq("user_id", userId),
    supabase.from("study_streaks").select("*").eq("user_id", userId).single(),
    supabase.from("mock_test_attempts").select("percentage, completed_at, mock_test_id").eq("user_id", userId).eq("status", "completed").order("completed_at", { ascending: false }).limit(5),
  ]);

  const scores = scoresRes.data as any;
  const progress = (progressRes.data as any[]) ?? [];
  const streak = streakRes.data as any;
  const recentMocks = (mockRes.data as any[]) ?? [];

  const recs: Array<{
    user_id: string;
    type: string;
    content: Record<string, string>;
    expires_at: string;
  }> = [];

  const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  // 1. STUDY TODAY — find 3 specific actions
  const topicScores = (scores?.topic_scores as Record<string, { score: number }>) ?? {};

  // Weakest topic
  const weakest = progress
    .filter((p: any) => p.total_attempted > 0)
    .sort((a: any, b: any) => a.accuracy_rate - b.accuracy_rate)[0];

  if (weakest) {
    const { data: topicData } = await supabase.from("topics").select("name, paper_id").eq("id", weakest.topic_id).single();
    const topic = topicData as any;
    recs.push({
      user_id: userId,
      type: "study_today",
      content: {
        title: `Practice ${topic?.name ?? "weak topic"}`,
        description: `Your accuracy here is ${Math.round(weakest.accuracy_rate)}% — target 70%+`,
        action_url: `/practice/session?type=topic&topicId=${weakest.topic_id}`,
        icon: "📖",
      },
      expires_at: expiry,
    });
  }

  // 2. REVISION ALERT — topic not practiced in 14+ days
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const revisionNeeded = progress.filter(
    (p: any) => p.total_attempted > 0 && p.last_practiced_at && p.last_practiced_at < fourteenDaysAgo && p.accuracy_rate >= 60
  );

  if (revisionNeeded.length > 0) {
    const p = revisionNeeded[0];
    const { data: topicData } = await supabase.from("topics").select("name").eq("id", p.topic_id).single();
    const topic = topicData as any;
    const daysSince = Math.floor((Date.now() - new Date(p.last_practiced_at!).getTime()) / 86400000);
    recs.push({
      user_id: userId,
      type: "revision_alert",
      content: {
        title: `Revise ${topic?.name ?? "a topic"}`,
        description: `You have not practiced this in ${daysSince} days — don't let it slip`,
        action_url: `/practice/session?type=topic&topicId=${p.topic_id}`,
        icon: "🔔",
      },
      expires_at: expiry,
    });
  }

  // 3. DANGER FLAG — mock test showed unexpected weakness
  if (recentMocks.length > 0 && recentMocks[0].percentage !== null) {
    const lastMockPct = recentMocks[0].percentage ?? 0;
    if (lastMockPct < 40) {
      recs.push({
        user_id: userId,
        type: "danger_flag",
        content: {
          title: "Recent mock score dropped below 40%",
          description: `Your last mock was ${lastMockPct.toFixed(0)}% — focus on weak topics before next attempt`,
          action_url: "/mock-tests",
          icon: "⚠️",
        },
        expires_at: expiry,
      });
    }
  }

  // 4. NEXT LEVEL — topic mastered, suggest harder topic
  const masteredTopics = progress.filter((p: any) => p.total_attempted >= 30 && p.accuracy_rate >= 80);
  if (masteredTopics.length > 0) {
    const p = masteredTopics[0];
    const { data: topicData } = await supabase.from("topics").select("name").eq("id", p.topic_id).single();
    const topic = topicData as any;
    recs.push({
      user_id: userId,
      type: "next_level",
      content: {
        title: `Challenge yourself in ${topic?.name ?? "a mastered topic"}`,
        description: "You have hit 80%+ accuracy — try hard-mode questions",
        action_url: `/practice/session?type=challenge&topicId=${p.topic_id}`,
        icon: "🚀",
      },
      expires_at: expiry,
    });
  }

  // 5. DEFAULT — encourage starting practice
  if (recs.length < 2) {
    recs.push({
      user_id: userId,
      type: "study_today",
      content: {
        title: "Start a practice session",
        description: "Pick any topic and start building your accuracy",
        action_url: "/practice",
        icon: "📚",
      },
      expires_at: expiry,
    });
  }

  // Save recommendations (only first 3)
  if (recs.length > 0) {
    await (supabase.from("recommendations") as any).insert(recs.slice(0, 3));
  }

  return NextResponse.json({ generated: recs.length });
}
