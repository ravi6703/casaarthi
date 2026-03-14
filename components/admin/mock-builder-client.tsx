"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, X, CheckCircle, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface Paper { id: number; name: string; code: string; }
interface Topic { id: string; name: string; paper_id: number; }
interface ExistingMock {
  id: string;
  paper_id: number;
  test_number: number;
  duration_minutes: number;
  is_active: boolean;
  mock_test_questions: { count: number }[];
}
interface Question {
  id: string;
  question_text: string;
  difficulty: string;
  topic_id: string | null;
  topics?: { name: string } | null;
}

const PAPER_LABELS: Record<number, string> = { 1: "P1", 2: "P2", 3: "P3", 4: "P4" };
const MOCK_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function MockBuilderClient({ papers, topics, existingMocks }: {
  papers: Paper[];
  topics: Topic[];
  existingMocks: ExistingMock[];
}) {
  const supabase = createClient();

  // Builder state
  const [selectedPaper, setSelectedPaper] = useState<number>(1);
  const [testNumber, setTestNumber] = useState<number>(1);
  const [duration, setDuration] = useState<number>(135);
  const [negativeMarking, setNegativeMarking] = useState(false);

  // Question search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [searching, setSearching] = useState(false);

  // Selected questions
  const [selected, setSelected] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);

  const filteredTopics = topics.filter((t) => t.paper_id === selectedPaper);

  async function handleSearch() {
    if (!searchQuery.trim() && !filterDifficulty && !filterTopic) {
      toast.error("Enter a search term or select a filter");
      return;
    }
    setSearching(true);
    let query = supabase
      .from("questions")
      .select("id, question_text, difficulty, topic_id, topics(name)")
      .eq("paper_id", selectedPaper)
      .eq("status", "approved")
      .limit(50);

    if (searchQuery.trim()) query = query.ilike("question_text", `%${searchQuery.trim()}%`);
    if (filterDifficulty) query = query.eq("difficulty", filterDifficulty);
    if (filterTopic) query = query.eq("topic_id", filterTopic);

    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setSearchResults((data ?? []) as any);
    setSearching(false);
  }

  async function loadByDifficulty() {
    setSearching(true);
    // Auto-load: 50 easy + 80 medium + 20 hard = 150 for full mock
    const [easy, medium, hard] = await Promise.all([
      supabase.from("questions").select("id, question_text, difficulty, topic_id, topics(name)")
        .eq("paper_id", selectedPaper).eq("status", "approved").eq("difficulty", "easy").limit(50),
      supabase.from("questions").select("id, question_text, difficulty, topic_id, topics(name)")
        .eq("paper_id", selectedPaper).eq("status", "approved").eq("difficulty", "medium").limit(80),
      supabase.from("questions").select("id, question_text, difficulty, topic_id, topics(name)")
        .eq("paper_id", selectedPaper).eq("status", "approved").eq("difficulty", "hard").limit(20),
    ]);
    const all = [...(easy.data ?? []), ...(medium.data ?? []), ...(hard.data ?? [])] as Question[];
    setSearchResults(all);
    setSearching(false);
  }

  function toggleQuestion(q: Question) {
    setSelected((prev) => {
      if (prev.find((s) => s.id === q.id)) return prev.filter((s) => s.id !== q.id);
      return [...prev, q];
    });
  }

  async function handleSaveMock() {
    if (selected.length === 0) { toast.error("Add at least one question"); return; }
    setSaving(true);

    // Check if mock already exists
    const { data: existingData } = await supabase
      .from("mock_tests")
      .select("id")
      .eq("paper_id", selectedPaper)
      .eq("test_number", testNumber)
      .single();

    const existing = existingData as any;
    let mockId: string;

    if (existing) {
      // Update existing mock — delete old questions first
      await supabase.from("mock_test_questions").delete().eq("mock_test_id", existing.id);
      await (supabase.from("mock_tests") as any).update({
        duration_minutes: duration,
        has_negative_marking: negativeMarking,
        total_questions: selected.length,
      }).eq("id", existing.id);
      mockId = existing.id;
    } else {
      const { data: newMockData, error: createError } = await (supabase.from("mock_tests") as any).insert({
        paper_id: selectedPaper,
        test_number: testNumber,
        duration_minutes: duration,
        has_negative_marking: negativeMarking,
        total_questions: selected.length,
        is_active: false,
      }).select("id").single();

      const newMock = newMockData as any;
      if (createError || !newMock) {
        toast.error(createError?.message ?? "Failed to create mock");
        setSaving(false);
        return;
      }
      mockId = newMock.id;
    }

    // Insert questions
    const questionRows = selected.map((q, idx) => ({
      mock_test_id: mockId,
      question_id: q.id,
      order_index: idx + 1,
    }));

    const { error: insertError } = await (supabase.from("mock_test_questions") as any).insert(questionRows);
    setSaving(false);

    if (insertError) {
      toast.error(insertError.message);
    } else {
      toast.success(`Mock P${selectedPaper} #${testNumber} saved with ${selected.length} questions`);
      setSelected([]);
      setSearchResults([]);
    }
  }

  const counts = {
    easy: selected.filter((q) => q.difficulty === "easy").length,
    medium: selected.filter((q) => q.difficulty === "medium").length,
    hard: selected.filter((q) => q.difficulty === "hard").length,
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left: Config + Search */}
      <div className="space-y-4">
        {/* Mock Config */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Mock Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Paper</label>
                <select
                  value={selectedPaper}
                  onChange={(e) => { setSelectedPaper(Number(e.target.value)); setSelected([]); setSearchResults([]); }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {papers.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Test Number</label>
                <select
                  value={testNumber}
                  onChange={(e) => setTestNumber(Number(e.target.value))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {MOCK_COUNTS.map((n) => <option key={n} value={n}>Mock {n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={negativeMarking}
                    onChange={(e) => setNegativeMarking(e.target.checked)}
                    className="rounded"
                  />
                  Negative marking
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Search Questions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search question text..."
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={handleSearch} loading={searching} size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
              >
                <option value="">All Topics</option>
                {filteredTopics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            <Button variant="outline" size="sm" className="w-full" onClick={loadByDifficulty} disabled={searching}>
              Auto-load by Difficulty Mix
            </Button>

            {/* Search results */}
            <div className="max-h-72 overflow-y-auto space-y-1">
              {searchResults.map((q) => {
                const isSelected = selected.some((s) => s.id === q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestion(q)}
                    className={`flex items-start gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors ${
                      isSelected ? "border-blue-400 bg-blue-50" : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    {isSelected
                      ? <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      : <Plus className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    }
                    <div className="text-xs">
                      <p className="text-gray-900">{q.question_text.slice(0, 90)}{q.question_text.length > 90 ? "…" : ""}</p>
                      <p className="text-gray-400 mt-0.5 capitalize">{q.difficulty} · {q.topics?.name ?? "No topic"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Selected Questions + Existing Mocks */}
      <div className="space-y-4">
        {/* Selected */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Selected Questions ({selected.length})</span>
              <div className="flex gap-1.5">
                <Badge className="bg-green-100 text-green-700 text-xs">{counts.easy}E</Badge>
                <Badge className="bg-yellow-100 text-yellow-700 text-xs">{counts.medium}M</Badge>
                <Badge className="bg-red-100 text-red-700 text-xs">{counts.hard}H</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {selected.length === 0 && (
                <p className="p-4 text-sm text-gray-400 text-center">No questions selected yet</p>
              )}
              {selected.map((q, idx) => (
                <div key={q.id} className="flex items-start gap-2 px-4 py-2.5">
                  <span className="text-xs text-gray-400 w-6 flex-shrink-0">{idx + 1}.</span>
                  <p className="text-xs text-gray-700 flex-1">
                    {q.question_text.slice(0, 80)}{q.question_text.length > 80 ? "…" : ""}
                  </p>
                  <button onClick={() => toggleQuestion(q)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100">
              <Button
                onClick={handleSaveMock}
                loading={saving}
                disabled={selected.length === 0}
                className="w-full"
              >
                Save Mock P{selectedPaper} #{testNumber}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Mocks */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Existing Mocks</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {existingMocks.length === 0 && (
                <p className="p-4 text-sm text-gray-400 text-center">No mocks created yet</p>
              )}
              {existingMocks.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-4 py-2.5">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">P{m.paper_id} Mock {m.test_number}</span>
                    <span className="text-gray-400 ml-2">· {m.mock_test_questions[0]?.count ?? 0} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${m.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {m.is_active ? "Active" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
