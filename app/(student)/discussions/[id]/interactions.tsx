"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Reply {
  id: string;
  body: string;
  user_id: string;
  is_accepted: boolean;
  upvote_count: number;
  created_at: string;
}

interface Props {
  discussionId: string;
  replies: Reply[];
  userId: string;
  isAuthor: boolean;
}

export function DiscussionInteractions({ discussionId, replies, userId, isAuthor }: Props) {
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);

    const supabase = createClient();
    const { error } = await (supabase.from("discussion_replies") as any).insert({
      discussion_id: discussionId,
      user_id: userId,
      body: replyText.trim(),
    });

    if (error) {
      toast.error("Failed to post reply");
      setSubmitting(false);
      return;
    }

    // Update reply count
    await (supabase.rpc as any)("increment_reply_count", { p_discussion_id: discussionId }).catch(() => {
      // Fallback: handled server-side
    });

    setReplyText("");
    setSubmitting(false);
    toast.success("Reply posted!");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
        {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
      </h2>

      {replies.map((reply) => (
        <Card key={reply.id} className={reply.is_accepted ? "border-green-300 bg-green-50" : ""}>
          <CardContent className="p-4">
            {reply.is_accepted && (
              <span className="text-xs font-bold text-green-700 mb-2 block">Accepted Answer</span>
            )}
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{reply.body}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-gray-400">
                {new Date(reply.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
              {reply.user_id === userId && (
                <span className="text-[10px] text-[var(--primary)]">You</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {replies.length === 0 && (
        <div className="text-center py-6">
          <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No replies yet. Be the first to help!</p>
        </div>
      )}

      {/* Reply form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleReply} className="space-y-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] outline-none resize-y"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting || !replyText.trim()} size="sm">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Reply
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
