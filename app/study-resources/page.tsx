import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Brain,
  Zap,
  Download,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { getAllPapers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free CA Foundation Study Material & Resources 2026 | CA Saarthi",
  description:
    "Free CA Foundation study material, notes, practice questions, and exam guides. Access 2,500+ questions, paper-wise notes, and topic-wise resources without any signup cost.",
  keywords: [
    "CA Foundation free resources",
    "CA Foundation study material",
    "CA Foundation free notes",
    "CA Foundation PDF",
    "CA Foundation free practice questions",
    "CA Foundation study guide",
    "CA Foundation free prep",
    "CA Saarthi free resources",
  ],
  alternates: {
    canonical: "/study-resources",
  },
  openGraph: {
    title: "Free CA Foundation Study Material & Resources 2026 | CA Saarthi",
    description:
      "Complete free CA Foundation resources: 2,500+ practice questions, paper-wise study guides, topic notes, and exam preparation tools. 100% free access.",
    url: "https://www.casaarthi.in/study-resources",
    siteName: "CA Saarthi",
    type: "website",
  },
};

export default async function ResourcesPage() {
  const papers = await getAllPapers();

  const resourcesSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free CA Foundation Study Resources",
    description: "Free CA Foundation study material, notes, and practice questions",
    url: "https://www.casaarthi.in/study-resources",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-white to-[var(--background)]">
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resourcesSchema) }}
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
          <span className="text-gray-900">Free Resources</span>
        </nav>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Free CA Foundation Resources
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access comprehensive study materials, practice questions, and exam guides.
          Everything you need to prepare for CA Foundation — completely free.
        </p>
      </section>

      {/* Resource Sections */}
      <section className="max-w-6xl mx-auto px-4 pb-12 space-y-12">

        {/* 1. Paper-wise Study Notes */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-7 h-7 text-white" />
              <h2 className="text-2xl font-bold text-white">Paper-wise Study Notes</h2>
            </div>
            <p className="text-white/90">Comprehensive study guides for all 4 CA Foundation papers</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {papers.map((paper) => (
                <Link key={paper.id} href={`/papers/${paper.slug}`}>
                  <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--sage-light)] transition-all cursor-pointer">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{paper.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">Complete syllabus & topics</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/papers">
              <Button
                variant="outline"
                className="w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--sage-light)]"
              >
                View All Papers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Free Practice Questions */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-[var(--teal-dark)] to-[var(--primary)] px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-7 h-7 text-white" />
              <h2 className="text-2xl font-bold text-white">Free Practice Questions</h2>
            </div>
            <p className="text-white/90">2,500+ MCQ questions covering all topics & difficulty levels</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Questions", value: "2,500+" },
                { label: "Topics Covered", value: "400+" },
                { label: "Difficulty Levels", value: "3" },
                { label: "With Explanation", value: "100%" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-4 bg-[var(--sage-light)] rounded-lg">
                  <div className="text-2xl font-bold text-[var(--teal-dark)]">{stat.value}</div>
                  <div className="text-sm text-gray-700 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-700">
              Access thousands of carefully curated multiple-choice questions organized
              by topic, difficulty level, and paper. Each question includes detailed
              explanations to help you understand concepts thoroughly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/daily-quiz" className="flex-1">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] hover:from-[var(--teal-dark)] hover:to-[var(--primary)] text-white font-medium"
                >
                  Start Daily Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full font-medium"
                >
                  Unlock All Questions
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Blog & Current Affairs */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-7 h-7 text-white" />
              <h2 className="text-2xl font-bold text-white">Blog & Current Affairs</h2>
            </div>
            <p className="text-white/90">Expert guides and exam preparation strategies</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Preparation tips & strategies",
                "Topic-wise study guides",
                "Exam pattern insights",
                "Success stories from students",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[var(--teal-dark)] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-700">
              Explore our blog for comprehensive guides on exam preparation, topicwise
              study strategies, current affairs updates, and tips from CA aspirants
              who have successfully cleared the exam.
            </p>
            <Link href="/blog">
              <Button
                variant="outline"
                className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                Read Blog Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 4. Topic-wise Study Guides */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-7 h-7 text-white" />
              <h2 className="text-2xl font-bold text-white">Topic-wise Study Guides</h2>
            </div>
            <p className="text-white/90">Detailed explanations for 400+ CA Foundation topics</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <Download className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Comprehensive Topic Coverage
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Access detailed study guides for all major topics across all 4 papers.
                    Each guide includes key concepts, formulas, examples, and common pitfalls.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Paper 1: Accounting fundamentals & financial statements
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Paper 2: Business laws & contractual obligations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Paper 3: Quantitative aptitude & statistical analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Paper 4: Business economics & market concepts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <Link href="/papers">
              <Button
                variant="outline"
                className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                Explore 400+ Topics
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 5. Exam Preparation Tools */}
        <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-8">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-7 h-7 text-white" />
              <h2 className="text-2xl font-bold text-white">Exam Preparation Tools</h2>
            </div>
            <p className="text-white/90">Advanced features to track and improve your performance</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Brain,
                  title: "AI Doubt Solver",
                  desc: "Get instant answers to your CA Foundation doubts 24/7",
                },
                {
                  icon: Zap,
                  title: "Diagnostic Test",
                  desc: "Identify your strengths and weaknesses with adaptive testing",
                },
                {
                  icon: FileText,
                  title: "Mock Tests",
                  desc: "40+ full-length mock tests mimicking actual exam pattern",
                },
              ].map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border-2 border-green-200 bg-green-50"
                  >
                    <Icon className="w-6 h-6 text-green-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-700">{tool.desc}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-gray-700">
              CA Saarthi provides advanced tools to make your preparation more effective.
              From AI-powered doubt solving to comprehensive mock tests, we have everything
              you need for successful exam preparation.
            </p>
            <Link href="/register">
              <Button
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                Access All Tools Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="bg-[var(--sage-light)] border-y-2 border-[var(--sage)] py-12 my-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose CA Saarthi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle2, title: "100% Free", desc: "No hidden charges or premium features" },
              { icon: Zap, title: "Always Available", desc: "Access anytime, anywhere on any device" },
              { icon: Brain, title: "AI-Powered", desc: "Smart recommendations based on your progress" },
              { icon: BookOpen, title: "Comprehensive", desc: "All CA Foundation topics covered thoroughly" },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Icon className="w-6 h-6 text-[var(--teal-dark)]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-700">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--teal-dark)] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start your free CA Foundation journey today
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Get access to all 2,500+ practice questions, 40 mock tests, personalized
            study plans, and AI-powered doubt solving — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-[var(--primary)] hover:bg-gray-100 font-medium"
              >
                Sign Up Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/daily-quiz">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 font-medium"
              >
                Take Daily Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 mt-12">
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
                Free, AI-powered CA Foundation exam preparation platform with
                2,500+ questions, 40 mock tests, and personalized study plans.
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

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/daily-quiz" className="hover:text-white transition-colors">
                    Daily Quiz
                  </Link>
                </li>
                <li>
                  <Link href="/study-resources" className="hover:text-white transition-colors">
                    Free Resources
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog & Articles
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
                <Button
                  size="sm"
                  className="w-full bg-[var(--primary)] hover:bg-[var(--teal-dark)] text-white font-medium"
                >
                  Sign Up Free
                </Button>
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
