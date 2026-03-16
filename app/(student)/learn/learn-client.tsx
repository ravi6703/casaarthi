"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Loader2, Brain, BookOpen, Lightbulb, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { MindMapViewer } from "@/components/learn/mind-map-viewer";

interface Topic {
  id: string;
  name: string;
  paper_id: number;
}

const PAPERS = [
  { id: 1, code: "P1", name: "Accounting", emoji: "\u{1F4CA}" },
  { id: 2, code: "P2", name: "Laws", emoji: "\u{2696}\u{FE0F}" },
  { id: 3, code: "P3", name: "Maths", emoji: "\u{1F522}" },
  { id: 4, code: "P4", name: "Economics", emoji: "\u{1F4C8}" },
];

const SAMPLE_QUESTIONS = [
  "What is the difference between provisions and reserves?",
  "Explain the concept of depreciation methods",
  "What are the types of company meetings?",
  "How does simple interest differ from compound interest?",
  "What is demand elasticity and its types?",
];

export function LearnClient({ topics }: { topics: Topic[] }) {
  const [selectedPaper, setSelectedPaper] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [freeQuestion, setFreeQuestion] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ query: string; mermaid: string; explanation: string }[]>([]);

  const filteredTopics = selectedPaper ? topics.filter(t => t.paper_id === selectedPaper) : topics;

  async function handleGenerate(query: string, isTopic: boolean) {
    setLoading(true);
    setMermaidCode("");
    setExplanation("");

    try {
      const res = await fetch("/api/explain-visual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isTopic ? { topic: query } : { question: query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMermaidCode(data.mermaid);
      setExplanation(data.explanation);
      setHistory(prev => [{ query, mermaid: data.mermaid, explanation: data.explanation }, ...prev.slice(0, 9)]);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  function handleTopicClick(topicName: string) {
    handleGenerate(topicName, true);
  }

  function handleQuestionSubmit() {
    if (!freeQuestion.trim()) return;
    handleGenerate(freeQuestion.trim(), false);
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          AI Visual Explainer
        </h1>
        <p className="text-gray-500 mt-1">Ask any doubt and get a visual mind map explanation powered by AI</p>
      </div>

      {/* Ask a Question */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Ask Anything
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <textarea
              value={freeQuestion}
              onChange={(e) => setFreeQuestion(e.target.value)}
              placeholder="Type your doubt here... e.g., Explain the accounting treatment for bad debts"
              className="flex-1 text-sm border border-gray-200 rounded-lg p-3 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleQuestionSubmit(); }}}
            />
            <Button
              onClick={handleQuestionSubmit}
              disabled={loading || !freeQuestion.trim()}
              className="bg-purple-600 hover:bg-purple-700 self-end"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {SAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => { setFreeQuestion(q); handleGenerate(q, false); }}
                className="text-xs px-2.5 py-1 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Browse by Topic */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Or Browse by Topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Paper filter */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setSelectedPaper(null)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!selectedPaper ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
            >
              All Papers
            </button>
            {PAPERS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPaper(p.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedPaper === p.id ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
              >
                {p.emoji} {p.code}
              </button>
            ))}
          </div>

          {/* Topic chips */}
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
            {filteredTopics.map(t => (
              <button
                key={t.id}
                onClick={() => handleTopicClick(t.name)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-1"
              >
                {t.name}
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mind Map Result */}
      {loading && (
        <Card className="border-purple-200">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-500 mb-3" />
            <p className="text-sm text-gray-500">Generating your visual explanation...</p>
          </CardContent>
        </Card>
      )}

      {mermaidCode && !loading && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Visual Mind Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MindMapViewer code={mermaidCode} />
            {explanation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-sm font-semibold text-blue-800 mb-1">Key Takeaway</div>
                <p className="text-sm text-blue-700">{explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-gray-500">Recent Explorations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {history.slice(1).map((h, i) => (
                <button
                  key={i}
                  onClick={() => { setMermaidCode(h.mermaid); setExplanation(h.explanation); }}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-200 transition-colors"
                >
                  {h.query.length > 40 ? h.query.slice(0, 38) + "\u2026" : h.query}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
