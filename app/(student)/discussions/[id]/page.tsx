import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { DiscussionInteractions } from "./interactions";

export default async function DiscussionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: discussion } = await supabase
    .from("discussions")
    .select("*, topics(name)")
    .eq("id", id)
    .single();

  if (!discussion) notFound();

  const { data: replies } = await supabase
    .from("discussion_replies")
    .select("*")
    .eq("discussion_id", id)
    .order("created_at");

  const d = discussion as any;

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/discussions" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-sm text-gray-400">Back to Discussions</span>
      </div>

      {/* Discussion */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-2 mb-2">
            {d.is_resolved && <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />}
            <h1 className="text-lg font-bold text-gray-900">{d.title}</h1>
          </div>
          <div className="flex items-center gap-2 mb-4">
            {d.paper_id && <Badge variant="secondary" className="text-xs">P{d.paper_id}</Badge>}
            {d.topics?.name && <Badge variant="secondary" className="text-xs">{d.topics.name}</Badge>}
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{d.body}</p>
        </CardContent>
      </Card>

      {/* Replies and interaction form */}
      <DiscussionInteractions
        discussionId={id}
        replies={(replies as any[]) ?? []}
        userId={user.id}
        isAuthor={d.user_id === user.id}
      />
    </div>
  );
}
