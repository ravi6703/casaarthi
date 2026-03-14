import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const REQUIRED_COLS = [
  "paper_id", "question_text",
  "option_a", "option_b", "option_c", "option_d",
  "correct_option", "explanation", "difficulty",
];

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  // Parse header — handle quoted fields
  const headers = parseRow(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.length === 0) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] ?? "").trim(); });
    rows.push(row);
  }
  return rows;
}

function parseRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminClient = await createAdminClient();
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const text = await file.text();
  const rows = parseCSV(text);
  if (rows.length === 0) return NextResponse.json({ error: "CSV is empty or invalid" }, { status: 400 });

  // Validate headers
  const headers = Object.keys(rows[0]);
  const missing = REQUIRED_COLS.filter((c) => !headers.includes(c));
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing columns: ${missing.join(", ")}` }, { status: 400 });
  }

  const results: Array<{ row: number; status: string; message?: string; question_text?: string }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // 1-indexed + header row

    // Validate required
    const empty = REQUIRED_COLS.filter((c) => !row[c]);
    if (empty.length > 0) {
      results.push({ row: rowNum, status: "error", message: `Missing: ${empty.join(", ")}` });
      continue;
    }

    const paperId = Number(row.paper_id);
    if (![1, 2, 3, 4].includes(paperId)) {
      results.push({ row: rowNum, status: "error", message: `Invalid paper_id: ${row.paper_id}` });
      continue;
    }

    if (!["a", "b", "c", "d"].includes(row.correct_option.toLowerCase())) {
      results.push({ row: rowNum, status: "error", message: `correct_option must be a/b/c/d` });
      continue;
    }

    if (!["easy", "medium", "hard"].includes(row.difficulty.toLowerCase())) {
      results.push({ row: rowNum, status: "error", message: `difficulty must be easy/medium/hard` });
      continue;
    }

    const { error } = await (adminClient.from("questions") as any).insert({
      paper_id: paperId,
      topic_id: row.topic_id || null,
      question_text: row.question_text,
      option_a: row.option_a,
      option_b: row.option_b,
      option_c: row.option_c,
      option_d: row.option_d,
      correct_option: row.correct_option.toLowerCase(),
      explanation: row.explanation,
      difficulty: row.difficulty.toLowerCase(),
      source: row.source || null,
      year: row.year ? Number(row.year) : null,
      is_diagnostic: row.is_diagnostic === "true",
      status: "pending",
    });

    if (error) {
      results.push({ row: rowNum, status: "error", message: error.message });
    } else {
      results.push({ row: rowNum, status: "ok", question_text: row.question_text });
    }
  }

  return NextResponse.json({ results, total: rows.length });
}
