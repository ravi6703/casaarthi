import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateNextReview, accuracyToQuality } from "@/lib/utils/sm2-algorithm";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);

  // Get topics due for review
  const { data: dueTopics } = await supabase
    .from("spaced_repetition")
    .select("*, topics(name, paper_id)")
    .eq("user_id", user.id)
    .lte("next_review_date", today)
    .order("next_review_date");

  return NextResponse.json({ dueTopics: dueTopics ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { topicId, accuracy } = body;

  if (!topicId || accuracy === undefined) {
    return NextResponse.json({ error: "topicId and accuracy required" }, { status: 400 });
  }

  const quality = accuracyToQuality(accuracy);

  // Get current SR state or defaults
  const { data: current } = await supabase
    .from("spaced_repetition")
    .select("*")
    .eq("user_id", user.id)
    .eq("topic_id", topicId)
    .single() as { data: { easiness_factor: number; interval_days: number; repetition_count: number } | null };

  const prevEF = current?.easiness_factor ?? 2.5;
  const prevInterval = current?.interval_days ?? 0;
  const prevReps = current?.repetition_count ?? 0;

  const result = calculateNextReview({
    quality,
    easinessFactor: Number(prevEF),
    interval: prevInterval,
    repetitions: prevReps,
  });

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + result.interval);

  const { error } = await (supabase.from("spaced_repetition") as any).upsert({
    user_id: user.id,
    topic_id: topicId,
    easiness_factor: result.easinessFactor,
    interval_days: result.interval,
    repetition_count: result.repetitions,
    next_review_date: nextDate.toISOString().slice(0, 10),
    last_quality: quality,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,topic_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ nextReviewDate: nextDate.toISOString().slice(0, 10), quality, ...result });
}
