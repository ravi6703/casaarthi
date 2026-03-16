import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question, paperId, topicName } = await request.json();
  if (!question?.trim()) return NextResponse.json({ error: "Question is required" }, { status: 400 });

  const context = topicName ? `The student is asking about "${topicName}" from CA Foundation Paper ${paperId ?? ""}.` : "The student is preparing for CA Foundation exam.";

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `${context}

Student's doubt: "${question}"

Provide a clear, concise answer suitable for a CA Foundation student. Use simple language. If relevant, mention the specific section/provision/formula. Keep the answer focused and under 300 words. Format with markdown for readability.`,
      },
    ],
  });

  const answer = response.content[0].type === "text" ? response.content[0].text : "Unable to generate answer.";

  return NextResponse.json({ answer });
}
