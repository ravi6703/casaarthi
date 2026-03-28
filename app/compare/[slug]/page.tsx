import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Hardcoded comparison data
const comparisons: Record<string, any> = {
  "ca-foundation-vs-cma-foundation": {
    title: "CA Foundation vs CMA Foundation: Which Path is Right for You?",
    description:
      "Compare CA and CMA Foundation courses to understand key differences in eligibility, syllabus, career prospects, and choose the right path for your accounting career.",
    keywords: [
      "CA Foundation vs CMA",
      "CA vs CMA comparison",
      "CMA Foundation course",
      "accounting qualifications",
      "CA Saarthi",
    ],
    slug: "ca-foundation-vs-cma-foundation",
    breadcrumb: "CA vs CMA Foundation",
    faqs: [
      {
        q: "What is the main difference between CA and CMA Foundation?",
        a: "CA Foundation is conducted by ICAI (Institute of Chartered Accountants of India) and covers accounting, business laws, quantitative aptitude, and economics. CMA Foundation is conducted by ICMAI (Institute of Cost Accountants of India) and focuses on cost management, accounting, business laws, and quantitative aptitude. CMA emphasizes cost accounting and management accounting more heavily.",
      },
      {
        q: "Which qualification has better career prospects in India?",
        a: "Both CA and CMA have excellent career prospects. CA is more widely recognized internationally and leads to roles in auditing, taxation, and financial advisory. CMA is preferred in manufacturing, cost management, and internal audit roles. The choice depends on your career interests.",
      },
      {
        q: "Is CA Foundation more difficult than CMA Foundation?",
        a: "Both are moderately difficult and require consistent preparation. CA Foundation covers broader topics including business laws and economics, while CMA Foundation emphasizes cost accounting. The difficulty level is comparable; it depends more on your strengths in different subjects.",
      },
      {
        q: "Can I switch from CA to CMA or vice versa?",
        a: "Yes, many students pursue both qualifications. However, you should decide your primary path initially as they require different focus areas. Some students complete CA Foundation first, then pursue CMA as well for broader career opportunities. Check ICAI and ICMAI regulations for any exemptions.",
      },
    ],
    comparison: [
      {
        criteria: "Eligibility",
        ca: "12th pass (10+2) or equivalent from any recognized board. No age limit.",
        cma: "12th pass (10+2) or equivalent. No age limit. Must be Indian citizen.",
      },
      {
        criteria: "Registration Fee",
        ca: "INR 1,500",
        cma: "INR 800-1,200 (varies by year)",
      },
      {
        criteria: "Exam Fee",
        ca: "INR 1,500",
        cma: "INR 1,000-1,500 (varies by year)",
      },
      {
        criteria: "Course Duration",
        ca: "4 months mandatory course before exam",
        cma: "4 months mandatory course before exam",
      },
      {
        criteria: "Exam Pattern",
        ca: "4 papers, 100 marks each, 2 hours per paper (objective type)",
        cma: "4 papers, 100 marks each, 2 hours per paper (objective type)",
      },
      {
        criteria: "Number of Papers",
        ca: "Fundamentals of Accounting, Business Laws, Quantitative Aptitude, Business Economics",
        cma: "Fundamentals of Accounting & Finance, Business Laws, Cost Accounting, Quantitative Aptitude & Economics",
      },
      {
        criteria: "Passing Criteria",
        ca: "40% in each paper, 50% aggregate",
        cma: "40% in each paper, 50% aggregate",
      },
      {
        criteria: "Intermediate Level",
        ca: "8 months course with 2 examination groups (4 papers each)",
        cma: "8 months course with 2 examination groups (4 papers each)",
      },
      {
        criteria: "Final Level",
        ca: "8 months course, 2 examination groups, then articleship",
        cma: "8 months course, 2 examination groups (no articleship)",
      },
      {
        criteria: "Total Duration",
        ca: "5-6 years approximately (including intermediate and articleship)",
        cma: "4-5 years approximately (no articleship requirement)",
      },
    ],
    prosCA: [
      "Globally recognized qualification with international scope",
      "Higher earning potential in auditing, taxation, and finance",
      "Better opportunities in large corporate firms and multinational companies",
      "Mandatory articleship provides real-world experience",
      "Can practice as a Chartered Accountant independently",
      "Prestigious qualification with strong brand value",
    ],
    consCA: [
      "Longer duration including articleship commitment",
      "Articleship is mandatory - 5 years of articles after intermediate",
      "More comprehensive and challenging curriculum",
      "Requires high consistency and dedication for 5-6 years",
    ],
    prosCMA: [
      "Slightly shorter overall duration without mandatory articleship",
      "Lower fees and registration costs",
      "Excellent for roles in cost management and manufacturing",
      "Strong emphasis on practical cost accounting",
      "Good for pursuing corporate finance roles",
    ],
    consCMA: [
      "Less internationally recognized than CA",
      "Limited scope compared to CA in certain sectors",
      "Fewer opportunities in audit and taxation domains",
      "Not ideal for independent practice like CA",
    ],
    verdict:
      "Choose CA Foundation if you want a globally recognized qualification, plan to work in audit/taxation/finance domains, and are willing to commit to 5-6 years. Choose CMA Foundation if you're interested in cost management, manufacturing sector roles, and prefer a shorter path. CA is the better choice if you want maximum career flexibility and international recognition.",
  },
  "ca-foundation-vs-cs-foundation": {
    title: "CA Foundation vs CS Foundation: Which Qualification Should You Choose?",
    description:
      "Compare CA and CS Foundation courses to understand differences in career paths, syllabus, exam difficulty, and salary potential. Make the right choice for your career.",
    keywords: [
      "CA Foundation vs CS",
      "CA vs Company Secretary comparison",
      "CS Foundation course",
      "accounting vs company secretary",
      "CA Saarthi",
    ],
    slug: "ca-foundation-vs-cs-foundation",
    breadcrumb: "CA vs CS Foundation",
    faqs: [
      {
        q: "What is the main difference between CA and CS qualifications?",
        a: "CA (Chartered Accountant) focuses on accounting, finance, audit, and taxation. CS (Company Secretary) focuses on corporate governance, company law, compliance, and secretarial management. CA deals with financial aspects while CS deals with legal and governance aspects of companies.",
      },
      {
        q: "Which qualification has higher salary potential?",
        a: "Both have good salary potential. CAs typically earn more in audit, taxation, and finance roles with average starting salaries of INR 6-12 lakhs. CSs earn well in corporate governance and compliance roles with starting salaries of INR 5-10 lakhs. Top performers in both fields earn significantly higher.",
      },
      {
        q: "Is CS Foundation easier than CA Foundation?",
        a: "CS Foundation is generally considered slightly easier than CA Foundation as it has less quantitative content. However, both require consistent preparation. CS requires more law-based memorization while CA requires concept-based understanding.",
      },
      {
        q: "Can I pursue both CA and CS simultaneously?",
        a: "Yes, many students pursue both qualifications. However, they are time-intensive. It's better to complete CA/CS initially, gain experience, and then pursue the second qualification if needed. Some companies encourage dual qualifications.",
      },
    ],
    comparison: [
      {
        criteria: "Eligibility",
        ca: "12th pass or equivalent from recognized board",
        cs: "12th pass or equivalent from recognized board",
      },
      {
        criteria: "Governing Body",
        ca: "ICAI (Institute of Chartered Accountants of India)",
        cs: "ICSI (Institute of Company Secretaries of India)",
      },
      {
        criteria: "Registration Fee",
        ca: "INR 1,500",
        cs: "INR 1,500",
      },
      {
        criteria: "Foundation Course Duration",
        ca: "4 months mandatory before exam",
        cs: "4 months mandatory before exam",
      },
      {
        criteria: "Exam Pattern",
        ca: "4 papers × 100 marks, 2 hours each (MCQ objective)",
        cs: "4 papers × 100 marks, 1 hour each (MCQ objective)",
      },
      {
        criteria: "Foundation Papers",
        ca: "Accounting, Business Laws, Quantitative Aptitude, Economics",
        cs: "Fundamentals of Business & Management, Legal System & Constitutional Foundation, Business Organization & Management, Business Correspondence & Reporting",
      },
      {
        criteria: "Passing Criteria",
        ca: "40% each paper, 50% aggregate",
        cs: "40% each paper, 50% aggregate",
      },
      {
        criteria: "Intermediate Level",
        ca: "2 groups of 4 papers each, 8 months course",
        cs: "2 groups of 4 papers each, 8 months course",
      },
      {
        criteria: "Final Level",
        ca: "2 groups of 4 papers each, 8 months course + articleship",
        cs: "2 groups of 4 papers each, 8 months course (no articles)",
      },
      {
        criteria: "Total Duration",
        ca: "5-6 years including articleship",
        cs: "4-5 years (no mandatory internship)",
      },
      {
        criteria: "Work Experience Requirement",
        ca: "5 years articleship mandatory",
        cs: "1 year internship (practical training), optional further experience",
      },
    ],
    prosCA: [
      "Globally recognized and more prestigious qualification",
      "Broader career opportunities in finance, audit, taxation, and advisory",
      "Higher average salary in top firms",
      "Can work independently as Chartered Accountant",
      "Strong demand in corporate and professional firms",
    ],
    consCA: [
      "Longer duration with mandatory articleship",
      "More difficult quantitative content",
      "Requires 5-6 years commitment",
      "Articleship can be unpaid or low-paid initially",
    ],
    prosCS: [
      "Shorter duration without mandatory articleship",
      "Less quantitative (easier for commerce students with law preference)",
      "Strong focus on corporate governance and compliance",
      "Good for corporate secretarial roles and board-level positions",
      "Good scope in compliance and regulatory roles",
    ],
    consCCS: [
      "Less internationally recognized than CA",
      "Limited opportunities in accounting and taxation",
      "Narrower career scope compared to CA",
      "Lower average salary compared to CA",
    ],
    verdict:
      "Choose CA if you want a globally recognized qualification with broader career options and higher earning potential in finance/audit/taxation roles. Choose CS if you prefer corporate governance, legal compliance, and secretarial management, and want a shorter path to qualification. CA offers more versatility and career options for most students.",
  },
  "ca-foundation-self-study-vs-coaching": {
    title: "CA Foundation: Self-Study vs Coaching - Which Method is Best for You?",
    description:
      "Compare self-study and coaching approaches for CA Foundation. Analyze pros, cons, cost-benefit analysis, and get guidance on choosing the best preparation method for your success.",
    keywords: [
      "CA Foundation self-study",
      "CA Foundation coaching",
      "self-study vs coaching",
      "CA Foundation preparation methods",
      "best way to prepare for CA",
      "CA Saarthi",
    ],
    slug: "ca-foundation-self-study-vs-coaching",
    breadcrumb: "Self-Study vs Coaching",
    faqs: [
      {
        q: "Can I pass CA Foundation without coaching by self-study?",
        a: "Yes, absolutely! Many students pass CA Foundation through self-study using quality online resources, ICAI materials, and practice questions. Success depends on consistency, discipline, and access to good study materials rather than coaching.",
      },
      {
        q: "What are the advantages of coaching for CA Foundation?",
        a: "Coaching provides structured learning, experienced teachers, clarification of doubts in real-time, motivation, peer learning environment, and ready-made study plans. For students who need guidance and interactive learning, coaching can be very helpful.",
      },
      {
        q: "How much does CA Foundation coaching cost?",
        a: "CA Foundation coaching ranges from INR 20,000 to 1,50,000 depending on the institute quality and location. Online coaching is typically cheaper (INR 15,000-50,000) than classroom coaching. Self-study is much cheaper - primarily the cost of books and online resources (INR 2,000-10,000).",
      },
      {
        q: "How much time should I study daily in self-study mode?",
        a: "In self-study mode, aim for 4-6 hours of focused daily study for 4 months. Quality is more important than quantity. With consistent 4 hours of quality study, you can pass CA Foundation. Create a structured schedule and take regular mock tests.",
      },
    ],
    comparison: [
      {
        criteria: "Cost",
        ca: "INR 2,000-10,000 (books + online resources)",
        cs: "INR 20,000-1,50,000 (varies by institute location)",
      },
      {
        criteria: "Learning Pace",
        ca: "Self-paced, can go faster or slower as needed",
        cs: "Fixed pace set by coaching institute schedule",
      },
      {
        criteria: "Flexibility",
        ca: "Complete flexibility to study anytime, anywhere",
        cs: "Fixed timings and limited flexibility",
      },
      {
        criteria: "Doubt Clarification",
        ca: "Through online forums, AI solutions, or limited interaction",
        cs: "Direct interaction with faculty members",
      },
      {
        criteria: "Study Materials",
        ca: "Need to source from multiple providers (books, online courses, notes)",
        cs: "Provided by coaching institute, curated and structured",
      },
      {
        criteria: "Structure & Planning",
        ca: "Need to create own study plan and schedule",
        cs: "Pre-planned curriculum and study schedule provided",
      },
      {
        criteria: "Motivation",
        ca: "Self-motivation required, no external pressure",
        cs: "External motivation from peer group and faculty",
      },
      {
        criteria: "Mock Tests",
        ca: "Rely on free or paid online mock test platforms",
        cs: "Regular mock tests and assessments by institute",
      },
      {
        criteria: "Faculty Interaction",
        ca: "Minimal or no direct faculty contact",
        cs: "Direct access to experienced faculty members",
      },
      {
        criteria: "Peer Learning",
        ca: "Limited peer interaction, mostly solo learning",
        cs: "Good peer group environment for collaborative learning",
      },
    ],
    prosSelfStudy: [
      "Much more affordable - saves INR 15,000-1,40,000",
      "Complete flexibility to study at your own pace and time",
      "No pressure from fixed schedules or peer comparison",
      "Can focus on weak areas as much as needed",
      "Develops self-discipline and independent learning skills",
      "Can use multiple quality resources (CA Saarthi, YouTube, books) simultaneously",
      "Perfect for working professionals or those with busy schedules",
    ],
    consSelfStudy: [
      "Requires high self-motivation and discipline",
      "Risk of getting distracted without external accountability",
      "Difficult to clarify doubts quickly",
      "Limited peer interaction and group learning",
      "Need to create own study schedule and plan",
      "No professional guidance on exam strategy",
      "Responsibility entirely on student for planning and execution",
    ],
    prosCoaching: [
      "Structured curriculum with logical progression",
      "Expert faculty provides clear explanations and shortcuts",
      "Immediate doubt clarification in classroom",
      "Regular tests and performance monitoring",
      "Peer group motivation and competitive environment",
      "Ready-made study materials and notes",
      "Professional guidance on exam strategy and time management",
      "Accountability through fixed schedules",
    ],
    consCoaching: [
      "High cost - INR 20,000 to 1,50,000 depending on quality",
      "Fixed pace may be too fast or slow for some students",
      "Rigid schedules may not suit working professionals",
      "Not all faculty members are equally experienced",
      "Quality varies significantly between institutes",
      "Limited personalization - one-size-fits-all approach",
      "Traveling to center consumes time and money",
    ],
    verdict:
      "Choose self-study if you're: disciplined, have limited budget, prefer flexibility, working professionally, or motivated by online resources. Choose coaching if you: need structure and accountability, benefit from live teaching, prefer doubt clarification, struggle with self-motivation, or need professional guidance. Many successful students combine both - use coaching for difficult topics and self-study for revision and practice. With quality online platforms like CA Saarthi, self-study has become very viable.",
  },
  "ca-foundation-old-vs-new-syllabus": {
    title: "CA Foundation Old vs New Syllabus 2024: Key Changes and How to Prepare",
    description:
      "Compare CA Foundation old and new syllabi with ICAI 2024 changes. Understand new topics, removed content, and strategies to prepare for the updated exam pattern.",
    keywords: [
      "CA Foundation new syllabus 2024",
      "CA Foundation old vs new syllabus",
      "ICAI syllabus changes",
      "CA Foundation 2024 changes",
      "new exam pattern CA",
      "CA Saarthi",
    ],
    slug: "ca-foundation-old-vs-new-syllabus",
    breadcrumb: "Old vs New Syllabus",
    faqs: [
      {
        q: "When did ICAI implement the new CA Foundation syllabus?",
        a: "The new CA Foundation syllabus was implemented by ICAI in 2023 with effect from students registering from a specific date. The new syllabus brings significant changes to bring the curriculum in line with global standards and modern accounting practices.",
      },
      {
        q: "What are the major changes in the new CA Foundation syllabus 2024?",
        a: "Major changes include: Addition of digital accounting and GST aspects, emphasis on sustainability reporting, updates to company law provisions, new sections in business economics on digital economy, introduction of technology in accounting, focus on internal controls and risk management.",
      },
      {
        q: "Are old study materials still relevant for new syllabus?",
        a: "Partially. The core accounting concepts remain the same, but students should use updated study materials for new topics. Books and materials aligned with new ICAI syllabus are essential. Mixing old and new materials can cause confusion.",
      },
      {
        q: "Will students be given syllabus transition time between old and new?",
        a: "Yes, typically ICAI provides a transition period where both old and new syllabi are valid. Check ICAI official notification for exact dates. It's always better to prepare with the new syllabus as it will be the standard going forward.",
      },
    ],
    comparison: [
      {
        criteria: "Paper 1: Accounting Basics",
        ca: "Traditional accounting with basic depreciation and inventory methods",
        cs: "Added: Digital accounting, cloud-based records, GST implications in accounting",
      },
      {
        criteria: "Paper 1: Depreciation Methods",
        ca: "Straight-line and written-down value methods",
        cs: "Same + emphasis on practical GST treatment of depreciation",
      },
      {
        criteria: "Paper 2: Business Laws - Updates",
        ca: "Indian Contract Act, Sale of Goods Act with older case law references",
        cs: "Updated case law, recent amendments, focus on consumer protection updates",
      },
      {
        criteria: "Paper 2: GST Integration",
        ca: "Minimal GST coverage under sales act",
        cs: "Dedicated GST provisions and implications in business transactions",
      },
      {
        criteria: "Paper 3: Quantitative Topics",
        ca: "Standard statistical methods and calculations",
        cs: "Same + introduction to data analytics concepts and interpretation",
      },
      {
        criteria: "Paper 4: Economics - Digital Economy",
        ca: "Traditional microeconomics and macroeconomics",
        cs: "Added: Digital economy, cryptocurrency implications, fintech disruption",
      },
      {
        criteria: "Paper 4: Sustainability",
        ca: "Not specifically covered",
        cs: "Introduction to sustainable business practices and ESG concepts",
      },
      {
        criteria: "Internal Controls",
        ca: "Basic principles only",
        cs: "Expanded section on internal controls and risk management",
      },
      {
        criteria: "Technology in Accounting",
        ca: "Not emphasized",
        cs: "New section on accounting software, automation, and digital tools",
      },
      {
        criteria: "Exam Question Pattern",
        ca: "Traditional case-based questions",
        cs: "Mix of traditional and scenario-based modern business questions",
      },
    ],
    prosNewSyllabus: [
      "More relevant to current business environment and practices",
      "Covers emerging areas like digital accounting and GST",
      "Better preparation for intermediate and final level studies",
      "Aligns with global accounting standards and practices",
      "More practical applicability in real business scenarios",
      "Includes modern concepts like ESG and sustainability",
      "Better career alignment with industry requirements",
    ],
    consNewSyllabus: [
      "Requires updated study materials from ICAI",
      "Less availability of practice questions compared to old syllabus",
      "Fewer reference books available in market initially",
      "Students struggle if using old materials",
      "Slightly more content in some papers",
      "Fewer solved examples available initially",
    ],
    prosOldSyllabus: [
      "Abundant study materials and resources available",
      "Many reference books and solved papers in market",
      "Easier to find coaching and study guides",
      "Established practice question banks",
      "Multiple reference materials for comparison",
      "Clearer exam patterns from past papers",
    ],
    consOldSyllabus: [
      "Doesn't cover modern topics like GST and digital accounting",
      "Less relevant to current business environment",
      "No preparation for intermediate level modern topics",
      "Digital economy and tech aspects missing",
      "Not aligned with global accounting standards",
      "Less useful for career preparation",
    ],
    verdict:
      "All students should prepare with the new 2024 syllabus as it is the current standard. The new syllabus better prepares you for intermediate level and real business scenarios. Use ICAI official study materials, updated reference books, and online platforms like CA Saarthi that have updated content. While core accounting concepts from old syllabus are still relevant, supplement with new topics like GST, digital accounting, and sustainability.",
  },
  "best-ca-foundation-apps-2026": {
    title: "Best CA Foundation Apps 2026: Top Study Apps for CA Exam Preparation",
    description:
      "Review and compare top CA Foundation apps for 2026. Find the best app for practice questions, mock tests, and CA exam preparation based on features, pricing, and student ratings.",
    keywords: [
      "best CA Foundation apps",
      "CA Foundation app 2026",
      "CA exam preparation apps",
      "top CA apps",
      "CA practice app",
      "CA Saarthi",
    ],
    slug: "best-ca-foundation-apps-2026",
    breadcrumb: "Best CA Apps 2026",
    faqs: [
      {
        q: "What features should I look for in a CA Foundation app?",
        a: "Look for: High-quality practice questions with detailed explanations, comprehensive mock tests mirroring actual exam, progress tracking and analytics, organized by topics/papers, doubt-solving features, offline access, adaptive difficulty, and regular updates matching latest syllabus.",
      },
      {
        q: "Are free CA Foundation apps sufficient for preparation?",
        a: "Yes, quality free apps like CA Saarthi provide excellent resources - 2,500+ practice questions, 40 mock tests, performance analytics, and AI doubt solver. Paid apps offer similar features. Choose based on content quality and your learning style rather than just price.",
      },
      {
        q: "Can I rely solely on an app for CA Foundation preparation?",
        a: "No, use app as complement to theory study. First understand concepts from ICAI materials or coaching, then use app for practice questions, mock tests, and performance tracking. Apps are excellent for self-assessment and identifying weak areas.",
      },
      {
        q: "Which app provides the best mock tests for CA Foundation?",
        a: "CA Saarthi, Marwadi Shares, and other platforms offer 40+ full-length mock tests. Choose apps that provide test analysis with time breakdown, topic-wise accuracy, and comparison with average performance. Regular mock test practice is crucial for success.",
      },
    ],
    comparison: [
      {
        criteria: "Platform Name",
        ca: "CA Saarthi",
        cs: "Marwadi Shares CA App",
      },
      {
        criteria: "Practice Questions",
        ca: "2,500+ organized by topic and paper",
        cs: "2,000+ practice questions",
      },
      {
        criteria: "Mock Tests",
        ca: "40 full-length mock tests",
        cs: "30+ mock tests",
      },
      {
        criteria: "Pricing",
        ca: "100% completely free",
        cs: "Partially free with premium options",
      },
      {
        criteria: "AI Doubt Solver",
        ca: "Yes, 24/7 AI-powered doubt solver",
        cs: "Limited community-based doubt solving",
      },
      {
        criteria: "Study Plans",
        ca: "AI-powered personalized study plans",
        cs: "Fixed study plans only",
      },
      {
        criteria: "Progress Analytics",
        ca: "Detailed analytics with improvement tracking",
        cs: "Basic progress tracking",
      },
      {
        criteria: "Offline Access",
        ca: "Partial offline access for downloaded questions",
        cs: "Limited offline features",
      },
      {
        criteria: "Platform Availability",
        ca: "Web and mobile app",
        cs: "Mobile app primarily",
      },
    ],
    prosCA: [
      "Completely free with no hidden charges - save up to INR 5,000-20,000",
      "2,500+ comprehensive practice questions covering all topics",
      "40 full-length mock tests matching actual exam pattern",
      "AI-powered doubt solver available 24/7 for concept clarity",
      "Personalized study plans based on performance",
      "Detailed analytics showing accuracy, speed, and improvement",
      "Community features to learn from peers",
      "Regular updates matching latest ICAI syllabus",
      "Works seamlessly on web and mobile",
    ],
    consCA: [
      "Competition can make you compare with others",
      "Need self-motivation to use consistently",
      "Initially overwhelming with many features",
    ],
    prosPaid: [
      "Additional resources like video lectures (in some apps)",
      "Direct mentor support in premium versions",
      "Curated content from experienced educators",
      "Regular updates and improvements",
    ],
    consPaid: [
      "Costly - typically INR 5,000-25,000 for foundation level",
      "Not all paid apps offer better content than free alternatives",
      "Monthly/annual subscription requirements",
      "May have aggressive promotional tactics",
    ],
    verdict:
      "CA Saarthi is the best choice for most CA Foundation students - it's 100% free and offers comprehensive practice questions, mock tests, AI doubt solving, and personalized study plans. For your specific learning style: Choose CA Saarthi if you want free, comprehensive resources with AI support. Use it as your primary platform, supplemented with ICAI materials for theory. Supplement with YouTube videos for complex topics. Avoid paying for apps unless you need specific video lectures - free quality resources are sufficient.",
  },
};

export async function generateStaticParams() {
  return Object.keys(comparisons).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = comparisons[slug];
  if (!comparison) return { title: "Comparison Not Found" };

  return {
    title: `${comparison.title} | CA Saarthi`,
    description: comparison.description,
    keywords: comparison.keywords,
    alternates: {
      canonical: `/compare/${slug}`,
    },
    openGraph: {
      title: comparison.title,
      description: comparison.description,
      url: `https://www.casaarthi.in/compare/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.title,
      description: comparison.description,
    },
  };
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const comparison = comparisons[slug];
  if (!comparison) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (comparison.faqs || []).map((q: any) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.a,
      },
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
        item: "https://www.casaarthi.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Comparisons",
        item: "https://www.casaarthi.in/compare",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: comparison.breadcrumb,
        item: `https://www.casaarthi.in/compare/${slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">
              CA
            </div>
            <span className="font-bold text-lg text-gray-900">CA Saarthi</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/compare"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Comparisons
            </Link>
            <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900">
              FAQ
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[var(--primary)]">
            Home
          </Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-[var(--primary)]">
            Comparisons
          </Link>
          <span>/</span>
          <span className="text-gray-700 truncate">{comparison.breadcrumb}</span>
        </div>

        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {comparison.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">{comparison.description}</p>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">
            Detailed Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Criteria
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--primary)]">
                    {Object.keys(comparison.comparison?.[0] || {})[1]}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--teal-dark)]">
                    {Object.keys(comparison.comparison?.[0] || {})[2]}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(comparison.comparison || []).map(
                  (row: any, idx: number) => (
                    <tr
                      key={idx}
                      className={`border-b border-gray-100 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-4 px-4 font-semibold text-gray-900">
                        {row.criteria}
                      </td>
                      <td className="py-4 px-4 text-gray-700">{row.ca}</td>
                      <td className="py-4 px-4 text-gray-700">{row.cs}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pros and Cons Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* First Option Pros */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">✓</span> Advantages of{" "}
              {Object.keys(comparison.comparison?.[0] || {})[1]}
            </h3>
            <ul className="space-y-3">
              {(comparison.prosCA || []).map((pro: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* First Option Cons */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-red-600">✗</span> Disadvantages of{" "}
              {Object.keys(comparison.comparison?.[0] || {})[1]}
            </h3>
            <ul className="space-y-3">
              {(comparison.consCA || []).map((con: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="text-red-600 font-bold flex-shrink-0">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Second Option Pros */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">✓</span> Advantages of{" "}
              {Object.keys(comparison.comparison?.[0] || {})[2]}
            </h3>
            <ul className="space-y-3">
              {(comparison.prosCMA || []).map((pro: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Second Option Cons */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-red-600">✗</span> Disadvantages of{" "}
              {Object.keys(comparison.comparison?.[0] || {})[2]}
            </h3>
            <ul className="space-y-3">
              {(comparison.consCMA || []).map((con: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="text-red-600 font-bold flex-shrink-0">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Verdict Section */}
        <section className="bg-[var(--sage-light)] border-l-4 border-[var(--primary)] p-6 mb-12 rounded-r-lg">
          <h3 className="text-lg font-bold text-[var(--teal-dark)] mb-3">
            📌 Our Verdict & Recommendation
          </h3>
          <p className="text-gray-900 leading-relaxed">{comparison.verdict}</p>
        </section>

        {/* FAQs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {(comparison.faqs || []).map((item: any, idx: number) => (
              <details
                key={idx}
                className="group border border-gray-200 rounded-lg hover:border-[var(--primary)] transition-colors"
              >
                <summary className="flex items-start gap-4 p-4 cursor-pointer select-none hover:bg-gray-50 transition-colors">
                  <span className="text-[var(--primary)] font-bold flex-shrink-0 mt-0.5">
                    Q.
                  </span>
                  <span className="text-base font-semibold text-gray-900 text-left group-open:text-[var(--primary)]">
                    {item.q}
                  </span>
                </summary>
                <div className="px-4 pb-4 pt-2 text-gray-700 border-t border-gray-100 bg-gray-50">
                  <span className="text-[var(--primary)] font-bold mr-2">A.</span>
                  <p className="leading-relaxed inline">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-[var(--primary)] to-[var(--teal-dark)] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Start Your Free CA Foundation Preparation
          </h2>
          <p className="text-white text-opacity-90 mb-6">
            Based on this comparison, begin your preparation journey on CA
            Saarthi. Get 2,500+ practice questions, 40 mock tests, AI doubt
            solver, and personalized study plans — completely free.
          </p>
          <Link href="/register">
            <button className="bg-white text-[var(--teal-dark)] font-bold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Start Free CA Foundation Preparation →
            </button>
          </Link>
        </div>

        {/* More Comparisons */}
        <div className="mt-16">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            More Comparisons
          </h3>
          <div className="space-y-4">
            {Object.entries(comparisons)
              .filter(([s]) => s !== slug)
              .slice(0, 3)
              .map(([s, comp]: any) => (
                <Link key={s} href={`/compare/${s}`}>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[var(--primary)]/40 transition-all">
                    <div className="font-semibold text-gray-900 hover:text-[var(--primary)]">
                      {comp.title}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
}
