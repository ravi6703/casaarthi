import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Load the user's study pace
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("student_profiles")
    .select("study_pace, study_plan_created_at")
    .eq("user_id", user.id)
    .single() as { data: { study_pace: string | null; study_plan_created_at: string | null } | null };

  return NextResponse.json({
    pace: data?.study_pace ?? null,
    planCreatedAt: data?.study_plan_created_at ?? null,
  });
}

// POST: Save the user's study pace
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pace } = await request.json();
  if (!["relaxed", "balanced", "intensive", "crash"].includes(pace)) {
    return NextResponse.json({ error: "Invalid pace" }, { status: 400 });
  }

  const { error } = await (supabase.from("student_profiles") as any).update({
    study_pace: pace,
    study_plan_created_at: new Date().toISOString(),
  }).eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
