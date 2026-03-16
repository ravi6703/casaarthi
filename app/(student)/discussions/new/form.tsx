"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface Props {
  topics: { id: string; name: string; paper_id: number }[];
}

export function NewDiscussionForm({ topics }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [paperId, setPaperId] = useState<number | null>(null);
  const [topicId, setTopicId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const filteredTopics = paperId ? topics.filter((t) => t.paper_id === paperId) : topics;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please sign in"); setSubmitting(false); return; }

    const { data, error } = await (supabase.from("discussions") as any).insert({
      user_id: user.id,
      title: title.trim(),
      body: body.trim(),
      paper_id: paperId,
      topic_id: topicId || null,
    }).select("id").single();

    if (error) {
      toast.error("Failed to post");
      setSubmitting(false);
      return;
    }

    toast.success("Doubt posted!");
    router.push(`/discussions/${data.id}`);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your doubt in one line..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Paper (optional)</label>
              <select
                value={paperId ?? ""}
                onChange={(e) => { setPaperId(e.target.value ? parseInt(e.target.value) : null); setTopicId(""); }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
              >
                <option value="">All Papers</option>
                <option value="1">P1 - Accounts</option>
                <option value="2">P2 - Laws</option>
                <option value="3">P3 - Maths</option>
                <option value="4">P4 - Economics</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Topic (optional)</label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
              >
                <option value="">Select topic</option>
                {filteredTopics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe your doubt in detail. Include any specific section, formula, or concept you're struggling with..."
              className="w-full min-h-[150px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !title.trim() || !body.trim()}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Post Doubt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
