import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

const SITE_URL = "https://www.casaarthi.in";

interface PaperData {
  name: string;
  paperNumber: number;
  slug: string;
  description: string;
  marks: number;
  duration: string;
  questionType: string;
  totalQuestions: number;
  negativeMarking: string;
  passingMarks: number;
  topics: { title: string; subtopics: string[] }[];
}

const PAPERS: Record<string, PaperData> = {
  accounting: {
    name: "Principles and Practice of Accounting",
    paperNumber: 1,
    slug: "accounting",
    description:
      "Paper 1 covers the fundamentals of accounting including journal entries, ledger posting, trial balance, final accounts, depreciation, inventories, bills of exchange, partnership accounts, and company accounts. This paper tests your understanding of core accounting principles as prescribed by ICAI.",
    marks: 100,
    duration: "3 hours",
    questionType: "Subjective (Descriptive)",
    totalQuestions: 6,
    negativeMarking: "No",
    passingMarks: 40,
    topics: [
      {
        title: "Theoretical Framework",
        subtopics: [
          "Meaning and scope of Accounting",
          "Accounting concepts, principles, and conventions",
          "Accounting standards and IFRS (overview)",
          "Capital and revenue expenditure & receipts",
          "Contingent assets and liabilities",
          "Accounting policies",
        ],
      },
      {
        title: "Accounting Process",
        subtopics: [
          "Books of original entry (Journal, Cash Book, Subsidiary Books)",
          "Ledger posting and preparation of Trial Balance",
          "Rectification of errors",
          "Bank Reconciliation Statement",
          "Inventories",
          "Concept and types of depreciation",
          "Depreciation accounting methods",
        ],
      },
      {
        title: "Final Accounts",
        subtopics: [
          "Preparation of Trading Account",
          "Profit & Loss Account and Balance Sheet of sole proprietor",
          "Manufacturing Account",
          "Adjustment entries in final accounts",
        ],
      },
      {
        title: "Bills of Exchange",
        subtopics: [
          "Drawing, acceptance, endorsement, and discounting of bills",
          "Retiring of bills and renewal of bills",
          "Accommodation bills",
          "Insolvency of acceptor",
        ],
      },
      {
        title: "Partnership Accounts",
        subtopics: [
          "Final accounts of partnership firms",
          "Fixed and fluctuating capital methods",
          "Admission, retirement, and death of a partner",
          "Goodwill — nature and valuation",
          "Dissolution of partnership firm",
          "Garner vs. Murray rule",
          "Piecemeal distribution",
        ],
      },
      {
        title: "Company Accounts",
        subtopics: [
          "Issue, forfeiture, and re-issue of shares",
          "Issue and redemption of debentures",
          "Preparation of final accounts of companies (as per Schedule III)",
        ],
      },
      {
        title: "Special Areas",
        subtopics: [
          "Accounting for Not-for-Profit Organisations",
          "Introduction to financial statements of a company",
          "Consignment and Joint Venture accounts",
        ],
      },
    ],
  },
  "business-laws": {
    name: "Business Laws and Business Correspondence and Reporting",
    paperNumber: 2,
    slug: "business-laws",
    description:
      "Paper 2 is divided into two sections. Section A covers Business Laws including the Indian Contract Act, Sale of Goods Act, Indian Partnership Act, LLP Act, and an introduction to Company Law. Section B focuses on Business Correspondence and Reporting, testing communication skills essential for professional practice.",
    marks: 100,
    duration: "3 hours",
    questionType: "Subjective (Descriptive)",
    totalQuestions: 6,
    negativeMarking: "No",
    passingMarks: 40,
    topics: [
      {
        title: "Indian Contract Act, 1872",
        subtopics: [
          "Nature of contract, offer and acceptance",
          "Void and voidable agreements",
          "Consideration and capacity of parties",
          "Free consent — coercion, undue influence, fraud, misrepresentation, mistake",
          "Legality of object and consideration",
          "Contingent contracts and quasi contracts",
          "Performance and discharge of contracts",
          "Breach and remedies for breach of contract",
          "Indemnity and guarantee",
          "Bailment and pledge",
          "Agency",
        ],
      },
      {
        title: "Sale of Goods Act, 1930",
        subtopics: [
          "Formation of contract of sale",
          "Conditions and warranties",
          "Transfer of property and title",
          "Performance of the contract of sale",
          "Rights of an unpaid seller",
          "Auction sales",
        ],
      },
      {
        title: "Indian Partnership Act, 1932",
        subtopics: [
          "Nature and definition of partnership",
          "Registration and its effects",
          "Rights, duties, and liabilities of partners",
          "Implied authority of partners",
          "Reconstitution and dissolution of a firm",
        ],
      },
      {
        title: "Limited Liability Partnership Act, 2008",
        subtopics: [
          "Introduction to LLP — salient features",
          "Differences between LLP and partnership/company",
        ],
      },
      {
        title: "Introduction to Company Law",
        subtopics: [
          "Meaning and features of a company",
          "Types of companies",
          "Lifting of corporate veil",
          "Memorandum and articles of association",
        ],
      },
      {
        title: "Business Correspondence",
        subtopics: [
          "Parts and kinds of business letters",
          "Official and demi-official correspondence",
          "E-mail, memos, and circulars",
          "Job application and resume writing",
        ],
      },
      {
        title: "Business Reporting",
        subtopics: [
          "Comprehension passages",
          "Precis writing and note making",
          "Article and report writing",
          "Communication — meaning, process, barriers, and types",
          "Sentence improvement and vocabulary building",
        ],
      },
    ],
  },
  "quantitative-aptitude": {
    name: "Business Mathematics and Logical Reasoning & Statistics",
    paperNumber: 3,
    slug: "quantitative-aptitude",
    description:
      "Paper 3 is divided into two parts. Part A covers Business Mathematics and Logical Reasoning — ratio, proportion, indices, logarithms, equations, sets, sequences, permutations, and logical reasoning. Part B covers Statistics including descriptive statistics, probability, and theoretical distributions.",
    marks: 100,
    duration: "3 hours",
    questionType: "Objective (MCQ)",
    totalQuestions: 100,
    negativeMarking: "Yes (0.25 marks per wrong answer)",
    passingMarks: 40,
    topics: [
      {
        title: "Ratio, Proportion & Indices",
        subtopics: [
          "Ratio and proportion — properties and types",
          "Laws of indices and surds",
          "Logarithms — laws, characteristic, and mantissa",
        ],
      },
      {
        title: "Equations & Matrices",
        subtopics: [
          "Linear simultaneous equations (up to 3 variables)",
          "Quadratic equations",
          "Inequalities (linear and quadratic)",
          "Matrices — types, operations, determinants, inverse",
        ],
      },
      {
        title: "Sets, Relations & Functions",
        subtopics: [
          "Set theory — types, operations, Venn diagrams",
          "Relations and functions — domain, range, types",
          "Basics of limits and continuity (introductory)",
        ],
      },
      {
        title: "Sequences & Series",
        subtopics: [
          "Arithmetic progression (AP)",
          "Geometric progression (GP)",
          "Applications of AP and GP in business (simple & compound interest, annuity)",
        ],
      },
      {
        title: "Permutations & Combinations",
        subtopics: [
          "Fundamental principle of counting",
          "Factorial notation",
          "Permutations — without and with repetition, circular permutation",
          "Combinations — properties and applications",
        ],
      },
      {
        title: "Logical Reasoning",
        subtopics: [
          "Number series, coding and decoding",
          "Direction sense and seating arrangements",
          "Blood relations",
          "Syllogisms and logical connectives",
          "Clocks, calendars, and analogies",
        ],
      },
      {
        title: "Descriptive Statistics",
        subtopics: [
          "Measures of central tendency — Mean, Median, Mode",
          "Measures of dispersion — Range, Quartile deviation, Mean deviation, Standard deviation",
          "Correlation — Karl Pearson, Spearman rank",
          "Regression analysis — lines and equations",
          "Index numbers — construction and use",
        ],
      },
      {
        title: "Probability & Distributions",
        subtopics: [
          "Probability — classical, statistical, axiomatic definitions",
          "Addition and multiplication theorems, conditional probability",
          "Bayes' theorem",
          "Theoretical distributions — Binomial, Poisson, Normal (basic concepts)",
          "Expected value and variance",
        ],
      },
    ],
  },
  "business-economics": {
    name: "Business Economics and Business and Commercial Knowledge",
    paperNumber: 4,
    slug: "business-economics",
    description:
      "Paper 4 is divided into two parts. Part A covers Business Economics — demand and supply, production, cost, market forms, price determination, business cycles, and an introduction to macroeconomics. Part B covers Business and Commercial Knowledge including business environment, government policies, and organisations.",
    marks: 100,
    duration: "3 hours",
    questionType: "Objective (MCQ)",
    totalQuestions: 100,
    negativeMarking: "Yes (0.25 marks per wrong answer)",
    passingMarks: 40,
    topics: [
      {
        title: "Introduction to Business Economics",
        subtopics: [
          "Meaning, scope, and significance of Business Economics",
          "Basic economic problems and economic systems",
          "Micro vs. Macro economics",
        ],
      },
      {
        title: "Theory of Demand and Supply",
        subtopics: [
          "Demand — meaning, determinants, law of demand",
          "Elasticity of demand — price, income, cross",
          "Supply — law of supply and elasticity of supply",
          "Market equilibrium and price determination",
          "Consumer surplus and producer surplus",
        ],
      },
      {
        title: "Theory of Production and Cost",
        subtopics: [
          "Production function — short run and long run",
          "Law of variable proportions and returns to scale",
          "Economies and diseconomies of scale",
          "Cost concepts — short-run and long-run cost curves",
          "Revenue — total, average, and marginal revenue",
        ],
      },
      {
        title: "Price Determination in Different Markets",
        subtopics: [
          "Perfect competition — features, price and output determination",
          "Monopoly — features, price discrimination",
          "Monopolistic competition — product differentiation",
          "Oligopoly — kinked demand curve, cartels, price leadership",
        ],
      },
      {
        title: "Business Cycles",
        subtopics: [
          "Meaning, phases, and features of business cycles",
          "Theories of business cycles",
          "Measures to control business fluctuations",
        ],
      },
      {
        title: "Introduction to Macroeconomics",
        subtopics: [
          "National income — concepts and measurement methods",
          "Determination of national income — Keynesian theory",
          "Fiscal and monetary policy (introductory)",
          "Money — meaning, functions, and money supply",
          "Inflation and deflation",
        ],
      },
      {
        title: "Indian Economy & Government Policy",
        subtopics: [
          "Overview of Indian economy and key sectors",
          "Economic reforms and liberalisation",
          "FDI and international trade",
          "Role of SEBI, RBI, NITI Aayog",
          "GST and taxation framework overview",
        ],
      },
      {
        title: "Business & Commercial Knowledge",
        subtopics: [
          "Business environment — meaning and elements",
          "Forms of business organisation",
          "Business — meaning, objectives, functions",
          "Common business terminologies",
          "Banking, insurance, and financial markets (basic concepts)",
          "E-commerce and digital economy overview",
        ],
      },
    ],
  },
};

const PAPER_SLUGS = Object.keys(PAPERS);

export function generateStaticParams() {
  return PAPER_SLUGS.map((slug) => ({ paper: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ paper: string }>;
}): Promise<Metadata> {
  const { paper: slug } = await params;
  const paper = PAPERS[slug];
  if (!paper) return {};

  const title = `CA Foundation Paper ${paper.paperNumber}: ${paper.name} — Syllabus, Exam Pattern & Free Practice`;
  const description = `Complete guide to CA Foundation Paper ${paper.paperNumber} (${paper.name}). Detailed ICAI syllabus topics, exam pattern, marks distribution, question types, and free practice questions on CA Saarthi.`;

  return {
    title,
    description,
    keywords: [
      `CA Foundation Paper ${paper.paperNumber}`,
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
  const paper = PAPERS[slug];
  if (!paper) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `CA Foundation Paper ${paper.paperNumber}: ${paper.name}`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
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
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/papers"
            className="hover:text-blue-600 transition-colors"
          >
            Papers
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Paper {paper.paperNumber}</span>
        </nav>
      </div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm text-blue-700 mb-6">
          Paper {paper.paperNumber} of 4
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
              { label: "Total Marks", value: `${paper.marks}` },
              { label: "Duration", value: paper.duration },
              { label: "Question Type", value: paper.questionType },
              {
                label: paper.questionType.includes("MCQ")
                  ? "Total MCQs"
                  : "Total Questions",
                value: `${paper.totalQuestions}`,
              },
              { label: "Negative Marking", value: paper.negativeMarking },
              { label: "Passing Marks", value: `${paper.passingMarks}%` },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-blue-600 mb-1">
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
          {paper.topics.map((topic, i) => (
            <div
              key={topic.title}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="font-bold text-gray-900 text-lg">
                  {topic.title}
                </h3>
              </div>
              <ul className="space-y-2 ml-11">
                {topic.subtopics.map((sub) => (
                  <li
                    key={sub}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="text-blue-400 mt-1 flex-shrink-0">
                      &bull;
                    </span>
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start preparing for Paper {paper.paperNumber} today
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get access to{" "}
            2,500+ practice
            questions, 10 full-length mock tests, and a personalised study plan
            — completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 bg-white text-blue-600 hover:bg-blue-50"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/papers">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 border-white text-white hover:bg-blue-700"
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
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
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
