import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "CA";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if user already has a code
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("referral_code, referral_count")
    .eq("user_id", user.id)
    .single() as { data: { referral_code: string | null; referral_count: number } | null };

  if (profile?.referral_code) {
    return NextResponse.json({ code: profile.referral_code, count: profile.referral_count ?? 0 });
  }

  // Generate a unique code
  let code = generateCode();
  let attempts = 0;
  while (attempts < 5) {
    const { error } = await supabase
      .from("student_profiles")
      .update({ referral_code: code })
      .eq("user_id", user.id);

    if (!error) {
      return NextResponse.json({ code, count: 0 });
    }
    code = generateCode();
    attempts++;
  }

  return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
}
