/* ------------------------------------------------------------------ */
/*  Weekly SEO Performance Report                                      */
/*  Runs every Sunday — analyses content growth and site health        */
/* ------------------------------------------------------------------ */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const REPORT_EMAIL = process.env.REPORT_EMAIL || "ravi6703@gmail.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "CA Saarthi Bot <bot@casaarthi.in>";

function getSupabase() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

interface WeeklyReportData {
  weekRange: string;
  totalBlogs: number;
  blogsThisWeek: number;
  totalPages: number;
  topKeywords: string[];
  contentBreakdown: {
    currentAffairs: number;
    seoBlog: number;
  };
  recentPosts: { title: string; slug: string; published_at: string }[];
  recommendations: string[];
}

/**
 * Gather weekly stats from Supabase
 */
async function gatherWeeklyData(): Promise<WeeklyReportData> {
  const supabase = getSupabase();

  // Date range for this week
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekRange = `${weekAgo.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  })} — ${now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  })}`;

  // Total published blogs
  const { count: totalBlogs } = await supabase
    .from("blogs")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);

  // Blogs published this week
  const { data: weekBlogs } = await supabase
    .from("blogs")
    .select("title, slug, published_at, keywords")
    .eq("is_published", true)
    .gte("published_at", weekAgo.toISOString())
    .order("published_at", { ascending: false });

  // Count current affairs vs SEO blogs this week
  let currentAffairsCount = 0;
  let seoBlogCount = 0;
  const allKeywords: string[] = [];

  for (const blog of weekBlogs || []) {
    if (blog.slug?.includes("-202")) {
      // Current affairs slugs contain date
      currentAffairsCount++;
    } else {
      seoBlogCount++;
    }
    if (blog.keywords) {
      allKeywords.push(...(blog.keywords as string[]));
    }
  }

  // Get top keywords by frequency
  const keywordFreq: Record<string, number> = {};
  allKeywords.forEach((kw) => {
    const lower = kw.toLowerCase();
    keywordFreq[lower] = (keywordFreq[lower] || 0) + 1;
  });
  const topKeywords = Object.entries(keywordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([kw]) => kw);

  // Count total pages (blogs + topics + chapters + static)
  const { count: topicCount } = await supabase
    .from("topics")
    .select("id", { count: "exact", head: true });

  const totalPages = (totalBlogs || 0) + (topicCount || 0) + 50; // 50 = static pages

  // Recent posts (last 7)
  const recentPosts = (weekBlogs || []).slice(0, 10).map((b) => ({
    title: b.title || "",
    slug: b.slug || "",
    published_at: b.published_at || "",
  }));

  // Generate recommendations
  const recommendations: string[] = [];

  if ((weekBlogs?.length || 0) < 10) {
    recommendations.push(
      "Content velocity is below target (12/week). Check if cron jobs are running daily."
    );
  }

  if (currentAffairsCount < 5) {
    recommendations.push(
      `Only ${currentAffairsCount} current affairs posts this week. Verify Anthropic API key is valid.`
    );
  }

  if ((totalBlogs || 0) > 100) {
    recommendations.push(
      "Blog count exceeds 100 — consider adding category pages for better navigation."
    );
  }

  if (topKeywords.length < 5) {
    recommendations.push(
      "Low keyword diversity — content may need broader topic coverage."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "All systems performing well. Content pipeline is healthy."
    );
  }

  return {
    weekRange,
    totalBlogs: totalBlogs || 0,
    blogsThisWeek: weekBlogs?.length || 0,
    totalPages,
    topKeywords,
    contentBreakdown: {
      currentAffairs: currentAffairsCount,
      seoBlog: seoBlogCount,
    },
    recentPosts,
    recommendations,
  };
}

/**
 * Send the weekly SEO report email
 */
export async function sendWeeklyReport(): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not set — skipping weekly report");
    return false;
  }

  const data = await gatherWeeklyData();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 640px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #8BAF92, #4A90A4); padding: 28px 30px; color: white; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
    .header p { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
    .body { padding: 24px 30px; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
    .stat-card { background: #f8fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center; }
    .stat-card .number { font-size: 28px; font-weight: 700; color: #4A90A4; }
    .stat-card .label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 15px; color: #3A7A8E; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #E8F0EA; padding-bottom: 6px; }
    .post-list { list-style: none; padding: 0; margin: 0; }
    .post-list li { padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    .post-list li:last-child { border-bottom: none; }
    .post-list a { color: #4A90A4; text-decoration: none; }
    .post-list .date { color: #9ca3af; font-size: 12px; margin-left: 8px; }
    .keyword-tag { display: inline-block; background: #E8F0EA; color: #3A7A8E; padding: 4px 10px; border-radius: 12px; font-size: 12px; margin: 3px 4px 3px 0; }
    .rec-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; font-size: 13px; color: #92400e; }
    .rec-box.good { background: #dcfce7; border-color: #86efac; color: #166534; }
    .breakdown { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .breakdown-item { background: #f8fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; }
    .breakdown-item .type { font-size: 12px; color: #6b7280; }
    .breakdown-item .count { font-size: 20px; font-weight: 700; color: #111827; }
    .footer { padding: 16px 30px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Weekly SEO Report</h1>
      <p>${data.weekRange}</p>
    </div>
    <div class="body">

      <div class="stats-grid">
        <div class="stat-card">
          <div class="number">${data.totalBlogs}</div>
          <div class="label">Total Posts</div>
        </div>
        <div class="stat-card">
          <div class="number">+${data.blogsThisWeek}</div>
          <div class="label">This Week</div>
        </div>
        <div class="stat-card">
          <div class="number">${data.totalPages}</div>
          <div class="label">Indexable Pages</div>
        </div>
      </div>

      <div class="section">
        <h2>Content Breakdown</h2>
        <div class="breakdown">
          <div class="breakdown-item">
            <div class="type">Current Affairs</div>
            <div class="count">${data.contentBreakdown.currentAffairs} posts</div>
          </div>
          <div class="breakdown-item">
            <div class="type">SEO Blog Posts</div>
            <div class="count">${data.contentBreakdown.seoBlog} posts</div>
          </div>
        </div>
      </div>

      ${data.recentPosts.length > 0 ? `
      <div class="section">
        <h2>Posts Published This Week</h2>
        <ul class="post-list">
          ${data.recentPosts
            .map(
              (p) =>
                `<li><a href="https://www.casaarthi.in/blog/${p.slug}">${p.title}</a><span class="date">${new Date(p.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}</span></li>`
            )
            .join("")}
        </ul>
      </div>` : ""}

      ${data.topKeywords.length > 0 ? `
      <div class="section">
        <h2>Top Keywords This Week</h2>
        <div>
          ${data.topKeywords.map((kw) => `<span class="keyword-tag">${kw}</span>`).join("")}
        </div>
      </div>` : ""}

      <div class="section">
        <h2>Recommendations</h2>
        ${data.recommendations
          .map(
            (r) =>
              `<div class="rec-box ${r.includes("performing well") ? "good" : ""}">${r}</div>`
          )
          .join("")}
      </div>

    </div>
    <div class="footer">
      CA Saarthi Autonomous System &middot; Weekly Report &middot; <a href="https://www.casaarthi.in" style="color:#4A90A4">casaarthi.in</a>
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
        subject: `📊 CA Saarthi Weekly Report — ${data.weekRange}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Weekly report email error:", err);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Weekly report send error:", error);
    return false;
  }
}
