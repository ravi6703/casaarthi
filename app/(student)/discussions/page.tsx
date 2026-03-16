import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, CheckCircle2, ArrowUp, Clock } from "lucide-react";

export const metadata = { title: "Doubts" };

const PAPER_LABELS: Record<number, string> = { 1: "P1 - Accounts", 2: "P2 - Laws", 3: "P3 - Maths", 4: "P4 - Economics" };

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: Promise<{ paper?: string; page?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const paperId = params.paper ? parseInt(params.paper) : null;
  const page = parseInt(params.page ?? "1");
  const pageSize = 15;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("discussions")
    .select("*, topics(name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (paperId) {
    query = query.eq("paper_id", paperId);
  }

  const { data: discussions, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / pageSize);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doubts & Discussions</h1>
          <p className="text-gray-500 mt-1">Ask questions, share knowledge, help each other</p>
        </div>
        <Link href="/discussions/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Ask a Doubt
          </Button>
        </Link>
      </div>

      {/* Paper filters */}
      <div className="flex flex-wrap gap-2">
        <Link href="/discussions">
          <Badge variant={!paperId ? "default" : "secondary"} className="cursor-pointer">All Papers</Badge>
        </Link>
        {[1, 2, 3, 4].map((id) => (
          <Link key={id} href={`/discussions?paper=${id}`}>
            <Badge variant={paperId === id ? "default" : "secondary"} className="cursor-pointer">
              P{id}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Discussions list */}
      <div className="space-y-3">
        {(discussions as any[] ?? []).map((d: any) => (
          <Link key={d.id} href={`/discussions/${d.id}`}>
            <Card className="hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 text-center min-w-[50px]">
                    <ArrowUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">{d.upvote_count}</span>
                    <span className="text-[10px] text-gray-400">{d.reply_count} replies</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {d.is_resolved && <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />}
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">{d.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{d.body}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {d.paper_id && (
                        <Badge variant="secondary" className="text-[10px]">P{d.paper_id}</Badge>
                      )}
                      {d.topics?.name && (
                        <Badge variant="secondary" className="text-[10px]">{d.topics.name}</Badge>
                      )}
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {(!discussions || discussions.length === 0) && (
          <div className="text-center py-12">
            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No discussions yet. Be the first to ask a doubt!</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link href={`/discussions?${paperId ? `paper=${paperId}&` : ""}page=${page - 1}`}>
              <Button variant="outline" size="sm">Previous</Button>
            </Link>
          )}
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`/discussions?${paperId ? `paper=${paperId}&` : ""}page=${page + 1}`}>
              <Button variant="outline" size="sm">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
