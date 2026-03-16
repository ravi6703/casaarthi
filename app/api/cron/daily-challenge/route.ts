import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date().toISOString().slice(0, 10);

  // Check if today already has a challenge
  const { data: existing } = await supabase
    .from("daily_challenges")
    .select("id")
    .eq("challenge_date", today)
    .single();

  if (existing) {
    return NextResponse.json({ message: "Challenge already set for today" });
  }

  // Get question IDs used in last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const { data: recentChallenges } = await supabase
    .from("daily_challenges")
    .select("question_id")
    .gte("challenge_date", ninetyDaysAgo.toISOString().slice(0, 10));

  const usedIds = (recentChallenges ?? []).map((c: any) => c.question_id);

  // Pick a random approved MCQ question not used recently
  let query = supabase
    .from("questions")
    .select("id")
    .eq("status", "approved")
    .eq("question_type", "mcq")
    .limit(50);

  if (usedIds.length > 0) {
    query = query.not("id", "in", `(${usedIds.join(",")})`);
  }

  const { data: candidates } = await query;

  if (!candidates || candidates.length === 0) {
    // Fallback: pick any approved question
    const { data: fallback } = await supabase
      .from("questions")
      .select("id")
      .eq("status", "approved")
      .eq("question_type", "mcq")
      .limit(1);

    if (!fallback || fallback.length === 0) {
      return NextResponse.json({ error: "No questions available" }, { status: 404 });
    }
    candidates?.push(fallback[0]);
  }

  // Random pick
  const picked = candidates![Math.floor(Math.random() * candidates!.length)];

  const { error } = await (supabase.from("daily_challenges") as any).insert({
    question_id: picked.id,
    challenge_date: today,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Daily challenge created", questionId: picked.id });
}
