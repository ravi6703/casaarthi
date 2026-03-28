import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import {
  getAllPapers,
  getAllChaptersWithMeta,
  getChapterBySlug,
} from "@/lib/data";

const SITE_URL = "https://www.casaarthi.in";

export async function generateStaticParams() {
  const allChapters = await getAllChaptersWithMeta();
  return allChapters.map((c) => {
    const paperSlug = Array.isArray(c.papers)
      ? c.papers[0]?.slug || ""
      : c.papers?.slug || "";
    return {
      paper: paperSlug,
      chapter: c.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ paper: string; chapter: string }>;
}): Promise<Metadata> {
  const { paper: paperSlug, chapter: chapterSlug } = await params;
  const result = await getChapterBySlug(paperSlug, chapterSlug);
  if (!result) return {};

  const { paper, chapter } = result;

  const title = `${chapter.name} — CA Foundation Paper ${paper.sort_order} Study Guide | CA Saarthi`;
  const description = `Complete study guide for ${chapter.name} (CA Foundation Paper ${paper.sort_order}). Master all topics with practice questions, detailed notes, and expert solutions on CA Saarthi.`;

  return {
    title,
    description,
    keywords: [
      chapter.name,
      `${chapter.name} CA Foundation`,
      `${chapter.name} study guide`,
      `Paper ${paper.sort_order}`,
      paper.name,
      "CA Foundation preparation",
      "CA Foundation exam",
      "CA Saarthi",
    ],
    alternates: {
      canonical: `/papers/${paperSlug}/${chapterSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/papers/${paperSlug}/${chapterSlug}`,
      siteName: "CA Saarthi",
      type: "article",
    },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ paper: string; chapter: string }>;
}) {
  const { paper: paperSlug, chapter: chapterSlug } = await params;
  const result = await getChapterBySlug(paperSlug, chapterSlug);
  if (!result) notFound();

  const { paper, chapter, topics, allChapters } = result;

  // Find prev/next chapters
  const currentIndex = allChapters.findIndex((c) => c.id === chapter.id);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  // Get total questions in chapter
  const totalQuestionsInChapter = topics.reduce(
    (sum, t) => sum + (t.questionCount ?? 0),
    0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${chapter.name} — CA Foundation Paper ${paper.sort_order}`,
    description: `Complete study guide for ${chapter.name}`,
    provider: {
      "@type": "Organization",
      name: "CA Saarthi",
      url: SITE_URL,
    },
    isAccessibleForFree: true,
    educationalLevel: "Foundation",
    hasPart: topics.map((t) => ({
      "@type": "Module",
      name: t.name,
      url: `${SITE_URL}/topics/${t.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Papers",
        item: `${SITE_URL}/papers`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: paper.name,
        item: `${SITE_URL}/papers/${paper.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: chapter.name,
        item: `${SITE_URL}/papers/${paper.slug}/${chapter.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-white to-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
              CA
            </div>
            <span className="font-bold text-lg text-gray-900">CA Saarthi</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="text-sm text-gray-500 overflow-auto">
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/"
              className="hover:text-[var(--primary)] transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <span className="mx-1">/</span>
            <Link
              href="/papers"
              className="hover:text-[var(--primary)] transition-colors whitespace-nowrap"
            >
              Papers
            </Link>
            <span className="mx-1">/</span>
            <Link
              href={`/papers/${paper.slug}`}
              className="hover:text-[var(--primary)] transition-colors whitespace-nowrap"
            >
              Paper {paper.sort_order}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 whitespace-nowrap">
              {chapter.name}
            </span>
          </div>
        </nav>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="inline-flex flex-wrap items-center gap-2 mb-6">
          <div className="bg-[var(--sage-light)] border border-[var(--sage)] rounded-full px-3 py-1 text-xs text-[var(--teal-dark)] font-medium">
            Paper {paper.sort_order}: {paper.name}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs text-blue-700 font-medium">
            Chapter {chapter.chapter_number}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          {chapter.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Complete study guide with {totalQuestionsInChapter} practice questions
          across {topics.length} topics. Master all concepts with detailed notes,
          expert solutions, and exam-focused strategies.
        </p>
      </section>

      {/* Chapter Stats */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Chapter Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 rounded-xl p-6 text-center border border-[var(--primary)]/20">
              <div className="text-3xl font-bold text-[var(--primary)] mb-1">
                {topics.length}
              </div>
              <div className="text-sm font-medium text-gray-600">Topics</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {totalQuestionsInChapter}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Questions
              </div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 text-center border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-1">+10</div>
              <div className="text-sm font-medium text-gray-600">
                Video Solutions
              </div>
            </div>
            <div className="bg-[var(--sage-light)] rounded-xl p-6 text-center border border-[var(--sage)]">
              <div className="text-3xl font-bold text-[var(--teal-dark)] mb-1">
                Free
              </div>
              <div className="text-sm font-medium text-gray-600">Full Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Topics</h2>
        <p className="text-gray-600 mb-10">
          Click on any topic to view questions and study materials
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-[var(--primary)] hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-1">
                    {topic.name}
                  </h3>
                  {topic.exam_weightage && (
                    <p className="text-xs text-gray-500">
                      {topic.exam_weightage}% exam weightage
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-600">
                  {topic.questionCount} questions
                </span>
                <span className="text-sm text-[var(--primary)] font-medium">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Study Tips */}
      <section className="bg-[var(--sage-light)] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Study Tips for {chapter.name}
          </h2>
          <p className="text-gray-600 mb-10">
            Expert strategies to master this chapter efficiently
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Start with Concept Videos",
                description:
                  "Watch our comprehensive concept videos to build a strong foundation before attempting questions.",
              },
              {
                title: "Practice Topic by Topic",
                description:
                  "Master each topic individually before moving to the next. Focus on understanding over speed.",
              },
              {
                title: "Review Wrong Answers",
                description:
                  "Spend time understanding why you got a question wrong. Read detailed solutions provided.",
              },
              {
                title: "Track Your Progress",
                description:
                  "Monitor your performance metrics to identify weak areas and create a targeted study plan.",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-6 border border-[var(--sage)]"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {i + 1}. {tip.title}
                </h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      {(prevChapter || nextChapter) && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {prevChapter ? (
              <Link
                href={`/papers/${paper.slug}/${prevChapter.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-[var(--primary)] hover:shadow-lg transition-all"
              >
                <p className="text-sm text-gray-500 mb-2">
                  ← Previous Chapter
                </p>
                <h3 className="font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                  {prevChapter.name}
                </h3>
              </Link>
            ) : (
              <div />
            )}
            {nextChapter ? (
              <Link
                href={`/papers/${paper.slug}/${nextChapter.slug}`}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-[var(--primary)] hover:shadow-lg transition-all text-right"
              >
                <p className="text-sm text-gray-500 mb-2">Next Chapter →</p>
                <h3 className="font-semibold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
                  {nextChapter.name}
                </h3>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[var(--primary)] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start studying {chapter.name} today
          </h2>
          <p className="text-white text-opacity-90 mb-8 text-lg">
            Get access to all {totalQuestionsInChapter} practice questions,
            detailed solutions, and personalized study analytics — completely
            free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 bg-white text-[var(--primary)] hover:bg-[var(--sage-light)]"
              >
                Start Studying Now
              </Button>
            </Link>
            <Link href={`/papers/${paper.slug}`}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 border-white text-white hover:bg-[var(--teal-dark)]"
              >
                View Paper {paper.sort_order}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
                  CA
                </div>
                <span className="font-bold text-lg text-white">CA Saarthi</span>
              </div>
              <p className="text-sm leading-relaxed">
                India&apos;s free CA Foundation preparation platform. Smart
                diagnostics, practice, and mock tests.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Product
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/register"
                    className="hover:text-white transition-colors"
                  >
                    Diagnostic Test
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-white transition-colors"
                  >
                    Practice Questions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-white transition-colors"
                  >
                    Mock Tests
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="hover:text-white transition-colors"
                  >
                    AI Study Plan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Papers */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Papers
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/papers/accounting"
                    className="hover:text-white transition-colors"
                  >
                    Paper 1: Accounting
                  </Link>
                </li>
                <li>
                  <Link
                    href="/papers/business-laws"
                    className="hover:text-white transition-colors"
                  >
                    Paper 2: Business Laws
                  </Link>
                </li>
                <li>
                  <Link
                    href="/papers/quantitative-aptitude"
                    className="hover:text-white transition-colors"
                  >
                    Paper 3: Quant & Stats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/papers/business-economics"
                    className="hover:text-white transition-colors"
                  >
                    Paper 4: Economics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                Connect
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:support@casaarthi.in"
                    className="hover:text-white transition-colors"
                  >
                    support@casaarthi.in
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} CA Saarthi. All rights reserved.
              Not affiliated with ICAI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
