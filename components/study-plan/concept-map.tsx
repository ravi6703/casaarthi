"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface TopicNode {
  id: string;
  name: string;
  paper_id: number;
  accuracy: number | null;
  attempted: number;
}

interface ChapterNode {
  id: string;
  name: string;
  chapter_number: number;
  topics: TopicNode[];
}

interface PaperNode {
  id: number;
  code: string;
  name: string;
  chapters: ChapterNode[];
}

interface Props {
  papers: PaperNode[];
}

const PAPER_COLORS: Record<number, { bg: string; border: string; text: string; line: string }> = {
  1: { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", line: "#3b82f6" },
  2: { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-800", line: "#8b5cf6" },
  3: { bg: "bg-green-100", border: "border-green-300", text: "text-green-800", line: "#22c55e" },
  4: { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800", line: "#f97316" },
};

function getMasteryColor(accuracy: number | null): string {
  if (accuracy === null) return "bg-gray-200 border-gray-300 text-gray-500";
  if (accuracy >= 80) return "bg-green-200 border-green-400 text-green-800";
  if (accuracy >= 60) return "bg-yellow-200 border-yellow-400 text-yellow-800";
  if (accuracy >= 40) return "bg-orange-200 border-orange-400 text-orange-800";
  return "bg-red-200 border-red-400 text-red-800";
}

export function ConceptMap({ papers }: Props) {
  const [expandedPaper, setExpandedPaper] = useState<number | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Central node */}
      <div className="text-center">
        <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg">
          CA Foundation
        </div>
      </div>

      {/* Paper nodes */}
      <div className="grid grid-cols-2 gap-4">
        {papers.map((paper) => {
          const colors = PAPER_COLORS[paper.id];
          const isExpanded = expandedPaper === paper.id;

          return (
            <div key={paper.id} className="space-y-2">
              <button
                onClick={() => setExpandedPaper(isExpanded ? null : paper.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${colors.bg} ${colors.border} hover:shadow-md ${
                  isExpanded ? "shadow-md" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className={`text-xs ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {paper.code}
                    </Badge>
                    <div className="text-sm font-bold mt-1 text-gray-900">{paper.name}</div>
                    <div className="text-xs text-gray-500">{paper.chapters.length} chapters</div>
                  </div>
                  <span className="text-lg">{isExpanded ? "−" : "+"}</span>
                </div>
              </button>

              {/* Chapters */}
              {isExpanded && (
                <div className="ml-4 space-y-1.5 animate-slide-up">
                  {paper.chapters.map((chapter) => {
                    const isChExpanded = expandedChapter === chapter.id;
                    return (
                      <div key={chapter.id}>
                        <button
                          onClick={() => setExpandedChapter(isChExpanded ? null : chapter.id)}
                          className="w-full text-left px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-all text-xs"
                        >
                          <span className="font-bold text-gray-400 mr-2">Ch {chapter.chapter_number}</span>
                          <span className="font-medium text-gray-700">{chapter.name}</span>
                          <span className="text-gray-400 ml-1">({chapter.topics.length})</span>
                        </button>

                        {/* Topics */}
                        {isChExpanded && (
                          <div className="ml-4 mt-1 space-y-1">
                            {chapter.topics.map((topic) => (
                              <div
                                key={topic.id}
                                className={`px-3 py-1.5 rounded-md border text-[11px] font-medium ${getMasteryColor(topic.accuracy)}`}
                              >
                                {topic.name}
                                {topic.accuracy !== null && (
                                  <span className="ml-1 font-bold">{Math.round(topic.accuracy)}%</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 justify-center text-[10px] text-gray-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-300" /> Strong (80%+)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-yellow-300" /> Good (60-80%)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-300" /> Average (40-60%)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-300" /> Weak (&lt;40%)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-200" /> Not started</div>
      </div>
    </div>
  );
}
