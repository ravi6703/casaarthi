import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizeCss: true,
  },
  headers: async () => [
    {
      source: "/(icon-192|icon-512|apple-touch-icon|og-image)\\.(png|jpg)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/manifest.webmanifest",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
        { key: "Content-Type", value: "application/manifest+json" },
      ],
    },
  ],
};

export default nextConfig;
