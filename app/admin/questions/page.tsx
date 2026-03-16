import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, CheckCircle, Clock, Archive } from "lucide-react";
import { QuestionFilters } from "@/components/admin/question-filters";
import { QuestionRow } from "@/components/admin/question-row";

export const metadata = { title: "Questions — Admin" };

interface SearchParams {
  paper?: string;
  topic?: string;
  difficulty?: string;
  status?: string;
  page?: string;
  [key: string]: string | undefined;
}

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const limit = 25;
  const offset = (page - 1) * limit;

  // Build query
  let query = supabase
    .from("questions")
    .select("id, question_text, difficulty, status, paper_id, created_at, topics(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (params.paper) query = query.eq("paper_id", Number(params.paper));
  if (params.difficulty) query = query.eq("difficulty", params.difficulty as "easy" | "medium" | "hard");
  if (params.status) query = query.eq("status", params.status as "pending_review" | "approved" | "retired");
  if (params.topic) query = query.eq("topic_id", params.topic);

  const { data: questionsRaw, count } = await query;
  const questions = questionsRaw as Array<{
    id: string; question_text: string; difficulty: string;
    status: string; paper_id: number; created_at: string;
    topics?: { name: string } | null;
  }> | null;

  // Fetch stats
  const [pendingRes, approvedRes, retiredRes] = await Promise.all([
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "pending_review"),
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("questions").select("id", { count: "exact", head: true }).eq("status", "retired"),
  ]);

  const papers = [
    { id: 1, name: "P1 – Accounts" },
    { id: 2, name: "P2 – Laws" },
    { id: 3, name: "P3 – Maths" },
    { id: 4, name: "P4 – Economics" },
  ];

  const totalPages = Math.ceil((count ?? 0) / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-500 text-sm mt-1">{count?.toLocaleString()} questions in database</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/questions/bulk">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
          </Link>
          <Link href="/admin/questions/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Review", count: pendingRes.count ?? 0, icon: <Clock className="h-5 w-5 text-yellow-500" />, color: "yellow" },
          { label: "Approved", count: approvedRes.count ?? 0, icon: <CheckCircle className="h-5 w-5 text-green-500" />, color: "green" },
          { label: "Retired", count: retiredRes.count ?? 0, icon: <Archive className="h-5 w-5 text-gray-400" />, color: "gray" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              {s.icon}
              <div>
                <div className="text-2xl font-bold text-gray-900">{s.count.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <QuestionFilters papers={papers} currentParams={params} />

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-500">
            Showing {questions?.length ?? 0} of {count?.toLocaleString()} questions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {questions && questions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {questions.map((q) => (
                <QuestionRow key={q.id} question={q as any} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">No questions found</div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Page {page} of {totalPages}</div>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?${new URLSearchParams({ ...params, page: String(page - 1) })}`}>
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            {page < totalPages && (
              <Link href={`?${new URLSearchParams({ ...params, page: String(page + 1) })}`}>
                <Button variant="outline" size="sm">Next</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
