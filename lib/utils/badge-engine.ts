import { SupabaseClient } from "@supabase/supabase-js";

interface BadgeCheck {
  id: string;
  condition: (ctx: BadgeContext) => boolean;
}

interface BadgeContext {
  totalQuestions: number;
  totalSessions: number;
  totalMocks: number;
  currentStreak: number;
  longestStreak: number;
  readinessScore: number;
  distinctPapers: number;
  hasDiagnostic: boolean;
  bestMockPercent: number;
  bestSessionPercent: number;
  bestSessionSize: number;
  dailyChallengesCompleted: number;
  hasSubjective: boolean;
}

const BADGE_CHECKS: BadgeCheck[] = [
  { id: "first_practice",     condition: (c) => c.totalSessions >= 1 },
  { id: "50_questions",       condition: (c) => c.totalQuestions >= 50 },
  { id: "100_questions",      condition: (c) => c.totalQuestions >= 100 },
  { id: "500_questions",      condition: (c) => c.totalQuestions >= 500 },
  { id: "1000_questions",     condition: (c) => c.totalQuestions >= 1000 },
  { id: "first_mock",         condition: (c) => c.totalMocks >= 1 },
  { id: "mock_70_percent",    condition: (c) => c.bestMockPercent >= 70 },
  { id: "perfect_score",      condition: (c) => c.bestSessionPercent >= 100 && c.bestSessionSize >= 10 },
  { id: "3_day_streak",       condition: (c) => c.longestStreak >= 3 || c.currentStreak >= 3 },
  { id: "7_day_streak",       condition: (c) => c.longestStreak >= 7 || c.currentStreak >= 7 },
  { id: "30_day_streak",      condition: (c) => c.longestStreak >= 30 || c.currentStreak >= 30 },
  { id: "all_papers",         condition: (c) => c.distinctPapers >= 4 },
  { id: "first_diagnostic",   condition: (c) => c.hasDiagnostic },
  { id: "readiness_70",       condition: (c) => c.readinessScore >= 70 },
  { id: "daily_challenge_7",  condition: (c) => c.dailyChallengesCompleted >= 7 },
  { id: "first_subjective",   condition: (c) => c.hasSubjective },
];

/**
 * Check and award new badges for a user.
 * Returns array of newly earned badge IDs.
 */
export async function checkAndAwardBadges(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  // Fetch existing badges
  const { data: existingBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  const earned = new Set((existingBadges ?? []).map((b: any) => b.badge_id));

  // Only check badges not yet earned
  const unchecked = BADGE_CHECKS.filter((b) => !earned.has(b.id));
  if (unchecked.length === 0) return [];

  // Build context from parallel queries
  const [sessionsRes, streakRes, scoresRes, mocksRes, challengesRes, progressRes] = await Promise.all([
    supabase
      .from("practice_sessions")
      .select("total_questions, correct, paper_id")
      .eq("user_id", userId)
      .eq("status", "completed"),
    supabase
      .from("study_streaks")
      .select("current_streak, longest_streak")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("readiness_scores")
      .select("overall_score")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("mock_test_attempts")
      .select("percentage")
      .eq("user_id", userId)
      .eq("status", "completed"),
    supabase
      .from("daily_challenge_responses")
      .select("id")
      .eq("user_id", userId),
    supabase
      .from("student_profiles")
      .select("diagnostic_completed_at")
      .eq("user_id", userId)
      .single(),
  ]);

  const sessions = (sessionsRes.data as any[]) ?? [];
  const streak = streakRes.data as any;
  const scores = scoresRes.data as any;
  const mocks = (mocksRes.data as any[]) ?? [];
  const challenges = (challengesRes.data as any[]) ?? [];
  const profile = progressRes.data as any;

  const totalQuestions = sessions.reduce((s: number, r: any) => s + r.total_questions, 0);
  const distinctPapers = new Set(sessions.map((s: any) => s.paper_id).filter(Boolean)).size;

  // Best session (100% accuracy with 10+ questions)
  let bestSessionPercent = 0;
  let bestSessionSize = 0;
  for (const s of sessions) {
    if (s.total_questions > 0) {
      const pct = (s.correct / s.total_questions) * 100;
      if (pct > bestSessionPercent || (pct === bestSessionPercent && s.total_questions > bestSessionSize)) {
        bestSessionPercent = pct;
        bestSessionSize = s.total_questions;
      }
    }
  }

  const ctx: BadgeContext = {
    totalQuestions,
    totalSessions: sessions.length,
    totalMocks: mocks.length,
    currentStreak: streak?.current_streak ?? 0,
    longestStreak: streak?.longest_streak ?? 0,
    readinessScore: scores?.overall_score ?? 0,
    distinctPapers,
    hasDiagnostic: !!profile?.diagnostic_completed_at,
    bestMockPercent: mocks.reduce((max: number, m: any) => Math.max(max, m.percentage ?? 0), 0),
    bestSessionPercent,
    bestSessionSize,
    dailyChallengesCompleted: challenges.length,
    hasSubjective: false, // TODO: check practice_responses for subjective
  };

  // Check and award
  const newlyEarned: string[] = [];
  for (const check of unchecked) {
    if (check.condition(ctx)) {
      const { error } = await (supabase.from("user_badges") as any).insert({
        user_id: userId,
        badge_id: check.id,
      });
      if (!error) {
        newlyEarned.push(check.id);
        // Create notification
        await (supabase.from("notifications") as any).insert({
          user_id: userId,
          type: "badge_earned",
          title: "New Badge Earned!",
          body: `You earned the "${check.id.replace(/_/g, " ")}" badge!`,
          action_url: "/profile",
        });
      }
    }
  }

  return newlyEarned;
}
