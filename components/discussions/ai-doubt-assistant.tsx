"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Loader2, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

export function AIDoubtAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/ask-doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAnswer(data.answer);
    } catch (err: any) {
      toast.error(err.message || "Failed to get answer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="pb-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          AI Doubt Resolver — Get Instant Answers
          {expanded ? <ChevronUp className="h-4 w-4 ml-auto text-gray-400" /> : <ChevronDown className="h-4 w-4 ml-auto text-gray-400" />}
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent>
          <p className="text-xs text-gray-500 mb-3">
            Ask any CA Foundation doubt and get an AI-powered answer instantly. For complex doubts, post in the community forum below.
          </p>
          <div className="flex gap-2">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What is the difference between provisions and reserves in accounting?"
              className="flex-1 text-sm border border-gray-200 rounded-lg p-3 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); }}}
            />
          </div>
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Send className="h-3 w-3 mr-1" />}
              {loading ? "Thinking..." : "Ask AI"}
            </Button>
          </div>

          {answer && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">AI Answer</span>
              </div>
              <div className="text-sm text-gray-700 prose prose-sm max-w-none whitespace-pre-wrap">{answer}</div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                <MessageCircle className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">Not satisfied? Post your doubt in the community forum for peer help.</span>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
