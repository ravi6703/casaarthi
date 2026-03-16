import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const resend = new Resend(resendKey);

  // Get all users with email who have been active in the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: activeSessions } = await supabase
    .from("practice_sessions")
    .select("user_id, total_questions, correct, time_spent_sec")
    .eq("status", "completed")
    .gte("completed_at", sevenDaysAgo.toISOString());

  if (!activeSessions || activeSessions.length === 0) {
    return NextResponse.json({ message: "No active users this week" });
  }

  // Group by user
  const userStats: Record<string, { questions: number; correct: number; time: number; sessions: number }> = {};
  for (const s of activeSessions) {
    if (!userStats[s.user_id]) userStats[s.user_id] = { questions: 0, correct: 0, time: 0, sessions: 0 };
    userStats[s.user_id].questions += s.total_questions;
    userStats[s.user_id].correct += s.correct;
    userStats[s.user_id].time += s.time_spent_sec ?? 0;
    userStats[s.user_id].sessions += 1;
  }

  const userIds = Object.keys(userStats);

  // Get user emails
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));

  let sent = 0;
  for (const userId of userIds) {
    const user = userMap[userId];
    if (!user?.email || user.email.endsWith("@example.com")) continue;

    const stats = userStats[userId];
    const accuracy = stats.questions > 0 ? Math.round((stats.correct / stats.questions) * 100) : 0;
    const hours = Math.round((stats.time / 3600) * 10) / 10;
    const name = user.user_metadata?.full_name || user.email.split("@")[0];

    try {
      await resend.emails.send({
        from: "CA Saarthi <noreply@casaarthi.in>",
        to: user.email,
        subject: `Your Weekly Progress Report - CA Saarthi`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 20px;">Weekly Report</h1>
              <p style="margin: 4px 0 0; opacity: 0.8; font-size: 14px;">Hi ${name}, here's your week in review</p>
            </div>
            <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 24px; border-radius: 0 0 12px 12px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div style="text-align: center; padding: 16px; background: #f3f4f6; border-radius: 8px;">
                  <div style="font-size: 28px; font-weight: bold; color: #1f2937;">${stats.questions}</div>
                  <div style="font-size: 12px; color: #6b7280;">Questions</div>
                </div>
                <div style="text-align: center; padding: 16px; background: #f3f4f6; border-radius: 8px;">
                  <div style="font-size: 28px; font-weight: bold; color: ${accuracy >= 70 ? '#16a34a' : accuracy >= 50 ? '#ca8a04' : '#dc2626'};">${accuracy}%</div>
                  <div style="font-size: 12px; color: #6b7280;">Accuracy</div>
                </div>
                <div style="text-align: center; padding: 16px; background: #f3f4f6; border-radius: 8px;">
                  <div style="font-size: 28px; font-weight: bold; color: #1f2937;">${stats.sessions}</div>
                  <div style="font-size: 12px; color: #6b7280;">Sessions</div>
                </div>
                <div style="text-align: center; padding: 16px; background: #f3f4f6; border-radius: 8px;">
                  <div style="font-size: 28px; font-weight: bold; color: #1f2937;">${hours}h</div>
                  <div style="font-size: 12px; color: #6b7280;">Study Time</div>
                </div>
              </div>
              <div style="text-align: center;">
                <a href="https://www.casaarthi.in/dashboard" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Continue Studying</a>
              </div>
              <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 16px;">Keep pushing! Consistency is key to cracking CA Foundation.</p>
            </div>
          </div>
        `,
      });
      sent++;
    } catch {
      // Continue for other users
    }
  }

  return NextResponse.json({ message: `Weekly reports sent to ${sent} users` });
}
