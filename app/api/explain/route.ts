import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  let body: any;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  const { questionText, options, correctOption, userSelected, explanation, topicName, paperName } = body;

  if (!questionText) {
    return NextResponse.json({ error: "Question text is required" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  const optionsText = Object.entries(options || {})
    .map(([key, val]) => `${key.toUpperCase()}) ${val}`)
    .filter(([, val]) => val)
    .join("\n");

  const prompt = `You are an expert CA Foundation tutor helping an Indian student preparing for the ICAI CA Foundation exam.

The student needs help understanding this question:

**Subject:** ${paperName || "CA Foundation"}
**Topic:** ${topicName || "General"}

**Question:** ${questionText}

${optionsText ? `**Options:**\n${optionsText}` : ""}

**Correct Answer:** ${correctOption?.toUpperCase() || "Not specified"}
${userSelected ? `**Student's Answer:** ${userSelected.toUpperCase()} (${userSelected === correctOption ? "Correct" : "Incorrect"})` : ""}
${explanation ? `**Brief Explanation:** ${explanation}` : ""}

Please provide a clear, step-by-step explanation that:
1. Explains WHY the correct answer is correct
2. ${userSelected && userSelected !== correctOption ? "Explains why the student's answer is wrong" : "Reinforces the concept"}
3. Gives a simple trick or mnemonic to remember this concept
4. Relates it to the broader topic for exam preparation

Keep the explanation concise (under 300 words), use simple language suitable for a CA Foundation student, and include any relevant formulas or legal sections if applicable. Use Hindi terms in brackets where it helps understanding.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ explanation: text });
  } catch (err: unknown) {
    console.error("AI explain error:", err);
    return NextResponse.json(
      { error: "Failed to generate explanation" },
      { status: 500 }
    );
  }
}
