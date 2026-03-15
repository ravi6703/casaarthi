"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface Props {
  papers: { id: number; code: string; name: string; emoji: string }[];
  topics: { id: string; paper_id: number; name: string; questionCount: number }[];
}

export function QuickStartFilter({ papers, topics }: Props) {
  const router = useRouter();
  const [selectedPaper, setSelectedPaper] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const filteredTopics = selectedPaper
    ? topics.filter((t) => t.paper_id === selectedPaper && t.questionCount > 0)
    : [];

  function handleStart() {
    if (selectedTopic) {
      router.push(`/practice/session?type=topic&topicId=${selectedTopic}`);
    } else if (selectedPaper) {
      router.push(`/practice/session?type=mixed&paperId=${selectedPaper}`);
    }
  }

  const selectClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400";

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-blue-600" />
          <h2 className="font-bold text-gray-900">Quick Start</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Paper</label>
            <select
              className={selectClass}
              value={selectedPaper ?? ""}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                setSelectedPaper(val);
                setSelectedTopic("");
              }}
            >
              <option value="">Select Paper</option>
              {papers.map((p) => (
                <option key={p.id} value={p.id}>{p.emoji} {p.code} — {p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Topic</label>
            <select
              className={selectClass}
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedPaper}
            >
              <option value="">All Topics (Mixed)</option>
              {filteredTopics.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.questionCount} Qs)</option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleStart}
            disabled={!selectedPaper}
            className="w-full sm:w-auto"
          >
            Start Practice →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
