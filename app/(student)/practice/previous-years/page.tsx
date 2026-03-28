import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Calendar } from "lucide-react";

export const metadata = { title: "Previous Year Papers" };

const PAPERS = [
  { id: 1, code: "P1", name: "Accounts", emoji: "📊" },
  { id: 2, code: "P2", name: "Laws", emoji: "⚖️" },
  { id: 3, code: "P3", name: "Maths", emoji: "🔢" },
  { id: 4, code: "P4", name: "Economics", emoji: "📈" },
];

export default async function PreviousYearsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Get questions with source_type = icai_past grouped by year and paper
  const { data: pyqData } = await supabase
    .from("questions")
    .select("id, paper_id, source_year")
    .eq("status", "approved")
    .eq("source_type", "icai_past")
    .order("source_year", { ascending: false });

  // Group by year → paper → count
  const yearPaperCounts: Record<number, Record<number, number>> = {};
  for (const q of (pyqData as any[]) ?? []) {
    if (!q.source_year) continue;
    if (!yearPaperCounts[q.source_year]) yearPaperCounts[q.source_year] = {};
    yearPaperCounts[q.source_year][q.paper_id] = (yearPaperCounts[q.source_year][q.paper_id] || 0) + 1;
  }

  const years = Object.keys(yearPaperCounts).map(Number).sort((a, b) => b - a);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <Link href="/practice" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Previous Year Papers</h1>
          <p className="text-gray-500 mt-1">Practice with actual ICAI exam questions</p>
        </div>
      </div>

      {years.length > 0 ? (
        <div className="space-y-4">
          {years.map((year) => (
            <Card key={year}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--sage-light)] flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{year} Exam</h2>
                    <p className="text-xs text-gray-500">
                      {Object.values(yearPaperCounts[year]).reduce((s, c) => s + c, 0)} questions available
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PAPERS.map((paper) => {
                    const count = yearPaperCounts[year]?.[paper.id] ?? 0;
                    if (count === 0) return null;
                    return (
                      <Link
                        key={paper.id}
                        href={`/practice/session?type=topic&sourceType=icai_past&sourceYear=${year}&paperId=${paper.id}`}
                      >
                        <div className="p-3 rounded-xl border border-gray-200 hover:border-[var(--border)]00 hover:bg-[var(--sage-light)] transition-all text-center cursor-pointer">
                          <span className="text-2xl">{paper.emoji}</span>
                          <div className="text-xs font-bold text-gray-900 mt-1">{paper.code}</div>
                          <div className="text-[10px] text-gray-500">{count} questions</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Previous year papers are being added. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
