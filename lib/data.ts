import { createClient } from "@/lib/supabase/server";

// ── Papers ──────────────────────────────────────────────────────────

export async function getAllPapers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("papers")
    .select("*")
    .order("sort_order");
  return data ?? [];
}

export async function getPaperBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("papers")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getPaperWithChaptersAndTopics(slug: string) {
  const supabase = await createClient();

  const { data: paper } = await supabase
    .from("papers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!paper) return null;

  const { data: chapters } = await supabase
    .from("chapters")
    .select(
      `id, name, slug, chapter_number, sort_order,
       topics (id, name, slug, exam_weightage, sort_order)`
    )
    .eq("paper_id", paper.id)
    .order("chapter_number");

  return { paper, chapters: chapters ?? [] };
}

// ── Platform Stats ──────────────────────────────────────────────────

export async function getPlatformStats() {
  const supabase = await createClient();

  const [questionsRes, topicsRes, chaptersRes, mockTestsRes] =
    await Promise.all([
      supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved"),
      supabase.from("topics").select("id", { count: "exact", head: true }),
      supabase.from("chapters").select("id", { count: "exact", head: true }),
      supabase
        .from("mock_tests")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

  return {
    questionCount: questionsRes.count ?? 0,
    topicCount: topicsRes.count ?? 0,
    chapterCount: chaptersRes.count ?? 0,
    mockTestCount: mockTestsRes.count ?? 0,
  };
}

// ── Blogs ───────────────────────────────────────────────────────────

export async function getAllBlogs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getBlogBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function getAllBlogSlugs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((b) => b.slug);
}
