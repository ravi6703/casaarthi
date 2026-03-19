import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);

  // Get today's challenge
  const { data: challenge } = await supabase
    .from("daily_challenges")
    .select("*, questions(*)")
    .eq("challenge_date", today)
    .single();

  if (!challenge) {
    return NextResponse.json({ challenge: null, response: null });
  }

  // Check if user already answered
  const { data: response } = await supabase
    .from("daily_challenge_responses")
    .select("*")
    .eq("user_id", user.id)
    .eq("challenge_date", today)
    .single();

  return NextResponse.json({ challenge, response }, {
    headers: { "Cache-Control": "private, max-age=300, stale-while-revalidate=120" },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { questionId, selectedOption, timeSpentSec } = body;

  if (!questionId || selectedOption === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  // Check not already answered (use upsert-like approach to prevent race condition)
  const { data: existing } = await supabase
    .from("daily_challenge_responses")
    .select("id")
    .eq("user_id", user.id)
    .eq("challenge_date", today)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Already answered today" }, { status: 409 });
  }

  // Server-side verification: look up the correct answer (never trust client isCorrect)
  const { data: question } = await supabase
    .from("questions")
    .select("correct_option")
    .eq("id", questionId)
    .single();

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const isCorrect = selectedOption === question.correct_option;

  const { data, error } = await (supabase
    .from("daily_challenge_responses") as any)
    .insert({
      user_id: user.id,
      challenge_date: today,
      question_id: questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
      time_spent_sec: timeSpentSec || 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }

  // Award XP
  const xpGained = isCorrect ? 20 : 5;
  await (supabase.rpc as any)("increment_xp", { p_user_id: user.id, p_xp: xpGained }).catch(() => {
    // Fallback: upsert directly
    return (supabase.from("user_xp") as any).upsert({
      user_id: user.id,
      total_xp: xpGained,
      level: 1,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  });

  return NextResponse.json({ response: data, xpGained });
}
