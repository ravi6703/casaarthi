import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Target,
  Brain,
  Zap,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "CA Foundation FAQ — 50+ Common Questions Answered | CA Saarthi",
  description:
    "Comprehensive FAQ on CA Foundation exam eligibility, registration, exam pattern, passing marks, preparation strategy, and more. Get answers to 50+ student questions about CA Foundation.",
  keywords: [
    "CA Foundation FAQ",
    "CA Foundation eligibility",
    "CA Foundation passing marks",
    "CA Foundation exam pattern",
    "CA Foundation registration",
    "CA Foundation fees",
    "CA Foundation preparation",
    "CA Foundation study tips",
    "CA Saarthi",
  ],
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title:
      "CA Foundation FAQ — 50+ Common Questions Answered | CA Saarthi",
    description:
      "Complete FAQ about CA Foundation exam: eligibility, registration, exam pattern, passing marks, preparation tips, and platform features.",
    url: "https://www.casaarthi.in/faq",
    siteName: "CA Saarthi",
    type: "website",
  },
};

const faqCategories = [
  {
    title: "About CA Foundation Exam",
    icon: Target,
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    questions: [
      {
        q: "What is the CA Foundation exam?",
        a: "The CA Foundation examination is conducted by the Institute of Chartered Accountants of India (ICAI) as the first stage towards becoming a Chartered Accountant. It's a 4-month intermediate course after Grade 12 (10+2) to assess fundamentals of accounting, business laws, quantitative aptitude, and economics.",
      },
      {
        q: "Who is eligible for CA Foundation?",
        a: "To be eligible for CA Foundation, you must have completed your 12th standard (10+2) or equivalent from any recognized board. There's no age limit for registration. You need to register with ICAI after completing your 12th.",
      },
      {
        q: "What is the CA Foundation registration process?",
        a: "You can register on the ICAI website (icai.org) after completing your 12th. You'll need to fill the online form, pay the registration fee (INR 1,500), and upload required documents. After registration, you become eligible to apply for the exam.",
      },
      {
        q: "How much is the CA Foundation exam registration fee?",
        a: "The exam registration fee for CA Foundation is INR 1,500. The course registration fee is INR 1,500 as well. In total, you'll spend INR 3,000 to register and appear for the exam.",
      },
      {
        q: "What is the CA Foundation exam pattern?",
        a: "CA Foundation exam consists of 4 papers: Paper 1 (Fundamentals of Accounting, 100 marks, 2 hours), Paper 2 (Business Laws, 100 marks, 2 hours), Paper 3 (Quantitative Aptitude & Statistics, 100 marks, 2 hours), and Paper 4 (Business Economics, 100 marks, 2 hours). All papers are conducted via MCQ-based objective tests.",
      },
      {
        q: "What are the passing marks for CA Foundation?",
        a: "You need to score a minimum of 40% marks in each paper (40 out of 100) and 50% aggregate across all 4 papers to pass CA Foundation. This means you need at least 200 marks out of 400 total marks.",
      },
      {
        q: "How many attempts are allowed for CA Foundation?",
        a: "There's no limit on the number of attempts for CA Foundation. You can appear in the exam as many times as you need until you pass all 4 papers. However, you must pass all 4 papers within a 4-year period from first registration.",
      },
      {
        q: "Can I appear for CA Foundation exams while studying for 12th?",
        a: "No, you must have completed your 12th standard before registering for CA Foundation. However, you can register immediately after finishing your 12th exams and appear in the CA Foundation exam in the same year.",
      },
      {
        q: "How many times per year is the CA Foundation exam conducted?",
        a: "CA Foundation exam is conducted twice a year: typically in May-June and November-December. You can choose which exam session to appear in based on your preparation.",
      },
      {
        q: "What is the duration of the CA Foundation course?",
        a: "After registration, you get a 4-month course duration before you can apply for the exam. This means if you register in January, you can appear for the exam from May onwards. The course period allows you to prepare adequately for the exams.",
      },
    ],
  },
  {
    title: "Preparation Strategy",
    icon: Brain,
    color: "bg-purple-50",
    borderColor: "border-purple-200",
    questions: [
      {
        q: "How should I start preparing for CA Foundation?",
        a: "Start by understanding the ICAI syllabus for all 4 papers. Read the official study materials, watch video tutorials, and take diagnostic tests to identify weak areas. Create a structured study plan covering all topics before taking practice tests.",
      },
      {
        q: "What is the best study plan for CA Foundation?",
        a: "A balanced approach works best: spend 2-3 weeks on theory for each paper, then 1-2 weeks on practice questions. Allocate more time to complex papers like Quantitative Aptitude. Dedicate the final 2-3 weeks before exams to full-length mock tests and revision.",
      },
      {
        q: "How many hours should I study daily for CA Foundation?",
        a: "Aim for 4-6 hours of focused study daily during your 4-month preparation period. This can be split into 2-3 sessions with breaks. Quality of study matters more than quantity—focused 4 hours beats distracted 8 hours.",
      },
      {
        q: "Should I join coaching classes for CA Foundation?",
        a: "Coaching classes can help, but they're not mandatory. Many students pass without coaching by using quality self-study materials, online resources like CA Saarthi, and practice questions. Choose coaching only if you feel you need personalized guidance.",
      },
      {
        q: "Which paper should I prepare first?",
        a: "Start with Accounting (Paper 1) as it forms the foundation for other papers. Then move to Business Laws (Paper 2), followed by Quantitative Aptitude (Paper 3), and finally Business Economics (Paper 4). This sequence helps you build concepts progressively.",
      },
      {
        q: "How much time should I spend on each paper?",
        a: "Allocate time based on difficulty: Accounting (25-30%), Business Laws (20-25%), Quantitative Aptitude (30-35%), and Business Economics (15-20%). Adjust based on your strengths and weaknesses.",
      },
      {
        q: "What's the importance of mock tests in CA Foundation preparation?",
        a: "Mock tests are crucial—they help you understand exam pattern, improve time management, identify weak areas, and build confidence. Take at least 10-15 full-length mock tests in the final month before exams.",
      },
      {
        q: "Can I prepare for CA Foundation in 3 months?",
        a: "It's challenging but possible if you're consistent and focused. You'll need 6-8 hours of daily study, prioritize important topics, and take frequent mock tests. However, 4-5 months is more realistic for thorough preparation.",
      },
      {
        q: "Should I make notes while studying for CA Foundation?",
        a: "Yes, making notes is helpful for retention and revision. However, don't spend too much time on note-making—focus on active learning. Create concise notes highlighting key points, formulas, and important definitions.",
      },
      {
        q: "How do I manage time during the CA Foundation exam?",
        a: "Divide time equally among questions: 30 minutes per paper per 25-30 questions. Skip difficult questions initially and return to them if time permits. Practice with mock tests to develop time management skills.",
      },
    ],
  },
  {
    title: "Paper 1: Fundamentals of Accounting",
    icon: FileText,
    color: "bg-green-50",
    borderColor: "border-green-200",
    questions: [
      {
        q: "What topics are covered in CA Foundation Paper 1 (Accounting)?",
        a: "Paper 1 covers: Accounting fundamentals, journal and ledger, trial balance, rectification of errors, bank reconciliation, depreciation, single entry bookkeeping, partnership accounts, and final accounts preparation.",
      },
      {
        q: "Is Paper 1 Accounting difficult for CA Foundation?",
        a: "Paper 1 is moderately difficult but logical. It requires understanding concepts rather than pure memorization. Most students find it manageable with consistent practice and clear understanding of journal entries and accounting principles.",
      },
      {
        q: "How should I prepare for Paper 1 accounting numericals?",
        a: "Practice is key—solve at least 50-100 different numerical problems from each topic. Understand the logic behind entries rather than memorizing solutions. Create a personal formula sheet for quick reference during revision.",
      },
      {
        q: "What are the most important topics in CA Foundation Accounting?",
        a: "Focus on: Journal entries and ledger posting, trial balance and errors, depreciation methods, bank reconciliation, and final accounts. These topics carry higher weightage and frequently appear in exams.",
      },
      {
        q: "How do I improve my speed in solving Accounting problems?",
        a: "Regular practice is the solution. Solve timed mock tests, maintain speed sheets tracking your time per problem, and learn shortcuts for common entries. Identify patterns in questions to solve faster.",
      },
    ],
  },
  {
    title: "Paper 2: Business Laws",
    icon: BookOpen,
    color: "bg-orange-50",
    borderColor: "border-orange-200",
    questions: [
      {
        q: "What topics are covered in CA Foundation Paper 2 (Business Laws)?",
        a: "Paper 2 covers: Indian Contract Act, Sale of Goods Act, Partnership Act, Limited Liability Partnership Act, and Consumer Protection Act. It includes concept-based and case-study questions.",
      },
      {
        q: "Is Business Laws difficult for CA Foundation?",
        a: "Business Laws is concept-heavy and requires careful reading of legal definitions. It's not inherently difficult but requires patience to understand each concept thoroughly. Regular revision helps in retention.",
      },
      {
        q: "How should I study Business Laws for CA Foundation?",
        a: "Read the legal definitions carefully from ICAI study materials. Make concept maps linking different acts and sections. Practice case-based questions as they frequently appear in exams. Create flashcards for important definitions.",
      },
      {
        q: "What are the most tested topics in CA Foundation Business Laws?",
        a: "Focus on: Offer and acceptance, conditions and warranties in sales, partnership liability, LLP formation and management, and consumer rights under Consumer Protection Act.",
      },
      {
        q: "How can I remember all the sections and definitions in Business Laws?",
        a: "Create acronyms and memory aids for related sections. Make flowcharts showing relationships between concepts. Use active recall and spaced repetition. Group related topics together for better retention.",
      },
    ],
  },
  {
    title: "Paper 3: Quantitative Aptitude & Statistics",
    icon: BarChart3,
    color: "bg-red-50",
    borderColor: "border-red-200",
    questions: [
      {
        q: "What topics are covered in CA Foundation Paper 3 (Quantitative Aptitude)?",
        a: "Paper 3 covers: Basic arithmetic, percentages, averages, ratios, simple and compound interest, time value of money, permutations & combinations, probability, statistical measures, correlation, and regression.",
      },
      {
        q: "Is Paper 3 (Quantitative Aptitude) the most difficult paper?",
        a: "Many students find it challenging due to its mathematical nature, but it's highly scoring if you practice consistently. The difficulty level is moderate—requires understanding concepts and regular practice rather than advanced mathematics.",
      },
      {
        q: "How should I prepare for Quantitative Aptitude numericals?",
        a: "Solve 100+ problems per topic to build confidence and speed. Understand the concept first, then practice variations. Use calculators efficiently. Focus on accuracy over speed initially, then improve speed gradually.",
      },
      {
        q: "What are the easiest topics in Paper 3?",
        a: "Percentages, averages, ratios, and simple interest are relatively easier with direct formulas. Permutations & combinations and probability require more practice. Start with easier topics to build confidence.",
      },
      {
        q: "How can I improve my calculations speed in Quantitative Aptitude?",
        a: "Practice mental math techniques, use approximation where possible, learn quick calculation tricks, and take regular timed practice tests. Speed comes naturally with repeated practice of similar problem types.",
      },
    ],
  },
  {
    title: "Paper 4: Business Economics",
    icon: Zap,
    color: "bg-pink-50",
    borderColor: "border-pink-200",
    questions: [
      {
        q: "What topics are covered in CA Foundation Paper 4 (Business Economics)?",
        a: "Paper 4 covers: Microeconomics (demand, supply, elasticity, cost analysis), macroeconomics (national income, inflation, exchange rates), and business economics applications. It's concept-based with minimal calculations.",
      },
      {
        q: "Is Paper 4 Business Economics easy to pass?",
        a: "Paper 4 is relatively easier compared to other papers as it requires understanding concepts rather than complex calculations or memorization. However, you need clear conceptual clarity to answer application-based questions.",
      },
      {
        q: "How should I prepare for Business Economics?",
        a: "Focus on understanding concepts through diagrams and graphs. Learn definitions precisely. Practice application-based questions that connect economics to real-world business scenarios.",
      },
      {
        q: "What are the most important topics in Business Economics?",
        a: "Key topics: Demand and supply curves, elasticity concepts, production and cost curves, national income calculation, inflation, and foreign exchange. These carry higher weightage in exams.",
      },
      {
        q: "Can I pass Paper 4 with just conceptual understanding?",
        a: "Yes, conceptual understanding is paramount for Paper 4. Unlike other papers, rote memorization won't help much. Focus on understanding the 'why' behind concepts and their practical applications.",
      },
    ],
  },
  {
    title: "About CA Saarthi Platform",
    icon: HelpCircle,
    color: "bg-teal-50",
    borderColor: "border-teal-200",
    questions: [
      {
        q: "Is CA Saarthi really completely free?",
        a: "Yes, 100% free! All features including 2,500+ practice questions, 40 mock tests, AI-powered study plans, progress tracking, and AI doubt solver are completely free with no hidden charges.",
      },
      {
        q: "How many practice questions are available on CA Saarthi?",
        a: "CA Saarthi offers 2,500+ practice questions covering all 4 papers of CA Foundation. Questions are organized by topics and papers with detailed explanations for each answer.",
      },
      {
        q: "What is the diagnostic test on CA Saarthi?",
        a: "The diagnostic test is an adaptive assessment that evaluates your preparation level across all CA Foundation topics. It takes 30-40 minutes and provides detailed insights into your strengths and weaknesses.",
      },
      {
        q: "How many mock tests does CA Saarthi provide?",
        a: "CA Saarthi offers 40 full-length mock tests mirroring the actual exam pattern. You can take mock tests by paper or attempt full 4-paper mock exams. Each mock provides detailed performance analytics.",
      },
      {
        q: "Can I use CA Saarthi on my mobile phone?",
        a: "Yes! CA Saarthi works perfectly on all devices—desktop, tablet, and mobile. The platform is fully responsive. You can even add it to your home screen for app-like experience.",
      },
      {
        q: "Does CA Saarthi provide study materials?",
        a: "CA Saarthi focuses on practice-based learning. For theory, we recommend ICAI study materials. Our platform complements your studies with organized questions, explanations, and performance tracking.",
      },
      {
        q: "Can the AI doubt solver help me understand concepts?",
        a: "Yes! The AI doubt solver can answer concept-based questions, explain topics, solve worked examples, and provide clarifications. It's available 24/7 to help you whenever you're stuck.",
      },
      {
        q: "How does the AI study plan work?",
        a: "Based on your performance on diagnostic test and practice questions, CA Saarthi creates a personalized study plan recommending which topics to focus on, how much time to allocate, and when to take mock tests.",
      },
      {
        q: "Can I track my progress on CA Saarthi?",
        a: "Yes, you can track your performance across all topics, papers, and mock tests. Detailed analytics show your accuracy, speed, improvement areas, and performance trends over time.",
      },
      {
        q: "Do I need to create an account to use CA Saarthi?",
        a: "Yes, you need to create a free account to access all features. Registration takes less than a minute with just your email or phone number. You can start practicing immediately after registration.",
      },
    ],
  },
];

export default function FAQPage() {
  const allQuestions = faqCategories.flatMap((cat) =>
    cat.questions.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.a,
      },
    }))
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-white to-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
          <span className="text-gray-900">FAQ</span>
        </nav>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
          CA Foundation FAQ
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get answers to 50+ commonly asked questions about CA Foundation exam,
          preparation strategy, papers, and CA Saarthi platform.
        </p>
      </section>

      {/* FAQ Categories */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {faqCategories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <div key={idx} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 text-[var(--teal-dark)]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {category.title}
                </h2>
              </div>

              {/* FAQ Items */}
              <div
                className={`space-y-3 rounded-xl border-2 ${category.borderColor} p-6 bg-white`}
              >
                {category.questions.map((item, qIdx) => (
                  <details
                    key={qIdx}
                    className="group border border-gray-200 rounded-lg hover:border-[var(--primary)] transition-colors"
                  >
                    <summary className="flex items-start gap-4 p-4 cursor-pointer select-none hover:bg-gray-50 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-[var(--sage)] flex-shrink-0 mt-0.5" />
                      <span className="text-base font-semibold text-gray-900 text-left group-open:text-[var(--primary)]">
                        {item.q}
                      </span>
                      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 pt-2 text-gray-700 border-t border-gray-100 bg-gray-50">
                      <p className="leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] py-12 mb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-sm md:text-base text-white/90">
                FAQ Questions
              </div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">2,500+</div>
              <div className="text-sm md:text-base text-white/90">
                Practice Questions
              </div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">40</div>
              <div className="text-sm md:text-base text-white/90">
                Mock Tests
              </div>
            </div>
            <div className="text-white">
              <div className="text-3xl md:text-4xl font-bold mb-2">100%</div>
              <div className="text-sm md:text-base text-white/90">Free Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-[var(--sage-light)] to-[var(--background)] rounded-2xl border-2 border-[var(--sage)] p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to start your CA Foundation journey?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Access 2,500+ practice questions, 40 full-length mock tests, AI-powered
            study plans, and personalized performance tracking — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[var(--primary)] to-[var(--teal-dark)] hover:from-[var(--teal-dark)] hover:to-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25 font-medium"
              >
                Start Preparing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/papers">
              <Button
                size="lg"
                variant="outline"
                className="font-medium"
              >
                Explore Papers
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
                <span className="font-bold text-white">CA Saarthi</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">
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

            {/* About */}
            <div>
              <h3 className="font-semibold text-white mb-4">About</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Career
                  </a>
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
