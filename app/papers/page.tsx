import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllPapers } from "@/lib/data";

export const metadata: Metadata = {
  title: "CA Foundation Papers — Complete Syllabus & Exam Pattern Guide",
  description:
    "Explore all 4 CA Foundation papers: Accounting, Business Laws, Quantitative Aptitude & Statistics, and Business Economics. Detailed ICAI syllabus, exam pattern, and free practice on CA Saarthi.",
  keywords: [
    "CA Foundation papers",
    "CA Foundation syllabus",
    "CA Foundation exam pattern",
    "CA Foundation subjects",
    "ICAI CA Foundation",
    "CA Foundation 2026",
    "CA Saarthi",
  ],
  alternates: {
    canonical: "/papers",
  },
  openGraph: {
    title: "CA Foundation Papers — Complete Syllabus & Exam Pattern Guide",
    description:
      "All 4 CA Foundation papers explained with detailed syllabus topics, marks distribution, and free practice resources.",
    url: "https://www.casaarthi.in/papers",
    siteName: "CA Saarthi",
    type: "website",
  },
};

export default async function PapersIndexPage() {
  const papers = await getAllPapers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-white to-[var(--background)]">
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
          <span className="text-gray-900">Papers</span>
        </nav>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          CA Foundation Papers
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          The CA Foundation exam consists of 4 papers. Explore the complete ICAI
          syllabus, exam pattern, and start practicing for free on CA Saarthi.
        </p>
      </section>

      {/* Paper Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {papers.map((paper) => (
            <Link
              key={paper.slug}
              href={`/papers/${paper.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg hover:border-[var(--border)] transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--sage-light)] text-[var(--teal-dark)] flex items-center justify-center text-lg font-bold">
                  {paper.sort_order}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[var(--primary)] transition-colors">
                    Paper {paper.sort_order}: {paper.short_name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-3">{paper.name}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    {paper.description}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {paper.total_marks} marks
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {paper.duration_minutes} min
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {paper.question_type}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--primary)] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start preparing?
          </h2>
          <p className="text-white text-opacity-90 mb-8 text-lg">
            Access 2,500+ practice questions, 40 mock tests, and AI-powered
            study plans across all 4 papers — completely free.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="px-8 bg-white text-[var(--primary)] hover:bg-[var(--sage-light)]"
            >
              Get Started Free
            </Button>
          </Link>
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
