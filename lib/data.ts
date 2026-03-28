import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Database } from "@/types/database";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];
type Paper = Database["public"]["Tables"]["papers"]["Row"];
type MockTest = Database["public"]["Tables"]["mock_tests"]["Row"];

// ── Papers ──────────────────────────────────────────────────────────

export async function getAllPapers(): Promise<Paper[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("papers")
    .select("*")
    .order("sort_order");
  return (data ?? []) as unknown as Paper[];
}

export async function getPaperBySlug(slug: string): Promise<Paper | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("papers")
    .select("*")
    .eq("slug", slug)
    .single();
  return (data as unknown as Paper) ?? null;
}

export async function getPaperWithChaptersAndTopics(slug: string) {
  const supabase = createStaticClient();

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
  const supabase = createStaticClient();

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

export async function getAllBlogs(): Promise<Blog[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return (data ?? []) as unknown as Blog[];
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return (data as unknown as Blog) ?? null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("blogs")
    .select("slug")
    .eq("is_published", true);
  return ((data ?? []) as unknown as Pick<Blog, "slug">[]).map((b) => b.slug);
}

// ── Topics (public) ────────────────────────────────────────────────

export async function getAllTopicsWithMeta() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("topics")
    .select(
      `id, name, slug, paper_id, chapter_id, exam_weightage,
      papers (name, slug, sort_order),
      chapters (name, slug, chapter_number)`
    )
    .order("paper_id")
    .order("name");
  return data ?? [];
}

export async function getTopicBySlug(slug: string) {
  const supabase = createStaticClient();
  const { data: topic } = await supabase
    .from("topics")
    .select(
      `id, name, slug, paper_id, chapter_id, exam_weightage,
      papers (id, name, slug, sort_order),
      chapters (id, name, slug, chapter_number)`
    )
    .eq("slug", slug)
    .single();

  if (!topic) return null;

  // Get study notes separately (column added via migration, avoids type-gen lag)
  const { data: notesRow } = await supabase
    .from("topics")
    .select("study_notes" as any)
    .eq("id", topic.id)
    .single();
  const study_notes: string | null = (notesRow as any)?.study_notes ?? null;

  // Get question count by difficulty
  const { data: questions } = await supabase
    .from("questions")
    .select("difficulty")
    .eq("topic_id", topic.id)
    .eq("status", "approved");

  const questionStats = {
    total: questions?.length ?? 0,
    easy: questions?.filter((q) => q.difficulty === "easy").length ?? 0,
    medium: questions?.filter((q) => q.difficulty === "medium").length ?? 0,
    hard: questions?.filter((q) => q.difficulty === "hard").length ?? 0,
  };

  // Get sibling topics from same chapter
  const { data: siblingTopics } = await supabase
    .from("topics")
    .select("id, name, slug")
    .eq("chapter_id", topic.chapter_id!)
    .neq("id", topic.id)
    .order("name")
    .limit(10);

  return { topic: { ...topic, study_notes }, questionStats, siblingTopics: siblingTopics ?? [] };
}

// ── Chapters (public) ──────────────────────────────────────────────

export async function getAllChaptersWithMeta() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("chapters")
    .select(
      `id, name, slug, chapter_number, paper_id,
      papers (name, slug, sort_order)`
    )
    .order("paper_id")
    .order("chapter_number");
  return data ?? [];
}

export async function getChapterBySlug(
  paperSlug: string,
  chapterSlug: string
) {
  const supabase = createStaticClient();

  const { data: paper } = await supabase
    .from("papers")
    .select("*")
    .eq("slug", paperSlug)
    .single();

  if (!paper) return null;

  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("paper_id", paper.id)
    .eq("slug", chapterSlug)
    .single();

  if (!chapter) return null;

  const { data: topics } = await supabase
    .from("topics")
    .select("id, name, slug, exam_weightage")
    .eq("chapter_id", chapter.id)
    .order("name");

  // Get question count per topic
  const topicsWithCounts = await Promise.all(
    (topics ?? []).map(async (t) => {
      const { count } = await supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("topic_id", t.id)
        .eq("status", "approved");
      return { ...t, questionCount: count ?? 0 };
    })
  );

  // Get all chapters for navigation
  const { data: allChapters } = await supabase
    .from("chapters")
    .select("id, name, slug, chapter_number")
    .eq("paper_id", paper.id)
    .order("chapter_number");

  return {
    paper,
    chapter,
    topics: topicsWithCounts,
    allChapters: allChapters ?? [],
  };
}
