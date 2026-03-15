import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Vercel Cron config — run daily at 8 AM IST (2:30 AM UTC)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Get all users with email (exclude anonymous)
    const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 500 });
    const users = (authData?.users ?? []).filter((u) => u.email && !u.is_anonymous);

    let sent = 0;
    let skipped = 0;

    for (const user of users) {
      // Get yesterday's practice data
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const startOfDay = new Date(yesterday);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(yesterday);
      endOfDay.setHours(23, 59, 59, 999);

      const [practiceRes, streakRes, scoresRes] = await Promise.all([
        supabase
          .from("practice_sessions")
          .select("correct, total_questions, time_spent_sec")
          .eq("user_id", user.id)
          .eq("status", "completed")
          .gte("completed_at", startOfDay.toISOString())
          .lte("completed_at", endOfDay.toISOString()),
        supabase
          .from("study_streaks")
          .select("current_streak, longest_streak")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("readiness_scores")
          .select("overall_score")
          .eq("user_id", user.id)
          .single(),
      ]);

      const sessions = (practiceRes.data as any[]) ?? [];
      const streak = streakRes.data as any;
      const scores = scoresRes.data as any;

      // Skip users who had no activity yesterday
      if (sessions.length === 0) {
        skipped++;
        continue;
      }

      const totalQuestions = sessions.reduce((s: number, p: any) => s + p.total_questions, 0);
      const totalCorrect = sessions.reduce((s: number, p: any) => s + p.correct, 0);
      const totalTime = sessions.reduce((s: number, p: any) => s + p.time_spent_sec, 0);
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      const timeMinutes = Math.round(totalTime / 60);
      const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
      const currentStreak = streak?.current_streak ?? 0;
      const readinessScore = scores?.overall_score ?? 0;

      const streakEmoji = currentStreak >= 7 ? "🔥🔥🔥" : currentStreak >= 3 ? "🔥🔥" : currentStreak >= 1 ? "🔥" : "";

      const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:24px;">
    <div style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:24px;text-align:center;color:#fff;">
        <div style="font-size:14px;opacity:0.8;">Your Daily Progress</div>
        <div style="font-size:28px;font-weight:700;margin-top:4px;">
          ${yesterday.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
        </div>
      </div>

      <!-- Stats -->
      <div style="padding:24px;">
        <div style="text-align:center;margin-bottom:16px;">
          <div style="font-size:16px;color:#374151;">Hi ${userName}! 👋</div>
        </div>

        <div style="display:flex;gap:12px;margin-bottom:20px;">
          <div style="flex:1;background:#eff6ff;border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:24px;font-weight:700;color:#2563eb;">${totalQuestions}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:2px;">Questions</div>
          </div>
          <div style="flex:1;background:#f0fdf4;border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:24px;font-weight:700;color:#16a34a;">${accuracy}%</div>
            <div style="font-size:12px;color:#6b7280;margin-top:2px;">Accuracy</div>
          </div>
          <div style="flex:1;background:#fef3c7;border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:24px;font-weight:700;color:#d97706;">${timeMinutes}m</div>
            <div style="font-size:12px;color:#6b7280;margin-top:2px;">Study Time</div>
          </div>
        </div>

        ${currentStreak > 0 ? `
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:16px;text-align:center;margin-bottom:20px;">
          <div style="font-size:20px;">${streakEmoji}</div>
          <div style="font-size:14px;color:#9a3412;font-weight:600;">${currentStreak} Day Streak!</div>
          <div style="font-size:12px;color:#c2410c;">Keep it going tomorrow!</div>
        </div>
        ` : ""}

        <div style="background:#f9fafb;border-radius:12px;padding:16px;text-align:center;margin-bottom:20px;">
          <div style="font-size:12px;color:#6b7280;">Readiness Score</div>
          <div style="font-size:32px;font-weight:700;color:#1f2937;">${readinessScore}/100</div>
        </div>

        <a href="https://www.casaarthi.in/dashboard" style="display:block;background:#2563eb;color:#fff;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
          Continue Studying →
        </a>
      </div>

      <!-- Footer -->
      <div style="padding:16px 24px;border-top:1px solid #f3f4f6;text-align:center;">
        <div style="font-size:11px;color:#9ca3af;">
          CA Saarthi · Your CA Foundation companion<br>
          <a href="https://www.casaarthi.in" style="color:#2563eb;text-decoration:none;">casaarthi.in</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

      try {
        await resend.emails.send({
          from: "CA Saarthi <progress@casaarthi.in>",
          to: user.email!,
          subject: `${streakEmoji} ${userName}, you practiced ${totalQuestions} questions yesterday! — CA Saarthi`,
          html: emailHtml,
        });
        sent++;
      } catch (emailError) {
        console.error(`Failed to send to ${user.email}:`, emailError);
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      skipped,
      total: users.length,
    });
  } catch (error) {
    console.error("Daily progress cron error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
