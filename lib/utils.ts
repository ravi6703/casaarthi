import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export function getReadinessColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  if (score >= 30) return "text-orange-600";
  return "text-red-600";
}

export function getReadinessBgColor(score: number): string {
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  if (score >= 30) return "bg-orange-500";
  return "bg-red-500";
}

export function getHeatClass(score: number | null): string {
  if (score === null || score === undefined) return "heat-untested";
  if (score >= 80) return "heat-strong";
  if (score >= 65) return "heat-good";
  if (score >= 40) return "heat-medium";
  if (score >= 20) return "heat-weak";
  return "heat-critical";
}

export function getPaperColor(paperId: number): string {
  const colors: Record<number, string> = {
    1: "blue",
    2: "purple",
    3: "green",
    4: "orange",
  };
  return colors[paperId] || "gray";
}

export function getPaperBadgeClass(paperId: number): string {
  const classes: Record<number, string> = {
    1: "bg-blue-100 text-blue-800",
    2: "bg-purple-100 text-purple-800",
    3: "bg-green-100 text-green-800",
    4: "bg-orange-100 text-orange-800",
  };
  return classes[paperId] || "bg-gray-100 text-gray-800";
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getDaysUntilExam(examDate: Date): number {
  const now = new Date();
  const diff = examDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getNextExamDate(cycle: "january" | "may" | "september", year: number): Date {
  const dates: Record<string, number> = {
    january: 0,
    may: 4,
    september: 8,
  };
  return new Date(year, dates[cycle] || 4, 15);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
