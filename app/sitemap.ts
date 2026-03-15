import type { MetadataRoute } from "next";

const SITE_URL = "https://www.casaarthi.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const paperSlugs = [
    "accounting",
    "business-laws",
    "quantitative-aptitude",
    "business-economics",
  ];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/papers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...paperSlugs.map((slug) => ({
      url: `${SITE_URL}/papers/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
  ];
}
