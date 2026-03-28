"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Database } from "@/types/database";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

interface BlogClientProps {
  initialPosts: Blog[];
}

const CATEGORIES = [
  { id: "all", label: "All", filter: () => true },
  { id: "paper1", label: "Accounting (Paper 1)", filter: (post: Blog) =>
    post.keywords?.some(k => k.toLowerCase().includes("accounting") || k.toLowerCase().includes("paper 1")) ?? false },
  { id: "paper2", label: "Business Laws (Paper 2)", filter: (post: Blog) =>
    post.keywords?.some(k => k.toLowerCase().includes("business laws") || k.toLowerCase().includes("paper 2")) ?? false },
  { id: "paper3", label: "Quantitative Aptitude (Paper 3)", filter: (post: Blog) =>
    post.keywords?.some(k => k.toLowerCase().includes("mathematics") || k.toLowerCase().includes("statistics") || k.toLowerCase().includes("paper 3")) ?? false },
  { id: "paper4", label: "Economics (Paper 4)", filter: (post: Blog) =>
    post.keywords?.some(k => k.toLowerCase().includes("economics") || k.toLowerCase().includes("paper 4")) ?? false },
  { id: "current-affairs", label: "Current Affairs", filter: (post: Blog) =>
    post.keywords?.some(k => k.toLowerCase().includes("current affairs")) ?? false },
  { id: "exam-strategy", label: "Exam Strategy", filter: (post: Blog) =>
    post.keywords?.some(k => k.toLowerCase().includes("strategy") || k.toLowerCase().includes("tips") || k.toLowerCase().includes("preparation")) ?? false },
];

export function BlogClient({ initialPosts }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const POSTS_PER_PAGE = 12;

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let result = initialPosts;

    // Apply category filter
    if (selectedCategory !== "all") {
      const category = CATEGORIES.find(c => c.id === selectedCategory);
      if (category) {
        result = result.filter(category.filter);
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.keywords?.some(k => k.toLowerCase().includes(query)) ?? false)
      );
    }

    return result;
  }, [searchQuery, selectedCategory, initialPosts]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubscribeStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribeStatus("success");
        setEmail("");
        setTimeout(() => setSubscribeStatus("idle"), 3000);
      } else {
        setSubscribeStatus("error");
        setTimeout(() => setSubscribeStatus("idle"), 3000);
      }
    } catch {
      setSubscribeStatus("error");
      setTimeout(() => setSubscribeStatus("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search blog posts by title or keywords..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
          />
          <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--sage-light)] text-[var(--teal-dark)] hover:bg-[var(--sage)]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No posts found matching your search.</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <article className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[var(--primary)] transition-all bg-white">
                    {/* Header with date and read time */}
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span>{new Date(post.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                      <span>·</span>
                      <span>{post.read_time}</span>
                      {post.author && (
                        <>
                          <span>·</span>
                          <span>{post.author}</span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-2">
                      {post.title}
                    </h2>

                    {/* Excerpt (2 lines) */}
                    <p className="text-gray-600 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(post.keywords ?? []).slice(0, 3).map((kw: string) => (
                        <span
                          key={kw}
                          className="text-xs bg-[var(--sage-light)] text-[var(--teal-dark)] px-3 py-1 rounded-full font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        currentPage === i + 1
                          ? "bg-[var(--primary)] text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-[var(--sage-light)] border-t border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Get Daily CA Foundation Tips
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter for exclusive preparation strategies, exam tips, and updates straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === "loading"}
                  className="px-6 py-3 bg-[var(--primary)] text-white font-medium rounded-lg hover:bg-[var(--teal-dark)] disabled:opacity-50 transition-all"
                >
                  {subscribeStatus === "loading" ? "..." : "Subscribe"}
                </button>
              </div>

              {subscribeStatus === "success" && (
                <p className="text-sm text-green-700">Great! Check your email to confirm.</p>
              )}
              {subscribeStatus === "error" && (
                <p className="text-sm text-red-700">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
