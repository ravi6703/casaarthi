"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Save, Trash2 } from "lucide-react";

interface Paper { id: number; name: string; code: string; }
interface Topic { id: string; name: string; paper_id: number; }

interface Props {
  papers: Paper[];
  topics: Topic[];
  initialData?: {
    id: string;
    paper_id: number;
    topic_id: string | null;
    sub_topic_id: string | null;
    question_text: string;
    option_a: string | null;
    option_b: string | null;
    option_c: string | null;
    option_d: string | null;
    correct_option: string | null;
    explanation: string;
    difficulty: string;
    source: string | null;
    year: number | null;
    is_diagnostic: boolean;
    status: string;
  };
}

const FIELD_LABELS: Record<string, string> = {
  a: "Option A", b: "Option B", c: "Option C", d: "Option D",
};

export function QuestionForm({ papers, topics, initialData }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [paperId, setPaperId] = useState<number>(initialData?.paper_id ?? 1);
  const [topicId, setTopicId] = useState<string>(initialData?.topic_id ?? "");
  const [questionText, setQuestionText] = useState(initialData?.question_text ?? "");
  const [optionA, setOptionA] = useState(initialData?.option_a ?? "");
  const [optionB, setOptionB] = useState(initialData?.option_b ?? "");
  const [optionC, setOptionC] = useState(initialData?.option_c ?? "");
  const [optionD, setOptionD] = useState(initialData?.option_d ?? "");
  const [correctOption, setCorrectOption] = useState(initialData?.correct_option ?? "a");
  const [explanation, setExplanation] = useState(initialData?.explanation ?? "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? "medium");
  const [source, setSource] = useState(initialData?.source ?? "");
  const [year, setYear] = useState<string>(initialData?.year?.toString() ?? "");
  const [isDiagnostic, setIsDiagnostic] = useState(initialData?.is_diagnostic ?? false);
  const [status, setStatus] = useState(initialData?.status ?? "pending");
  const [saving, setSaving] = useState(false);

  const filteredTopics = topics.filter((t) => t.paper_id === paperId);

  async function handleSave() {
    if (!questionText.trim()) { toast.error("Question text is required"); return; }
    if (!optionA || !optionB || !optionC || !optionD) { toast.error("All 4 options are required"); return; }
    if (!explanation.trim()) { toast.error("Explanation is required"); return; }

    setSaving(true);
    const payload = {
      paper_id: paperId,
      topic_id: topicId || null,
      question_text: questionText.trim(),
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_option: correctOption,
      explanation: explanation.trim(),
      difficulty,
      source: source || null,
      year: year ? Number(year) : null,
      is_diagnostic: isDiagnostic,
      status,
    };

    let error;
    if (initialData?.id) {
      ({ error } = await (supabase.from("questions") as any).update(payload).eq("id", initialData.id));
    } else {
      ({ error } = await (supabase.from("questions") as any).insert(payload));
    }

    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(initialData?.id ? "Question updated" : "Question created");
      router.push("/admin/questions");
      router.refresh();
    }
  }

  async function handleRetire() {
    if (!initialData?.id) return;
    const { error } = await (supabase.from("questions") as any).update({ status: "retired" }).eq("id", initialData.id);
    if (error) toast.error(error.message);
    else { toast.success("Question retired"); router.push("/admin/questions"); router.refresh(); }
  }

  return (
    <div className="space-y-5">
      {/* Paper + Topic */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Paper</label>
              <select
                value={paperId}
                onChange={(e) => { setPaperId(Number(e.target.value)); setTopicId(""); }}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {papers.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Topic</label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Select topic —</option>
                {filteredTopics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Source Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 2023"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDiagnostic"
              checked={isDiagnostic}
              onChange={(e) => setIsDiagnostic(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isDiagnostic" className="text-sm text-gray-700">Use in diagnostic test</label>
          </div>
        </CardContent>
      </Card>

      {/* Question Text */}
      <Card>
        <CardContent className="p-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Question Text</label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={4}
            placeholder="Enter the question..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">Answer Options</label>
          {(["a", "b", "c", "d"] as const).map((opt) => {
            const value = { a: optionA, b: optionB, c: optionC, d: optionD }[opt];
            const setter = { a: setOptionA, b: setOptionB, c: setOptionC, d: setOptionD }[opt];
            return (
              <div key={opt} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctOption"
                  value={opt}
                  checked={correctOption === opt}
                  onChange={() => setCorrectOption(opt)}
                  className="text-green-500"
                />
                <label className="text-xs font-bold text-gray-500 w-16">{FIELD_LABELS[opt]}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={`Option ${opt.toUpperCase()}`}
                  className={`flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    correctOption === opt ? "border-green-400 bg-green-50 focus:ring-green-400" : "border-gray-200 focus:ring-blue-500"
                  }`}
                />
              </div>
            );
          })}
          <p className="text-xs text-gray-400">Select the radio button next to the correct answer</p>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardContent className="p-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Explanation</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={4}
            placeholder="Explain why the correct answer is correct..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </CardContent>
      </Card>

      {/* Source */}
      <Card>
        <CardContent className="p-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Source (optional)</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g. ICAI Study Material, Nov 2023 Exam"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} loading={saving} className="min-w-32">
          <Save className="h-4 w-4 mr-2" />
          {initialData?.id ? "Save Changes" : "Create Question"}
        </Button>
        {initialData?.id && initialData.status !== "retired" && (
          <Button variant="outline" onClick={handleRetire} className="text-red-600 border-red-200 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" />
            Retire Question
          </Button>
        )}
      </div>
    </div>
  );
}
