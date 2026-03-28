import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { generateCurrentAffairs, generateSEOBlog } from "@/lib/automation/content-generator";
import { sendDailyReport } from "@/lib/automation/email-report";
import { notifySearchEngines } from "@/lib/automation/google-indexing";

/* ------------------------------------------------------------------ */
/*  Master Daily Cron Handler                                          */
/*  Triggered by Vercel Cron at 6:00 AM IST (00:30 UTC) every day    */
/*  Runs entirely on Vercel servers — no laptop needed                */
/* ------------------------------------------------------------------ */

const SITE_URL = "https://www.casaarthi.in";

// Supabase admin client (uses service role key for inserts)
function getSupabase() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Verify the request is from Vercel Cron (security)
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // If CRON_SECRET is set, verify it
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }

  // Also allow Vercel's built-in cron verification
  const vercelCron = request.headers.get("x-vercel-cron");
  if (vercelCron) return true;

  // In development, allow without auth
  if (process.env.NODE_ENV === "development") return true;

  return false;
}

// Get the next sort_order for blogs
async function getNextSortOrder(supabase: ReturnType<typeof getSupabase>): Promise<number> {
  const { data } = await supabase
    .from("blogs")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  return (data?.[0]?.sort_order ?? 0) + 1;
}

// Check if a blog with similar slug already exists today
async function blogExistsToday(supabase: ReturnType<typeof getSupabase>, slugPrefix: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("blogs")
    .select("id")
    .like("slug", `%${today}%`)
    .like("slug", `%${slugPrefix}%`)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  // Security check
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const errors: string[] = [];
  let currentAffairsResult: { title: string; slug: string } | null = null;
  let seoBlogResult: { title: string; slug: string } | null = null;
  const newUrls: string[] = [];

  // Skip on Sundays (give students a break, save API costs)
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0) {
    await sendDailyReport({
      date: today,
      currentAffairsPost: null,
      seoBlogPost: null,
      totalBlogsNow: 0,
      totalPagesIndexable: 500,
      errors: ["Sunday — no content generated (scheduled rest day)"],
      executionTimeMs: Date.now() - startTime,
    });
    return NextResponse.json({ message: "Sunday — rest day", date: today });
  }

  /* ---------------------------------------------------------------- */
  /*  Task 1: Generate Current Affairs Post                           */
  /* ---------------------------------------------------------------- */
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not set");
    }

    const post = await generateCurrentAffairs();
    const nextOrder = await getNextSortOrder(supabase);

    // Check for duplicate
    const exists = await blogExistsToday(supabase, "current-affairs");
    if (exists) {
      errors.push("Current affairs post already exists for today — skipped");
    } else {
      const { error } = await supabase.from("blogs").insert({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        keywords: post.keywords,
        meta_description: post.meta_description,
        read_time: post.read_time,
        author: "CA Saarthi",
        is_published: true,
        published_at: new Date().toISOString(),
        sort_order: nextOrder,
      });

      if (error) {
        throw new Error(`Supabase insert error: ${error.message}`);
      }

      currentAffairsResult = { title: post.title, slug: post.slug };
      newUrls.push(`${SITE_URL}/blog/${post.slug}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Current affairs generation failed: ${msg}`);
    console.error("Current affairs error:", err);
  }

  /* ---------------------------------------------------------------- */
  /*  Task 2: Generate SEO Blog Post                                  */
  /* ---------------------------------------------------------------- */
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY not set");
    }

    const post = await generateSEOBlog();
    const nextOrder = await getNextSortOrder(supabase);

    // Check for duplicate
    const { data: existing } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", post.slug)
      .limit(1);

    if (existing && existing.length > 0) {
      errors.push("SEO blog post with same slug already exists — skipped");
    } else {
      const { error } = await supabase.from("blogs").insert({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        keywords: post.keywords,
        meta_description: post.meta_description,
        read_time: post.read_time,
        author: "CA Saarthi",
        is_published: true,
        published_at: new Date().toISOString(),
        sort_order: nextOrder,
      });

      if (error) {
        throw new Error(`Supabase insert error: ${error.message}`);
      }

      seoBlogResult = { title: post.title, slug: post.slug };
      newUrls.push(`${SITE_URL}/blog/${post.slug}`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`SEO blog generation failed: ${msg}`);
    console.error("SEO blog error:", err);
  }

  /* ---------------------------------------------------------------- */
  /*  Task 3: Notify search engines about new URLs                    */
  /* ---------------------------------------------------------------- */
  if (newUrls.length > 0) {
    try {
      // Also add sitemap and blog listing page for re-crawl
      const urlsToSubmit = [
        ...newUrls,
        `${SITE_URL}/blog`,     // Blog listing updated
        `${SITE_URL}/sitemap.xml`, // Sitemap updated
      ];

      const indexingResult = await notifySearchEngines(urlsToSubmit);
      console.log("Search engine notifications:", JSON.stringify(indexingResult));

      if (indexingResult.google.failed.length > 0) {
        errors.push(
          `Google indexing failed for ${indexingResult.google.failed.length} URLs`
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Search engine notification error: ${msg}`);
      console.error("Indexing notification error:", err);
    }
  }

  /* ---------------------------------------------------------------- */
  /*  Task 4: Count total content for stats                           */
  /* ---------------------------------------------------------------- */
  let totalBlogs = 0;
  try {
    const { count } = await supabase
      .from("blogs")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true);
    totalBlogs = count ?? 0;
  } catch {
    totalBlogs = 0;
  }

  /* ---------------------------------------------------------------- */
  /*  Task 5: Send daily report email                                 */
  /* ---------------------------------------------------------------- */
  const reportData = {
    date: today,
    currentAffairsPost: currentAffairsResult,
    seoBlogPost: seoBlogResult,
    totalBlogsNow: totalBlogs,
    totalPagesIndexable: 500 + totalBlogs, // base pages + blogs
    errors,
    executionTimeMs: Date.now() - startTime,
  };

  await sendDailyReport(reportData);

  return NextResponse.json({
    success: errors.length === 0,
    date: today,
    currentAffairs: currentAffairsResult,
    seoBlog: seoBlogResult,
    totalBlogs,
    newUrlsSubmitted: newUrls.length,
    errors,
    executionTimeMs: Date.now() - startTime,
  });
}

// Also support POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
