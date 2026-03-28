/* ------------------------------------------------------------------ */
/*  Auto Internal Linker                                               */
/*  Scans new blog content and injects links to related existing       */
/*  blog posts, chapters, and topics for better SEO                    */
/* ------------------------------------------------------------------ */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const SITE_URL = "https://www.casaarthi.in";

interface BlogPost {
  slug: string;
  title: string;
  keywords: string[];
}

interface LinkSuggestion {
  anchorText: string;
  url: string;
  type: "blog" | "topic" | "paper";
}

function getSupabase() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Find related content from existing blogs, topics, and chapters
 * based on keyword overlap with the new post
 */
async function findRelatedContent(
  keywords: string[],
  excludeSlug: string
): Promise<LinkSuggestion[]> {
  const supabase = getSupabase();
  const suggestions: LinkSuggestion[] = [];

  // 1. Find related blog posts by keyword overlap
  const { data: blogs } = await supabase
    .from("blogs")
    .select("slug, title, keywords")
    .eq("is_published", true)
    .neq("slug", excludeSlug)
    .limit(100);

  if (blogs) {
    const scored = blogs
      .map((blog) => {
        const blogKeywords = (blog.keywords || []).map((k: string) =>
          k.toLowerCase()
        );
        const overlap = keywords.filter((kw) =>
          blogKeywords.some(
            (bk: string) => bk.includes(kw.toLowerCase()) || kw.toLowerCase().includes(bk)
          )
        ).length;
        return { ...blog, score: overlap };
      })
      .filter((b) => b.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    for (const blog of scored) {
      suggestions.push({
        anchorText: blog.title,
        url: `${SITE_URL}/blog/${blog.slug}`,
        type: "blog",
      });
    }
  }

  // 2. Find related topics
  const { data: topics } = await supabase
    .from("topics")
    .select("slug, name")
    .limit(200);

  if (topics) {
    const matchedTopics = topics
      .filter((topic) =>
        keywords.some(
          (kw) =>
            topic.name.toLowerCase().includes(kw.toLowerCase()) ||
            kw.toLowerCase().includes(topic.name.toLowerCase().split(" ")[0])
        )
      )
      .slice(0, 2);

    for (const topic of matchedTopics) {
      suggestions.push({
        anchorText: topic.name,
        url: `${SITE_URL}/topics/${topic.slug}`,
        type: "topic",
      });
    }
  }

  return suggestions;
}

/**
 * Inject internal links into blog content HTML.
 * Adds a "Related on CA Saarthi" section at the end, before MCQs if present.
 */
export async function addInternalLinks(
  content: string,
  slug: string,
  keywords: string[]
): Promise<string> {
  try {
    const related = await findRelatedContent(keywords, slug);

    if (related.length === 0) return content;

    // Build the related links HTML section
    const linksHtml = `
<div style="background:#E8F0EA;border-left:4px solid #4A90A4;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
  <h3 style="margin:0 0 10px;color:#3A7A8E;font-size:16px;">📚 Related on CA Saarthi</h3>
  <ul style="margin:0;padding-left:20px;">
    ${related
      .map(
        (link) =>
          `<li style="margin-bottom:6px;"><a href="${link.url}" style="color:#4A90A4;text-decoration:none;font-weight:500;">${link.anchorText}</a></li>`
      )
      .join("\n    ")}
  </ul>
</div>`;

    // Try to insert before MCQ section, otherwise append at end
    const mcqPattern =
      /<h[23][^>]*>.*(?:MCQ|Practice Questions|Quiz|Test Yourself).*<\/h[23]>/i;
    const mcqMatch = content.match(mcqPattern);

    if (mcqMatch && mcqMatch.index !== undefined) {
      // Insert before MCQs
      return (
        content.slice(0, mcqMatch.index) +
        linksHtml +
        "\n" +
        content.slice(mcqMatch.index)
      );
    }

    // Append at end
    return content + "\n" + linksHtml;
  } catch (error) {
    console.error("Internal linking error:", error);
    return content; // Return original content on error
  }
}
