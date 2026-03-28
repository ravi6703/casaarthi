import type { MetadataRoute } from "next";
import {
  getAllPapers,
  getAllBlogs,
  getAllTopicsWithMeta,
  getAllChaptersWithMeta,
} from "@/lib/data";

const SITE_URL = "https://www.casaarthi.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [papers, blogs, topics, chapters] = await Promise.all([
    getAllPapers(),
    getAllBlogs(),
    getAllTopicsWithMeta(),
    getAllChaptersWithMeta(),
  ]);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/papers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/daily-quiz`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/study-resources`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...papers.map((p) => ({
      url: `${SITE_URL}/papers/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogs.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...chapters
      .map((c) => {
        const paperSlug = Array.isArray(c.papers)
          ? c.papers[0]?.slug
          : c.papers?.slug;
        return {
          url: `${SITE_URL}/papers/${paperSlug}/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.75,
        };
      })
      .filter((item) => item.url.includes("/papers/") && !item.url.includes("undefined")),
    ...topics.map((t) => ({
      url: `${SITE_URL}/topics/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
