import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import {
  getAllTopicsWithMeta,
  getTopicBySlug,
} from "@/lib/data";

const SITE_URL = "https://www.casaarthi.in";

export async function generateStaticParams() {
  const topics = await getAllTopicsWithMeta();
  return topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getTopicBySlug(slug);
  if (!result) return {};

  const { topic } = result;
  const paper = Array.isArray(topic.papers) ? topic.papers[0] : topic.papers;
  const chapter = Array.isArray(topic.chapters) ? topic.chapters[0] : topic.chapters;

  const title = `${topic.name} — CA Foundation ${paper?.name} Questions & Study Notes | CA Saarthi`;
  const description = `Master ${topic.name} with ${result.questionStats.total} practice questions, detailed notes, and expert solutions on CA Saarthi. Complete guide for CA Foundation Paper ${paper?.sort_order}.`;

  return {
    title,
    description,
    keywords: [
      topic.name,
      `${topic.name} CA Foundation`,
      `${topic.name} questions`,
      `${paper?.name}`,
      `${chapter?.name}`,
      "CA Foundation practice",
      "CA Foundation exam",
      "CA Saarthi",
    ],
    alternates: {
      canonical: `/topics/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/topics/${slug}`,
      siteName: "CA Saarthi",
      type: "article",
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getTopicBySlug(slug);
  if (!result) notFound();

  const { topic, questionStats, siblingTopics } = result;
  const paper = Array.isArray(topic.papers) ? topic.papers[0] : topic.papers;
  const chapter = Array.isArray(topic.chapters) ? topic.chapters[0] : topic.chapters;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: topic.name,
    description: `Study guide for ${topic.name} in CA Foundation ${paper?.name}`,
    provider: {
      "@type": "Organization",
      name: "CA Saarthi",
      url: SITE_URL,
    },
    isAccessibleForFree: true,
    educationalLevel: "Foundation",
    ...(topic.study_notes && {
      hasCourse: {
        "@type": "Course",
        name: `${topic.name} — CA Foundation Study Notes`,
        description: topic.study_notes.substring(0, 300),
        provider: { "@type": "Organization", name: "CA Saarthi" },
        isAccessibleForFree: true,
      },
    }),
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
        name: paper?.name,
        item: `${SITE_URL}/papers/${paper?.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: chapter?.name,
        item: `${SITE_URL}/papers/${paper?.slug}/${chapter?.slug}`,
      },
      {
        "@type": "ListItem",
        position: 5,
        name: topic.name,
        item: `${SITE_URL}/topics/${slug}`,
      },
    ],
  };

  const quizJsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `${topic.name} Practice Questions`,
    description: `${questionStats.total} practice questions for ${topic.name}`,
    hasPart: [
      {
        "@type": "Question",
        typicalAgeRange: "18+",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
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
            <Link href="/" className="hover:text-[var(--primary)] transition-colors whitespace-nowrap">
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
              href={`/papers/${paper?.slug}`}
              className="hover:text-[var(--primary)] transition-colors whitespace-nowrap"
            >
              {paper?.name}
            </Link>
            <span className="mx-1">/</span>
            <Link
              href={`/papers/${paper?.slug}/${chapter?.slug}`}
              className="hover:text-[var(--primary)] transition-colors whitespace-nowrap"
            >
              {chapter?.name}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 whitespace-nowrap">{topic.name}</span>
          </div>
        </nav>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="inline-flex flex-wrap items-center gap-2 mb-6">
          <div className="bg-[var(--sage-light)] border border-[var(--sage)] rounded-full px-3 py-1 text-xs text-[var(--teal-dark)] font-medium">
            {paper?.name}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-xs text-blue-700 font-medium">
            {chapter?.name}
          </div>
          {topic.exam_weightage && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 text-xs text-yellow-700 font-medium">
              {topic.exam_weightage}% weightage
            </div>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          {topic.name}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Complete study guide with {questionStats.total} practice questions,
          detailed explanations, and expert solutions for {topic.name} in CA
          Foundation {paper?.name}.
        </p>
      </section>

      {/* Question Statistics */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Practice Questions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 rounded-xl p-6 text-center border border-[var(--primary)]/20">
              <div className="text-3xl font-bold text-[var(--primary)] mb-1">
                {questionStats.total}
              </div>
              <div className="text-sm font-medium text-gray-600">
                Total Questions
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {questionStats.easy}
              </div>
              <div className="text-sm font-medium text-gray-600">Easy</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 text-center border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {questionStats.medium}
              </div>
              <div className="text-sm font-medium text-gray-600">Medium</div>
            </div>
            <div className="bg-red-50 rounded-xl p-6 text-center border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {questionStats.hard}
              </div>
              <div className="text-sm font-medium text-gray-600">Hard</div>
            </div>
            <div className="bg-[var(--sage-light)] rounded-xl p-6 text-center border border-[var(--sage)]">
              <div className="text-3xl font-bold text-[var(--teal-dark)] mb-1">
                +
              </div>
              <div className="text-sm font-medium text-gray-600">
                Video Solutions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Study Notes — Main SEO Content */}
      {topic.study_notes && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Study Notes: {topic.name}
          </h2>
          <p className="text-gray-600 mb-8">
            Free study material for CA Foundation {paper?.name} — {chapter?.name}
          </p>
          <article className="bg-white rounded-xl border border-gray-200 p-8 md:p-10 prose prose-gray max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900 prose-li:text-gray-700">
            {topic.study_notes.split('\n\n').map((paragraph: string, i: number) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-3">{paragraph.replace(/\*\*/g, '')}</h3>;
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                const items = paragraph.split('\n').filter((line: string) => line.trim());
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 my-4">
                    {items.map((item: string, j: number) => (
                      <li key={j} className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{
                        __html: item.replace(/^[-*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith('1. ') || paragraph.startsWith('1) ')) {
                const items = paragraph.split('\n').filter((line: string) => line.trim());
                return (
                  <ol key={i} className="list-decimal pl-6 space-y-2 my-4">
                    {items.map((item: string, j: number) => (
                      <li key={j} className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{
                        __html: item.replace(/^\d+[.)]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                    ))}
                  </ol>
                );
              }
              return (
                <p key={i} className="text-gray-700 leading-relaxed my-4" dangerouslySetInnerHTML={{
                  __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              );
            })}
          </article>
        </section>
      )}

      {/* Key Learning Points */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What You'll Learn
        </h2>
        <p className="text-gray-600 mb-10">
          Master the core concepts and exam-focused topics
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📚",
              title: "Concept Deep Dive",
              desc: "Learn from comprehensive study notes with real-world examples",
            },
            {
              icon: "🎯",
              title: "Exam-Focused",
              desc: "Practice with questions that actually appear in CA Foundation exams",
            },
            {
              icon: "📊",
              title: "Detailed Analytics",
              desc: "Track your performance and identify weak areas instantly",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-8 hover:border-[var(--primary)] transition-colors"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Topics */}
      {siblingTopics.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Topics in {chapter?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siblingTopics.map((relatedTopic) => (
                <Link
                  key={relatedTopic.id}
                  href={`/topics/${relatedTopic.slug}`}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[var(--primary)] hover:shadow-lg transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {relatedTopic.name}
                  </h3>
                  <div className="text-sm text-[var(--primary)] font-medium">
                    View Topic →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[var(--primary)] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start mastering {topic.name} today
          </h2>
          <p className="text-white text-opacity-90 mb-8 text-lg">
            Get access to all {questionStats.total} practice questions, detailed
            solutions, and personalized insights — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 bg-white text-[var(--primary)] hover:bg-[var(--sage-light)]"
              >
                Start Practicing Now
              </Button>
            </Link>
            <Link href={`/papers/${paper?.slug}/${chapter?.slug}`}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 border-white text-white hover:bg-[var(--teal-dark)]"
              >
                View Chapter Guide
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
