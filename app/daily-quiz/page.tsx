import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { createStaticClient } from "@/lib/supabase/static";
import QuizClient from "./quiz-client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Free CA Foundation Daily Quiz | CA Saarthi",
  description:
    "Take a free daily CA Foundation quiz with 5 random multiple-choice questions. No login required. Test your knowledge and improve with detailed explanations.",
  keywords: [
    "CA Foundation quiz",
    "daily quiz",
    "practice questions",
    "MCQ",
    "CA Foundation free quiz",
    "CA Saarthi",
  ],
  alternates: {
    canonical: "/daily-quiz",
  },
  openGraph: {
    title: "Free CA Foundation Daily Quiz | CA Saarthi",
    description: "Take a free daily CA Foundation quiz with detailed explanations. No signup required.",
    url: "https://www.casaarthi.in/daily-quiz",
    siteName: "CA Saarthi",
    type: "website",
  },
};

async function getRandomQuestions() {
  const supabase = createStaticClient();

  const { data: questions, error } = await supabase
    .from("questions")
    .select(
      "id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation"
    )
    .eq("status", "approved")
    .limit(100);

  if (error || !questions || questions.length === 0) {
    return [];
  }

  // Shuffle and select 5 random questions
  const shuffled = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return shuffled;
}

export default async function DailyQuizPage() {
  const questions = await getRandomQuestions();

  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "Daily CA Foundation Quiz",
    description: "Free daily CA Foundation quiz with 5 random multiple-choice questions",
    url: "https://www.casaarthi.in/daily-quiz",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-white to-[var(--background)]">
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
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
          <span className="text-gray-900">Daily Quiz</span>
        </nav>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Daily CA Foundation Quiz
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Test your knowledge with a free daily quiz. 5 random CA Foundation
          questions with instant feedback and detailed explanations. No login required.
        </p>
      </section>

      {/* Quiz Content */}
      <section className="max-w-2xl mx-auto px-4 pb-20">
        {questions.length > 0 ? (
          <QuizClient questions={questions} />
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center space-y-6">
            <div className="text-lg text-gray-700">
              <p className="mb-4">Unable to load quiz questions at the moment.</p>
              <p className="text-gray-600">
                Please try again later or explore other features on CA Saarthi.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/papers">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] hover:from-[var(--teal-dark)] hover:to-[var(--primary)] text-white font-medium"
                >
                  Explore Papers
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="font-medium">
                  Sign Up for Full Access
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="bg-[var(--sage-light)] border-t-2 border-[var(--sage)] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--teal-dark)] mb-2">
                No Login
              </div>
              <p className="text-gray-700">
                Take the quiz without signing up. No registration required.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--teal-dark)] mb-2">
                Instant Feedback
              </div>
              <p className="text-gray-700">
                Get immediate results with detailed explanations for each answer.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--teal-dark)] mb-2">
                Random Questions
              </div>
              <p className="text-gray-700">
                Different questions each day to help you practice diverse topics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--teal-dark)] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want more practice?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Sign up for free to access 2,500+ practice questions, 40 full-length
            mock tests, AI-powered study plans, and detailed performance tracking.
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
            <Link href="/papers">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 font-medium"
              >
                Explore Papers
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
                  <Link href="/resources" className="hover:text-white transition-colors">
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
