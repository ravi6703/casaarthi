import Link from "next/link";
import type { Metadata } from "next";
import { getAllBlogs } from "@/lib/data";

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
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">CA</div>
            <span className="font-bold text-lg text-gray-900">CA Saarthi</span>
          </Link>
          <Link href="/register" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--teal-dark)]">
            Get Started Free →
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-lg text-gray-600 mb-12">
          Expert guides and preparation strategies for CA Foundation aspirants.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[var(--border)] transition-all">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                  <span>{new Date(post.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
                  <span>·</span>
                  <span>{post.read_time}</span>
                  <span>·</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {(post.keywords ?? []).slice(0, 3).map((kw: string) => (
                    <span key={kw} className="text-xs bg-[var(--sage-light)] text-[var(--teal-dark)] px-2 py-1 rounded-md">{kw}</span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
