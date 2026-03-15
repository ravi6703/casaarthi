import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/practice", "/mock-tests", "/profile", "/analytics", "/leaderboard", "/diagnostic", "/resources"],
      },
    ],
    sitemap: "https://www.casaarthi.in/sitemap.xml",
  };
}
