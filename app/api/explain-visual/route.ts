import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { topic, question } = await request.json();
  if (!topic && !question) return NextResponse.json({ error: "Topic or question required" }, { status: 400 });

  const prompt = question
    ? `A CA Foundation student asks: "${question}"

Create a visual mind map explanation. Return ONLY valid Mermaid.js mindmap syntax (using the "mindmap" diagram type).

Rules:
- Use the mindmap diagram type
- Root node should be the main concept
- Include 3-5 branches with key sub-concepts
- Each branch can have 1-2 leaf nodes with specifics
- Keep text very short (3-5 words per node)
- Focus on CA Foundation syllabus relevance

After the mermaid code, add a brief 2-3 sentence explanation.

Format your response EXACTLY like this:
\`\`\`mermaid
mindmap
  root((Main Concept))
    Branch 1
      Detail A
      Detail B
    Branch 2
      Detail C
    Branch 3
      Detail D
\`\`\`

**Explanation:** Your brief explanation here.`
    : `Create a mind map for the CA Foundation topic: "${topic}".

Return ONLY valid Mermaid.js mindmap syntax. Rules:
- Use the mindmap diagram type
- Root should be the topic name
- Include key sub-concepts as branches (4-6 branches)
- Each branch should have 2-3 important details as leaf nodes
- Keep text short (3-5 words per node)
- Cover definitions, formulas, key points, exam tips

After the mermaid code, add a brief 2-3 sentence explanation.

Format your response EXACTLY like this:
\`\`\`mermaid
mindmap
  root((Topic Name))
    Key Concept 1
      Important Detail
      Formula/Rule
    Key Concept 2
      Important Detail
    Exam Tips
      Common Questions
      Marks Distribution
\`\`\`

**Explanation:** Your brief explanation here.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Extract mermaid code and explanation
  const mermaidMatch = text.match(/```mermaid\n([\s\S]*?)```/);
  const explanationMatch = text.match(/\*\*Explanation:\*\*\s*([\s\S]*?)$/);

  return NextResponse.json({
    mermaid: mermaidMatch?.[1]?.trim() ?? "",
    explanation: explanationMatch?.[1]?.trim() ?? text.replace(/```mermaid[\s\S]*?```/, "").trim(),
  });
}
