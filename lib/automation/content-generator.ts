import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/* ------------------------------------------------------------------ */
/*  TOPIC POOLS — rotated daily so content never repeats              */
/* ------------------------------------------------------------------ */

const CURRENT_AFFAIRS_ANGLES = [
  "Recent changes in Indian accounting standards (Ind AS) and their impact on CA Foundation Paper 1",
  "Latest amendments to the Companies Act 2013 relevant to CA Foundation Paper 2",
  "Recent RBI monetary policy decisions and their economic implications for CA Foundation Paper 4",
  "New GST amendments and indirect tax updates for CA Foundation students",
  "Recent Supreme Court judgments on contract law relevant to Indian Contract Act (Paper 2)",
  "Latest SEBI regulations and capital market updates for CA Foundation economics",
  "Recent changes in Indian Partnership Act case laws and amendments",
  "Budget highlights and fiscal policy changes relevant to CA Foundation Paper 4",
  "Latest ICAI announcements, exam pattern changes, and syllabus updates for 2026",
  "Recent developments in negotiable instruments and banking law for Paper 2",
  "Indian economy GDP growth, inflation trends, and their CA Foundation exam relevance",
  "Recent amendments in Sale of Goods Act and consumer protection for Paper 2",
  "Digital economy and UPI/fintech developments relevant to CA Foundation economics",
  "Latest developments in international trade policy and India's export-import trends",
  "Recent corporate governance reforms and their accounting implications",
  "Statistical data releases (census, economic survey) relevant to Paper 3 quantitative aptitude",
  "Recent LLP Act amendments and business entity updates for Paper 2",
  "Foreign exchange and FEMA updates relevant to CA Foundation economics",
  "Recent developments in environmental accounting and sustainability reporting",
  "Latest ICAI ethical guidelines and professional conduct updates",
  "Union Budget tax proposals and their impact on CA Foundation syllabus",
  "Recent banking sector developments (mergers, NPAs) for economics paper",
  "Startup ecosystem and Companies Act compliance updates",
  "Recent changes in TDS/TCS provisions relevant to CA Foundation",
  "Agricultural policy updates and their macroeconomic impact for Paper 4",
  "Make in India, PLI schemes and industrial policy for economics",
  "Recent insolvency and bankruptcy code developments",
  "Digital rupee and cryptocurrency regulation updates",
  "Recent amendments in Stamp Act and registration laws",
  "India's credit rating changes and sovereign debt developments",
];

const SEO_BLOG_TOPICS = [
  // Paper 1 — Accounting
  "How to prepare journal entries for CA Foundation — step by step guide with examples",
  "CA Foundation depreciation methods explained — SLM vs WDV with solved problems",
  "Bank reconciliation statement for CA Foundation — common mistakes and how to avoid them",
  "CA Foundation trial balance — complete guide with adjustments and errors",
  "Final accounts of sole proprietors — CA Foundation accounting notes with examples",
  "CA Foundation inventory valuation — FIFO, LIFO, weighted average explained",
  "Bills of exchange problems and solutions for CA Foundation Paper 1",
  "Partnership accounts admission and retirement — CA Foundation preparation guide",
  "CA Foundation accounting standards — key standards you must know for exam",
  "NPO financial statements — CA Foundation receipts and payments account guide",
  // Paper 2 — Business Laws
  "Indian Contract Act 1872 for CA Foundation — all important sections with case laws",
  "Sale of Goods Act 1930 — CA Foundation notes with MCQ practice questions",
  "CA Foundation Companies Act 2013 — key provisions every student must know",
  "Negotiable Instruments Act for CA Foundation — types of negotiable instruments explained",
  "Indian Partnership Act 1932 — CA Foundation preparation guide with examples",
  "LLP Act 2008 for CA Foundation — formation, advantages, and key differences",
  "CA Foundation business correspondence and report writing tips",
  "Communication skills for CA Foundation Paper 2 — complete preparation strategy",
  // Paper 3 — Quantitative Aptitude
  "CA Foundation ratio and proportion — shortcuts and tricks for quick solving",
  "Permutations and combinations for CA Foundation — formulas and solved examples",
  "CA Foundation statistics — measures of central tendency with practice problems",
  "Probability for CA Foundation — basic concepts to advanced problems guide",
  "CA Foundation sequence and series — AP, GP, HP formulas with examples",
  "Linear inequalities for CA Foundation — graphical method and solved problems",
  "CA Foundation logarithms — properties, formulas, and exam-style questions",
  "Sets relations and functions — CA Foundation maths complete guide",
  "CA Foundation differential calculus — derivatives made easy for beginners",
  "Theoretical distributions for CA Foundation — binomial, Poisson, normal explained",
  // Paper 4 — Business Economics
  "Demand and supply analysis for CA Foundation — elasticity concepts with graphs",
  "CA Foundation national income accounting — GDP, GNP, NDP explained simply",
  "Money market vs capital market — CA Foundation economics comparison guide",
  "CA Foundation public finance — government budget and fiscal policy notes",
  "Indian economy overview for CA Foundation — key statistics and trends 2026",
  "Production and cost theory — CA Foundation microeconomics complete notes",
  "CA Foundation business cycles — phases, theories, and indicators explained",
  "International trade for CA Foundation — comparative advantage and trade policies",
  "Price determination under different market structures — CA Foundation guide",
  "CA Foundation monetary policy — RBI tools and their economic impact",
  // General / Strategy
  "CA Foundation preparation strategy — 3 month study plan for working professionals",
  "Top 10 mistakes CA Foundation students make and how to avoid them",
  "CA Foundation exam day tips — time management and attempt strategy",
  "CA Foundation vs CA Inter — what changes and how to prepare for the transition",
  "Best free resources for CA Foundation preparation in 2026",
  "CA Foundation negative marking strategy — when to guess and when to skip",
  "How to use CA Saarthi for CA Foundation preparation — complete guide",
  "CA Foundation June 2026 exam — last 30 days preparation checklist",
  "Subject-wise marks distribution in CA Foundation — where to focus",
  "CA Foundation self-study vs coaching — pros, cons, and the hybrid approach",
];

/* ------------------------------------------------------------------ */
/*  Helper: pick topic for today (deterministic based on date)        */
/* ------------------------------------------------------------------ */
function todayIndex(pool: string[]): number {
  const now = new Date();
  // Day-of-year gives a stable daily rotation
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % pool.length;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

function todayDateStr(): string {
  return new Date().toISOString().split("T")[0]; // "2026-03-28"
}

/* ------------------------------------------------------------------ */
/*  Generate a current affairs blog post                              */
/* ------------------------------------------------------------------ */
export async function generateCurrentAffairs(): Promise<{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  meta_description: string;
  read_time: string;
}> {
  const angle = CURRENT_AFFAIRS_ANGLES[todayIndex(CURRENT_AFFAIRS_ANGLES)];
  const dateStr = todayDateStr();

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2500,
    messages: [
      {
        role: "user",
        content: `You are an expert CA Foundation exam coach writing for Indian students preparing for the ICAI CA Foundation exam.

Today's date: ${dateStr}

Write a current affairs blog post about: "${angle}"

Requirements:
1. Title should be SEO-friendly and include "CA Foundation" keyword
2. Content should be 600-800 words
3. Connect the current affairs to specific CA Foundation exam topics
4. Include 2-3 potential exam-style MCQ questions at the end
5. Use simple English suitable for Indian students (many are 12th pass)
6. Include relevant section numbers, act names, or economic data
7. Make it actionable — tell students exactly what to remember for the exam

Return your response in this exact JSON format (no markdown, just pure JSON):
{
  "title": "...",
  "excerpt": "A 1-2 sentence summary",
  "content": "Full HTML content with <h2>, <h3>, <p>, <ul>, <li>, <strong> tags. Include MCQs at the end.",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "meta_description": "SEO meta description under 155 characters",
  "read_time": "X min read"
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Parse JSON from response (handle potential markdown wrapping)
  const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  return {
    title: parsed.title,
    slug: `${slugify(parsed.title)}-${dateStr}`,
    excerpt: parsed.excerpt,
    content: parsed.content,
    keywords: parsed.keywords,
    meta_description: parsed.meta_description,
    read_time: parsed.read_time || "4 min read",
  };
}

/* ------------------------------------------------------------------ */
/*  Generate an SEO blog post                                         */
/* ------------------------------------------------------------------ */
export async function generateSEOBlog(): Promise<{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  meta_description: string;
  read_time: string;
}> {
  const topic = SEO_BLOG_TOPICS[todayIndex(SEO_BLOG_TOPICS)];
  const dateStr = todayDateStr();

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `You are an expert CA Foundation exam coach. Write a comprehensive, SEO-optimized blog post.

Topic: "${topic}"

Requirements:
1. Title must be SEO-friendly with primary keyword near the beginning
2. Content should be 1000-1500 words (comprehensive study material)
3. Structure with clear H2 and H3 headings
4. Include practical examples, formulas, or mnemonics where applicable
5. Include a table of key points or comparison where relevant (HTML <table>)
6. Add 3-5 practice MCQs at the end with answers
7. Use simple English for Indian students
8. Mention "CA Foundation" and "CA Saarthi" naturally in the content
9. Add internal links suggestion: mention related topics students should study next
10. Include exam tips specific to this topic

Return your response in this exact JSON format (no markdown, just pure JSON):
{
  "title": "...",
  "excerpt": "A 1-2 sentence summary",
  "content": "Full HTML content with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <table> tags. Include MCQs at the end.",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "meta_description": "SEO meta description under 155 characters",
  "read_time": "X min read"
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const jsonStr = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  return {
    title: parsed.title,
    slug: slugify(parsed.title),
    excerpt: parsed.excerpt,
    content: parsed.content,
    keywords: parsed.keywords,
    meta_description: parsed.meta_description,
    read_time: parsed.read_time || "7 min read",
  };
}
