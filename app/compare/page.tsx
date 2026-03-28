import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "CA Foundation Comparisons & Guides | CA Saarthi",
  description: "Compare CA Foundation with CMA, CS, and explore self-study vs coaching, old vs new syllabus, and best CA Foundation apps. Get expert guidance for your CA journey.",
  keywords: [
    "CA Foundation vs CMA",
    "CA Foundation vs CS",
    "CA Foundation self-study vs coaching",
    "CA Foundation new syllabus 2024",
    "best CA Foundation apps",
    "CA Foundation comparison",
    "CA Saarthi",
  ],
  alternates: {
    canonical: "/compare",
  },
  openGraph: {
    title: "CA Foundation Comparisons & Decision Guides",
    description: "Compare CA Foundation with other qualifications, preparation methods, and study resources. Make informed decisions about your CA journey.",
    url: "https://www.casaarthi.in/compare",
    type: "website",
  },
};

const comparisons = [
  {
    slug: "ca-foundation-vs-cma-foundation",
    title: "CA Foundation vs CMA Foundation",
    description: "Compare CA and CMA Foundation courses to understand differences in eligibility, syllabus, exam difficulty, career prospects, and which path is right for you.",
    category: "Qualification Comparison",
  },
  {
    slug: "ca-foundation-vs-cs-foundation",
    title: "CA Foundation vs CS Foundation",
    description: "Detailed comparison between CA Foundation and CS Foundation covering course content, exam patterns, career options, and salary potential in India.",
    category: "Qualification Comparison",
  },
  {
    slug: "ca-foundation-self-study-vs-coaching",
    title: "Self-Study vs Coaching for CA Foundation",
    description: "Analyze self-study and coaching approaches for CA Foundation - pros, cons, cost-benefit analysis, and guidance on choosing the best preparation method for you.",
    category: "Preparation Method",
  },
  {
    slug: "ca-foundation-old-vs-new-syllabus",
    title: "CA Foundation Old Syllabus vs New Syllabus 2024",
    description: "Compare old and new CA Foundation syllabi - key changes, new topics, removed content, and how to prepare for the 2024 exam pattern.",
    category: "Syllabus Guide",
  },
  {
    slug: "best-ca-foundation-apps-2026",
    title: "Best CA Foundation Apps 2026",
    description: "Review and compare top CA Foundation preparation apps - features, pricing, ratings, and which app works best for different learning styles.",
    category: "Study Tools",
  },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
              CA
            </div>
            <span className="font-bold text-lg text-gray-900">CA Saarthi</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900">
              FAQ
            </Link>
            <Link href="/register" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--teal-dark)]">
              Get Started Free →
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
          <span className="text-gray-900">Comparisons</span>
        </nav>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          CA Foundation Comparisons & Guides
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Make informed decisions about your CA journey with in-depth comparisons of qualifications, preparation methods, syllabi, and study tools. Compare CA Foundation with other paths and find the best approach for your goals.
        </p>
      </section>

      {/* Comparisons Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {/* Group by Category */}
        {["Qualification Comparison", "Preparation Method", "Syllabus Guide", "Study Tools"].map((category) => {
          const categoryComparisons = comparisons.filter((c) => c.category === category);
          if (categoryComparisons.length === 0) return null;

          return (
            <div key={category} className="mb-16">
              {/* Category Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-[var(--primary)] rounded-full"></div>
                {category}
              </h2>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryComparisons.map((comparison) => (
                  <Link key={comparison.slug} href={`/compare/${comparison.slug}`}>
                    <div className="group border-2 border-gray-200 rounded-xl p-6 hover:border-[var(--primary)] hover:shadow-lg transition-all h-full">
                      {/* Category Badge */}
                      <div className="inline-block mb-3">
                        <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                          {category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors mb-3">
                        {comparison.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {comparison.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-[var(--primary)] font-medium group-hover:gap-3 transition-all">
                        <span>Read Comparison</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-[var(--sage-light)] to-white border-t border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Read Our Comparisons?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--primary)]">📊</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                In-Depth Analysis
              </h3>
              <p className="text-gray-600">
                Comprehensive comparisons with detailed pros and cons for each option to help you make the best choice.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-[var(--teal-dark)]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--teal-dark)]">✓</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Expert Guidance
              </h3>
              <p className="text-gray-600">
                Written by experienced educators with deep knowledge of CA Foundation and related qualifications.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-[var(--sage)]/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[var(--sage)]">💡</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Actionable Insights
              </h3>
              <p className="text-gray-600">
                Practical recommendations to help you choose the right path based on your goals and circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--teal-dark)] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Begin Your CA Foundation Preparation?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            After reviewing our comparisons, start your preparation journey on CA Saarthi with 2,500+ practice questions, 40 mock tests, and AI-powered study plans — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-white text-[var(--primary)] font-bold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Start Free Preparation →
              </button>
            </Link>
            <Link href="/papers">
              <button className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
                Explore Papers
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
                  CA
                </div>
                <span className="font-bold text-white">CA Saarthi</span>
              </div>
              <p className="text-sm text-gray-500">
                Free, AI-powered CA Foundation exam preparation platform with 2,500+ questions, 40 mock tests, and personalized study plans.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/papers" className="hover:text-white transition-colors">
                    Papers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Comparisons */}
            <div>
              <h3 className="font-semibold text-white mb-4">Comparisons</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/compare/ca-foundation-vs-cma-foundation" className="hover:text-white transition-colors">
                    CA vs CMA
                  </Link>
                </li>
                <li>
                  <Link href="/compare/ca-foundation-vs-cs-foundation" className="hover:text-white transition-colors">
                    CA vs CS
                  </Link>
                </li>
                <li>
                  <Link href="/compare/ca-foundation-self-study-vs-coaching" className="hover:text-white transition-colors">
                    Self-Study vs Coaching
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@casaarthi.in" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div>
              <h3 className="font-semibold text-white mb-4">Get Started</h3>
              <p className="text-sm text-gray-500 mb-4">
                Join thousands of CA aspirants preparing with CA Saarthi.
              </p>
              <Link href="/register">
                <button className="w-full bg-[var(--primary)] hover:bg-[var(--teal-dark)] text-white font-medium py-2 rounded-lg transition-colors">
                  Sign Up Free
                </button>
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                Copyright 2024 CA Saarthi. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-4 md:mt-0">
                Made with care for CA aspirants in India
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
