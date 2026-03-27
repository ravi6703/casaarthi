import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBlogBySlug, getAllBlogSlugs, getAllBlogs } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Blog Post Not Found" };

  return {
    title: `${post.title} | CA Saarthi Blog`,
    description: post.meta_description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.meta_description,
      url: `https://www.casaarthi.in/blog/${post.slug}`,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllBlogs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "CA Saarthi",
      url: "https://www.casaarthi.in",
    },
    datePublished: post.published_at,
    url: `https://www.casaarthi.in/blog/${post.slug}`,
    keywords: (post.keywords ?? []).join(", "),
  };

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  {tableRows[0].map((cell, i) => (
                    <th key={i} className="text-left py-2 px-3 font-semibold text-gray-900">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-b border-gray-100">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-gray-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
      inTable = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Table row
      if (line.startsWith("|") && line.endsWith("|")) {
        // Skip separator rows
        if (line.match(/^\|[\s\-|]+\|$/)) continue;
        const cells = line.split("|").slice(1, -1).map((c) => c.trim());
        tableRows.push(cells);
        inTable = true;
        continue;
      }

      if (inTable) flushTable();

      if (line.startsWith("## ")) {
        elements.push(<h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        elements.push(<h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-3">{line.slice(4)}</h3>);
      } else if (line.startsWith("- **")) {
        const match = line.match(/^- \*\*(.+?)\*\*\s*[—–-]?\s*(.*)/);
        if (match) {
          elements.push(
            <li key={i} className="ml-4 mb-2 text-gray-700 list-disc">
              <strong className="text-gray-900">{match[1]}</strong>
              {match[2] && <span> — {match[2]}</span>}
            </li>
          );
        }
      } else if (line.startsWith("- ")) {
        elements.push(<li key={i} className="ml-4 mb-2 text-gray-700 list-disc">{line.slice(2)}</li>);
      } else if (line.match(/^\d+\.\s/)) {
        elements.push(<li key={i} className="ml-4 mb-2 text-gray-700 list-decimal">{line.replace(/^\d+\.\s/, "")}</li>);
      } else if (line.startsWith("**Tip:**") || line.startsWith("**The Problem:**") || line.startsWith("**The Fix:**")) {
        const match = line.match(/^\*\*(.+?)\*\*\s*(.*)/);
        if (match) {
          elements.push(
            <div key={i} className="bg-[var(--sage-light)] border-l-4 border-[var(--primary)] p-4 my-4 rounded-r-lg">
              <span className="font-bold text-[var(--teal-dark)]">{match[1]}</span>
              <span className="text-gray-700"> {match[2]}</span>
            </div>
          );
        }
      } else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(<p key={i} className="font-bold text-gray-900 mt-4 mb-2">{line.slice(2, -2)}</p>);
      } else if (line.trim() === "") {
        continue;
      } else {
        elements.push(<p key={i} className="text-gray-700 leading-relaxed mb-4">{line}</p>);
      }
    }

    if (inTable) flushTable();
    return elements;
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">CA</div>
            <span className="font-bold text-lg text-gray-900">CA Saarthi</span>
          </Link>
          <Link href="/blog" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-gray-900">
            ← All Posts
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--primary)]">Blog</Link>
          <span>/</span>
          <span className="text-gray-700 truncate">{post.title}</span>
        </div>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
          <span>{new Date(post.published_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>·</span>
          <span>{post.read_time}</span>
          <span>·</span>
          <span>By {post.author}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-10">
          {(post.keywords ?? []).map((kw: string) => (
            <span key={kw} className="text-xs bg-[var(--sage-light)] text-[var(--teal-dark)] px-2 py-1 rounded-md">{kw}</span>
          ))}
        </div>

        {/* Content */}
        <div className="prose-like">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-[var(--primary)] to-[var(--teal-dark)] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to Start Your CA Foundation Journey?</h2>
          <p className="text-blue-100 mb-6">Free diagnostic test, 2,500+ practice questions, and personalised study plans.</p>
          <Link href="/register">
            <button className="bg-white text-[var(--teal-dark)] font-bold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Get Started Free →
            </button>
          </Link>
        </div>

        {/* More posts */}
        <div className="mt-16">
          <h3 className="text-lg font-bold text-gray-900 mb-6">More Articles</h3>
          <div className="space-y-4">
            {allPosts.filter((p) => p.slug !== post.slug).map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[var(--primary)]/40 transition-all">
                  <div className="text-sm text-gray-500 mb-1">{p.read_time}</div>
                  <div className="font-semibold text-gray-900 hover:text-[var(--primary)]">{p.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
