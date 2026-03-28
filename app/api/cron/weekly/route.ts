import { NextRequest, NextResponse } from "next/server";
import { sendWeeklyReport } from "@/lib/automation/weekly-seo-report";

/* ------------------------------------------------------------------ */
/*  Weekly Cron Handler — Runs every Sunday at 10:00 AM IST            */
/*  Sends comprehensive SEO performance report                         */
/* ------------------------------------------------------------------ */

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }

  const vercelCron = request.headers.get("x-vercel-cron");
  if (vercelCron) return true;

  if (process.env.NODE_ENV === "development") return true;

  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const success = await sendWeeklyReport();

    return NextResponse.json({
      success,
      message: success
        ? "Weekly SEO report sent successfully"
        : "Failed to send weekly report (check RESEND_API_KEY)",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Weekly cron error:", msg);

    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
