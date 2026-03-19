import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: any;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  const { flashcardId, confidence } = body;

  if (!flashcardId || !confidence) {
    return NextResponse.json({ error: "flashcardId and confidence required" }, { status: 400 });
  }

  // Calculate next review date based on confidence
  const intervalDays: Record<string, number> = { again: 0, hard: 1, good: 3, easy: 7 };
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + (intervalDays[confidence] ?? 1));

  const { error } = await (supabase.from("flashcard_progress") as any).upsert({
    user_id: user.id,
    flashcard_id: flashcardId,
    confidence,
    review_count: 1, // Will be incremented via SQL later
    next_review_date: nextDate.toISOString().slice(0, 10),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,flashcard_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
