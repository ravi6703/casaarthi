/* ------------------------------------------------------------------ */
/*  Daily Report Emailer — uses Resend (free: 100 emails/month)       */
/* ------------------------------------------------------------------ */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const REPORT_EMAIL = process.env.REPORT_EMAIL || "ravi6703@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "CA Saarthi Bot <bot@casaarthi.in>";

interface DailyReportData {
  date: string;
  currentAffairsPost: { title: string; slug: string } | null;
  seoBlogPost: { title: string; slug: string } | null;
  totalBlogsNow: number;
  totalPagesIndexable: number;
  errors: string[];
  executionTimeMs: number;
}

export async function sendDailyReport(data: DailyReportData): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not set — skipping email report");
    console.log("Report data:", JSON.stringify(data, null, 2));
    return false;
  }

  const hasErrors = data.errors.length > 0;
  const statusEmoji = hasErrors ? "⚠️" : "✅";
  const statusText = hasErrors ? "Completed with errors" : "All tasks successful";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #4A90A4, #3A7A8E); padding: 24px 30px; color: white; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
    .header p { margin: 4px 0 0; opacity: 0.9; font-size: 14px; }
    .body { padding: 24px 30px; }
    .status { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
    .status-ok { background: #dcfce7; color: #166534; }
    .status-warn { background: #fef3c7; color: #92400e; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 15px; color: #4A90A4; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .card { background: #f8fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 18px; margin-bottom: 10px; }
    .card .label { font-size: 12px; color: #6b7280; margin-bottom: 2px; }
    .card .value { font-size: 16px; font-weight: 600; color: #111827; }
    .card a { color: #4A90A4; text-decoration: none; }
    .card a:hover { text-decoration: underline; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #991b1b; }
    .footer { padding: 16px 30px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${statusEmoji} CA Saarthi Daily Report</h1>
      <p>${data.date}</p>
    </div>
    <div class="body">
      <div class="status ${hasErrors ? 'status-warn' : 'status-ok'}">${statusText}</div>

      <div class="section">
        <h2>Content Created Today</h2>
        ${data.currentAffairsPost ? `
        <div class="card">
          <div class="label">Current Affairs Post</div>
          <div class="value"><a href="https://www.casaarthi.in/blog/${data.currentAffairsPost.slug}">${data.currentAffairsPost.title}</a></div>
        </div>` : '<div class="card"><div class="label">Current Affairs Post</div><div class="value" style="color:#ef4444">Failed to generate</div></div>'}

        ${data.seoBlogPost ? `
        <div class="card">
          <div class="label">SEO Blog Post</div>
          <div class="value"><a href="https://www.casaarthi.in/blog/${data.seoBlogPost.slug}">${data.seoBlogPost.title}</a></div>
        </div>` : '<div class="card"><div class="label">SEO Blog Post</div><div class="value" style="color:#ef4444">Failed to generate</div></div>'}
      </div>

      <div class="section">
        <h2>Site Stats</h2>
        <div class="stats-grid">
          <div class="card">
            <div class="label">Total Blog Posts</div>
            <div class="value">${data.totalBlogsNow}</div>
          </div>
          <div class="card">
            <div class="label">Indexable Pages</div>
            <div class="value">${data.totalPagesIndexable}+</div>
          </div>
        </div>
      </div>

      ${data.errors.length > 0 ? `
      <div class="section">
        <h2>Errors</h2>
        ${data.errors.map(e => `<div class="error-box">${e}</div>`).join('')}
      </div>` : ''}

      <div class="section">
        <div class="card">
          <div class="label">Execution Time</div>
          <div class="value">${(data.executionTimeMs / 1000).toFixed(1)}s</div>
        </div>
      </div>
    </div>
    <div class="footer">
      CA Saarthi Autonomous System &middot; <a href="https://www.casaarthi.in" style="color:#4A90A4">casaarthi.in</a>
    </div>
  </div>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [REPORT_EMAIL],
        subject: `${statusEmoji} CA Saarthi Daily Report — ${data.date}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API error:", err);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}
