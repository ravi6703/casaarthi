"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";

interface DueTopic {
  topic_id: string;
  next_review_date: string;
  interval_days: number;
  topics: { name: string; paper_id: number };
}

export function RevisionDue() {
  const [dueTopics, setDueTopics] = useState<DueTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spaced-repetition")
      .then((r) => r.json())
      .then((data) => {
        setDueTopics(data.dueTopics ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (dueTopics.length === 0) return null;

  const PAPER_LABELS: Record<number, string> = { 1: "P1", 2: "P2", 3: "P3", 4: "P4" };

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-bold text-orange-900">Due for Revision</span>
            <Badge variant="secondary" className="text-xs">{dueTopics.length}</Badge>
          </div>
        </div>
        <div className="space-y-2">
          {dueTopics.slice(0, 5).map((topic) => {
            const daysOverdue = Math.floor(
              (Date.now() - new Date(topic.next_review_date).getTime()) / 86400000
            );
            return (
              <div key={topic.topic_id} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                    {PAPER_LABELS[topic.topics?.paper_id] ?? ""}
                  </Badge>
                  <span className="text-sm text-gray-800 truncate">{topic.topics?.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {daysOverdue > 0 && (
                    <span className="text-[10px] text-orange-600 font-medium">{daysOverdue}d overdue</span>
                  )}
                  <Link href={`/practice/session?type=revision&topicId=${topic.topic_id}`}>
                    <Button size="sm" variant="ghost" className="text-xs h-7 text-orange-700 hover:bg-orange-100">
                      Review
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
          {dueTopics.length > 5 && (
            <p className="text-xs text-orange-600 text-center">+{dueTopics.length - 5} more topics due</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
