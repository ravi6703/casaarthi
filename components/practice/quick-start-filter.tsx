"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface Chapter {
  id: string;
  paper_id: number;
  chapter_number: number;
  name: string;
}

interface Topic {
  id: string;
  paper_id: number;
  chapter_id: string | null;
  name: string;
  questionCount: number;
}

interface Props {
  papers: { id: number; code: string; name: string; emoji: string }[];
  topics: Topic[];
  chapters: Chapter[];
}

export function QuickStartFilter({ papers, topics, chapters }: Props) {
  const router = useRouter();
  const [selectedPaper, setSelectedPaper] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  // Group topics by chapter for the selected paper
  const groupedTopics = useMemo(() => {
    if (!selectedPaper) return [];

    const paperChapters = chapters
      .filter((c) => c.paper_id === selectedPaper)
      .sort((a, b) => a.chapter_number - b.chapter_number);

    const paperTopics = topics.filter(
      (t) => t.paper_id === selectedPaper && t.questionCount > 0,
    );

    // Build chapter groups
    const groups: { chapter: Chapter | null; topics: Topic[] }[] = [];

    for (const ch of paperChapters) {
      const chTopics = paperTopics.filter((t) => t.chapter_id === ch.id);
      if (chTopics.length > 0) {
        groups.push({ chapter: ch, topics: chTopics });
      }
    }

    // Orphan topics (no chapter_id)
    const orphans = paperTopics.filter(
      (t) => !t.chapter_id || !paperChapters.find((c) => c.id === t.chapter_id),
    );
    if (orphans.length > 0) {
      groups.push({ chapter: null, topics: orphans });
    }

    return groups;
  }, [selectedPaper, topics, chapters]);

  function handleStart() {
    if (selectedTopic) {
      router.push(`/practice/session?type=topic&topicId=${selectedTopic}`);
    } else if (selectedPaper) {
      router.push(`/practice/session?type=mixed&paperId=${selectedPaper}`);
    }
  }

  const selectClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none disabled:bg-gray-100 disabled:text-gray-400";

  return (
    <Card className="border-[var(--border)] bg-[var(--sage-light)]/30">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="font-bold text-gray-900">Quick Start</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Paper
            </label>
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
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.code} — {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Topic
            </label>
            <select
              className={selectClass}
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedPaper}
            >
              <option value="">All Topics (Mixed)</option>
              {groupedTopics.map((group) => (
                <optgroup
                  key={group.chapter?.id ?? "other"}
                  label={
                    group.chapter
                      ? `Ch ${group.chapter.chapter_number}: ${group.chapter.name}`
                      : "Other Topics"
                  }
                >
                  {group.topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.questionCount} Qs)
                    </option>
                  ))}
                </optgroup>
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
