"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Eye } from "lucide-react";

interface Question {
  id: string;
  question_text: string;
  difficulty: string;
  status: string;
  paper_id: number;
  created_at: string;
  topics?: { name: string } | null;
}

const PAPER_LABELS: Record<number, string> = { 1: "P1", 2: "P2", 3: "P3", 4: "P4" };
const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard: "bg-red-100 text-red-700",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  retired: "bg-gray-100 text-gray-500",
};

export function QuestionRow({ question }: { question: Question }) {
  const preview = question.question_text.length > 120
    ? question.question_text.slice(0, 120) + "…"
    : question.question_text;

  return (
    <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 leading-relaxed">{preview}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-gray-400">{PAPER_LABELS[question.paper_id]}</span>
          {question.topics?.name && (
            <span className="text-xs text-gray-400">· {question.topics.name}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFFICULTY_COLOR[question.difficulty]}`}>
          {question.difficulty}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLOR[question.status]}`}>
          {question.status}
        </span>
        <Link href={`/admin/questions/${question.id}`}>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <Edit2 className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
