import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  const body = await request.json();
  const { questionText, modelAnswer, markingRubric, studentAnswer, maxMarks, topicName, paperName } = body;

  if (!questionText || !studentAnswer) {
    return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey });

  const rubricText = markingRubric
    ? Object.entries(markingRubric).map(([criterion, marks]) => `- ${criterion}: ${marks} marks`).join("\n")
    : `- Accuracy & Completeness: ${Math.ceil((maxMarks || 5) * 0.4)} marks\n- Conceptual Clarity: ${Math.ceil((maxMarks || 5) * 0.3)} marks\n- Presentation & Structure: ${Math.ceil((maxMarks || 5) * 0.3)} marks`;

  const prompt = `You are an expert CA Foundation examiner for ICAI. Evaluate the student's answer strictly as per ICAI examination standards.

**Subject:** ${paperName || "CA Foundation"}
**Topic:** ${topicName || "General"}
**Question:** ${questionText}
**Maximum Marks:** ${maxMarks || 5}

${modelAnswer ? `**Model Answer:**\n${modelAnswer}` : ""}

**Marking Rubric:**
${rubricText}

**Student's Answer:**
${studentAnswer}

Evaluate thoroughly and respond in this EXACT JSON format (no markdown, just pure JSON):
{
  "score": <number out of ${maxMarks || 5}, can be decimal like 3.5>,
  "rubricScores": {
    "Accuracy & Completeness": <number>,
    "Conceptual Clarity": <number>,
    "Presentation & Structure": <number>
  },
  "feedback": "<150-200 words: what was good, what was missed, key points to remember, how to improve. Be encouraging but honest.>",
  "keyPointsMissed": ["<point 1>", "<point 2>"],
  "grade": "<Excellent|Good|Satisfactory|Needs Improvement|Poor>"
}

Be fair. Award partial marks for partially correct answers. If the student has written something relevant, give at least some marks.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // Try to parse JSON from the response
    let result;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      // Fallback: create a structured response from text
      result = {
        score: Math.round((maxMarks || 5) * 0.5),
        rubricScores: {},
        feedback: text,
        keyPointsMissed: [],
        grade: "Satisfactory",
      };
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("AI evaluate error:", err);
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
