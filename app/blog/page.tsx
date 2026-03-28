import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogs } from "@/lib/data";
import { BlogClient } from "./blog-client";

export const metadata: Metadata = {
  title: "Blog | CA Saarthi — CA Foundation Preparation Tips & Guides",
  description: "Expert guides, study tips, and preparation strategies for CA Foundation exam. Free resources from CA Saarthi.",
  openGraph: {
    title: "CA Foundation Blog — Study Tips & Preparation Guides",
    description: "Expert guides and strategies for CA Foundation preparation.",
    url: "https://www.casaarthi.in/blog",
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogs();

  return (
    <div className="min-h-screen bg-white">
      {/* Full Navigation Bar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">CA</div>
            <span className="font-bold text-lg text-gray-900">CA Saarthi</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[var(--primary)] transition-colors">
              Home
            </Link>
            <Link href="#papers" className="text-sm font-medium text-gray-700 hover:text-[var(--primary)] transition-colors">
              Papers
            </Link>
            <Link href="/blog" className="text-sm font-medium text-[var(--primary)]">
              Blog
            </Link>
            <Link href="#faq" className="text-sm font-medium text-gray-700 hover:text-[var(--primary)] transition-colors">
              FAQ
            </Link>
            <Link href="#topics" className="text-sm font-medium text-gray-700 hover:text-[var(--primary)] transition-colors">
              Topics
            </Link>
            <Link href="/register" className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--teal-dark)] transition-all">
              Get Started Free
            </Link>
          </div>

          {/* Mobile CTA */}
          <div className="md:hidden flex-shrink-0">
            <Link href="/register" className="px-3 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-medium hover:bg-[var(--teal-dark)] transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Expert guides, study strategies, and insider tips from CA Saarthi to help you ace the CA Foundation exam.
          </p>
        </div>
      </div>

      {/* Client Component with all interactive features */}
      <BlogClient initialPosts={posts} />
    </div>
  );
}
