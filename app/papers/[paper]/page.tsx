import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import {
  getAllPapers,
  getPaperBySlug,
  getPaperWithChaptersAndTopics,
} from "@/lib/data";

const SITE_URL = "https://www.casaarthi.in";

export async function generateStaticParams() {
  const papers = await getAllPapers();
  return papers.map((p) => ({ paper: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ paper: string }>;
}): Promise<Metadata> {
  const { paper: slug } = await params;
  const paper = await getPaperBySlug(slug);
  if (!paper) return {};

  const title = `CA Foundation Paper ${paper.sort_order}: ${paper.name} — Syllabus, Exam Pattern & Free Practice`;
  const description = `Complete guide to CA Foundation Paper ${paper.sort_order} (${paper.name}). Detailed ICAI syllabus topics, exam pattern, marks distribution, question types, and free practice questions on CA Saarthi.`;

  return {
    title,
    description,
    keywords: [
      `CA Foundation Paper ${paper.sort_order}`,
      paper.name,
      `CA Foundation ${paper.name.split(" ")[0].toLowerCase()}`,
      `CA Foundation ${paper.slug} syllabus`,
      `CA Foundation ${paper.slug} exam pattern`,
      "CA Foundation preparation",
      "ICAI syllabus",
      "CA Foundation 2026",
      "CA Foundation free mock test",
      "CA Saarthi",
    ],
    alternates: {
      canonical: `/papers/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/papers/${slug}`,
      siteName: "CA Saarthi",
      type: "article",
    },
  };
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ paper: string }>;
}) {
  const { paper: slug } = await params;
  const result = await getPaperWithChaptersAndTopics(slug);
  if (!result) notFound();

  const { paper, chapters } = result;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `CA Foundation Paper ${paper.sort_order}: ${paper.name}`,
    description: paper.description,
    provider: {
      "@type": "Organization",
      name: "CA Saarthi",
      url: SITE_URL,
    },
    isAccessibleForFree: true,
    educationalLevel: "Foundation",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.casaarthi.in" },
      { "@type": "ListItem", "position": 2, "name": "Papers", "item": "https://www.casaarthi.in/papers" },
      { "@type": "ListItem", "position": 3, "name": paper.name, "item": `https://www.casaarthi.in/papers/${paper.slug}` }
    ]
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
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-[var(--primary)] transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/papers"
            className="hover:text-[var(--primary)] transition-colors"
          >
            Papers
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Paper {paper.sort_order}</span>
        </nav>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="inline-flex items-center gap-2 bg-[var(--sage-light)] border border-[var(--border)] rounded-full px-4 py-1.5 text-sm text-[var(--teal-dark)] mb-6">
          Paper {paper.sort_order} of 4
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          {paper.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">{paper.description}</p>
      </section>

      {/* Exam Pattern */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Exam Pattern
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: "Total Marks", value: `${paper.total_marks}` },
              { label: "Duration", value: `${paper.duration_minutes} min` },
              { label: "Question Type", value: paper.question_type },
              {
                label: (paper.question_type ?? "").includes("MCQ")
                  ? "Total MCQs"
                  : "Total Questions",
                value: `${paper.total_questions}`,
              },
              { label: "Negative Marking", value: paper.negative_marking },
              { label: "Passing Marks", value: `${paper.passing_marks}%` },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-[var(--primary)] mb-1">
                  {item.value}
                </div>
                <div className="text-xs font-medium text-gray-600">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Detailed Syllabus
        </h2>
        <p className="text-gray-600 mb-10">
          Complete topic-wise breakdown as per ICAI curriculum
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {chapters.map((chapter, i) => (
            <div
              key={chapter.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[var(--primary)] hover:shadow-lg transition-all group"
            >
              <Link
                href={`/papers/${paper.slug}/${chapter.slug}`}
                className="flex items-start gap-3 mb-4"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--sage-light)] text-[var(--teal-dark)] flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[var(--primary)] transition-colors">
                  {chapter.name}
                </h3>
              </Link>
              <ul className="space-y-2 ml-11">
                {(chapter.topics ?? []).map((topic: { id: string; name: string; slug: string }) => (
                  <li
                    key={topic.id}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="text-[var(--sage)] mt-1 flex-shrink-0">
                      &bull;
                    </span>
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="hover:text-[var(--primary)] transition-colors"
                    >
                      {topic.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--primary)] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start preparing for Paper {paper.sort_order} today
          </h2>
          <p className="text-white text-opacity-90 mb-8 text-lg">
            Get access to{" "}
            2,500+ practice
            questions, 10 full-length mock tests, and a personalised study plan
            — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 bg-white text-[var(--primary)] hover:bg-[var(--sage-light)]"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/papers">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 border-white text-white hover:bg-[var(--teal-dark)]"
              >
                View All Papers
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
                <span className="font-bold text-lg text-white">
                  CA Saarthi
                </span>
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
                  <Link href="/register" className="hover:text-white transition-colors">
                    Diagnostic Test
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Practice Questions
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Mock Tests
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
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
