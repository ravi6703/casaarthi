import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAndAwardBadges } from "@/lib/utils/badge-engine";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [badgesRes, defsRes] = await Promise.all([
    supabase.from("user_badges").select("badge_id, earned_at").eq("user_id", user.id),
    supabase.from("badge_definitions").select("*").order("sort_order"),
  ]);

  const earned = (badgesRes.data ?? []) as any[];
  const definitions = (defsRes.data ?? []) as any[];
  const earnedMap = Object.fromEntries(earned.map((b: any) => [b.badge_id, b.earned_at]));

  const badges = definitions.map((def: any) => ({
    ...def,
    earned: !!earnedMap[def.id],
    earnedAt: earnedMap[def.id] ?? null,
  }));

  return NextResponse.json({ badges }, {
    headers: { "Cache-Control": "private, max-age=120, stale-while-revalidate=60" },
  });
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const newBadges = await checkAndAwardBadges(supabase, user.id);

  return NextResponse.json({ newBadges });
}
