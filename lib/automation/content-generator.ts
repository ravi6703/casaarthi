import Anthropic from "@anthropic-ai/sdk";
import {
  getTodayCurrentAffairsAngle,
  getTodaySEOBlogTopic,
} from "./content-calendar";
import { addInternalLinks } from "./internal-linker";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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
/*  Generate a current affairs blog post                               */
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
  const angle = getTodayCurrentAffairsAngle();
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

  const slug = `${slugify(parsed.title)}-${dateStr}`;
  const keywords = parsed.keywords || [];

  // Add internal links to related content
  const contentWithLinks = await addInternalLinks(
    parsed.content,
    slug,
    keywords
  );

  return {
    title: parsed.title,
    slug,
    excerpt: parsed.excerpt,
    content: contentWithLinks,
    keywords,
    meta_description: parsed.meta_description,
    read_time: parsed.read_time || "4 min read",
  };
}

/* ------------------------------------------------------------------ */
/*  Generate an SEO blog post                                          */
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
  const topic = getTodaySEOBlogTopic();
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

  const slug = slugify(parsed.title);
  const keywords = parsed.keywords || [];

  // Add internal links to related content
  const contentWithLinks = await addInternalLinks(
    parsed.content,
    slug,
    keywords
  );

  return {
    title: parsed.title,
    slug,
    excerpt: parsed.excerpt,
    content: contentWithLinks,
    keywords,
    meta_description: parsed.meta_description,
    read_time: parsed.read_time || "7 min read",
  };
}
