import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createAdminClient();
  const today = new Date().toISOString().slice(0, 10);

  // Get all users with study plans
  const { data: profiles } = await supabase
    .from("student_profiles")
    .select("user_id, study_pace, study_plan_created_at")
    .not("study_plan_created_at", "is", null);

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  // Get auth users for emails
  let sentCount = 0;
  for (const profile of profiles as any[]) {
    const { data: { user } } = await supabase.auth.admin.getUserById(profile.user_id);
    if (!user?.email || user.is_anonymous) continue;

    // Check if they practiced today
    const { count } = await supabase
      .from("practice_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.user_id)
      .gte("started_at", today);

    const hasPracticedToday = (count ?? 0) > 0;

    // Get topics due for revision
    const { data: dueTopic } = await supabase
      .from("spaced_repetition")
      .select("topic_id")
      .eq("user_id", profile.user_id)
      .lte("next_review_date", today)
      .limit(1);

    const hasRevisionDue = (dueTopic?.length ?? 0) > 0;

    // Create in-app notification
    const title = hasPracticedToday
      ? "Great progress today! Keep going 💪"
      : "Your daily study session is waiting! 📚";
    const body = hasRevisionDue
      ? "You have topics due for revision. Don't break your streak!"
      : "Stay consistent — even 20 minutes a day makes a huge difference.";

    await (supabase.from("notifications") as any).insert({
      user_id: profile.user_id,
      type: "streak_reminder",
      title,
      body,
      action_url: "/study-plan",
    });

    // Send email reminder (only if NOT practiced today)
    if (!hasPracticedToday && user.email) {
      try {
        await getResend().emails.send({
          from: "CA Saarthi <noreply@casaarthi.in>",
          to: user.email,
          subject: "📚 Your daily study session is waiting!",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-block;width:40px;height:40px;background:#2563eb;border-radius:8px;color:white;font-weight:bold;line-height:40px;">CA</div>
                <span style="font-weight:bold;margin-left:8px;font-size:18px;">CA Saarthi</span>
              </div>
              <h2 style="color:#1f2937;">Don't miss today's study session!</h2>
              <p style="color:#6b7280;">Consistency is key to cracking CA Foundation. Your study plan is waiting for you.</p>
              ${hasRevisionDue ? '<p style="color:#ea580c;font-weight:600;">⚠️ You have topics due for revision today!</p>' : ''}
              <a href="https://www.casaarthi.in/study-plan" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px;">Open Study Plan →</a>
              <p style="color:#9ca3af;font-size:12px;margin-top:24px;">You're receiving this because you have an active study plan on CA Saarthi.</p>
            </div>
          `,
        });
      } catch {}
    }

    sentCount++;
  }

  return NextResponse.json({ sent: sentCount });
}
