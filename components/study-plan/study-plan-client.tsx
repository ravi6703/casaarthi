"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Target, BookOpen, CheckCircle2, Calendar } from "lucide-react";

interface TopicItem {
  id: string;
  name: string;
  paperId: number;
  accuracy: number | null;
  attempted: number;
  daysSinceLastPractice: number | null;
  priority: "critical" | "high" | "medium" | "low" | "untested";
}

interface Props {
  criticalTopics: TopicItem[];
  highTopics: TopicItem[];
  untestedTopics: TopicItem[];
  mediumTopics: TopicItem[];
  papers: { id: number; name: string; short: string; emoji: string }[];
  daysRemaining: number;
  phase: string;
}

const PRIORITY_CONFIG = {
  critical: { label: "Critical — Below 30%", icon: AlertTriangle, color: "red", bg: "bg-red-50 border-red-200", badge: "destructive" as const },
  high: { label: "High Priority — Below 50%", icon: Target, color: "orange", bg: "bg-orange-50 border-orange-200", badge: "warning" as const },
  untested: { label: "Not Yet Tested", icon: BookOpen, color: "gray", bg: "bg-gray-50 border-gray-200", badge: "secondary" as const },
  medium: { label: "Needs Improvement — Below 70%", icon: Calendar, color: "yellow", bg: "bg-yellow-50 border-yellow-200", badge: "secondary" as const },
};

export function StudyPlanClient({ criticalTopics, highTopics, untestedTopics, mediumTopics, papers, daysRemaining, phase }: Props) {
  const getPaperName = (paperId: number) => papers.find((p) => p.id === paperId)?.short ?? "";

  // Generate today's study plan
  const todayTopics: TopicItem[] = [];
  // Pick 2 critical, 2 high, 1 untested for today
  todayTopics.push(...criticalTopics.slice(0, 2));
  todayTopics.push(...highTopics.slice(0, 2));
  todayTopics.push(...untestedTopics.slice(0, 1));
  if (todayTopics.length < 3) {
    todayTopics.push(...mediumTopics.slice(0, 3 - todayTopics.length));
  }

  // Generate weekly schedule
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const allPriorityTopics = [...criticalTopics, ...highTopics, ...untestedTopics, ...mediumTopics];
  const weeklyPlan = weekDays.map((day, i) => {
    if (day === "Sunday") return { day, activity: "Rest & Light Revision", topics: [] };
    if (day === "Saturday" && phase !== "revision") return { day, activity: "Full Mock Test", topics: [] };

    const startIdx = (i * 3) % Math.max(allPriorityTopics.length, 1);
    const dayTopics = allPriorityTopics.slice(startIdx, startIdx + 3);
    if (dayTopics.length === 0 && allPriorityTopics.length > 0) {
      return { day, activity: "Practice", topics: allPriorityTopics.slice(0, 3) };
    }
    return { day, activity: "Practice", topics: dayTopics };
  });

  return (
    <div className="space-y-6">
      {/* Today's Focus */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Today&apos;s Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayTopics.length > 0 ? (
            <div className="space-y-3">
              {todayTopics.map((topic) => (
                <Link key={topic.id} href={`/practice/session?type=topic&topicId=${topic.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Badge variant={(PRIORITY_CONFIG as Record<string, any>)[topic.priority]?.badge ?? "secondary"} className="text-xs">
                        {topic.priority === "untested" ? "New" : `${topic.accuracy}%`}
                      </Badge>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{topic.name}</div>
                        <div className="text-xs text-gray-500">{getPaperName(topic.paperId)} · {topic.attempted} attempted</div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs">Practice →</Button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="font-medium text-gray-900">All topics are above 70%!</p>
              <p className="text-sm">Focus on mock tests and revision.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader><CardTitle>Weekly Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {weeklyPlan.map((day) => (
              <div key={day.day} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-24 flex-shrink-0">
                  <div className="text-sm font-medium text-gray-900">{day.day}</div>
                </div>
                <div className="flex-1">
                  {day.activity === "Full Mock Test" ? (
                    <Badge variant="secondary" className="text-xs">📝 Full Mock Test</Badge>
                  ) : day.activity === "Rest & Light Revision" ? (
                    <Badge variant="secondary" className="text-xs">😌 Rest & Light Revision</Badge>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {day.topics.map((t) => (
                        <span key={t.id} className={`text-xs px-2 py-1 rounded-md ${
                          t.priority === "critical" ? "bg-red-100 text-red-700" :
                          t.priority === "high" ? "bg-orange-100 text-orange-700" :
                          t.priority === "untested" ? "bg-gray-100 text-gray-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {getPaperName(t.paperId)}: {t.name.length > 20 ? t.name.slice(0, 18) + "…" : t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Sections */}
      {([
        { key: "critical" as const, topics: criticalTopics },
        { key: "high" as const, topics: highTopics },
        { key: "untested" as const, topics: untestedTopics },
        { key: "medium" as const, topics: mediumTopics },
      ]).filter(({ topics }) => topics.length > 0).map(({ key, topics }) => {
        const config = PRIORITY_CONFIG[key];
        const Icon = config.icon;
        return (
          <Card key={key} className={`border ${config.bg}`}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Icon className={`h-4 w-4 text-${config.color}-600`} />
                {config.label} ({topics.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {topics.map((topic) => (
                  <Link key={topic.id} href={`/practice/session?type=topic&topicId=${topic.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{topic.name}</div>
                        <div className="text-xs text-gray-500">
                          {getPaperName(topic.paperId)} · {topic.attempted > 0 ? `${topic.attempted} attempted` : "Not started"}
                          {topic.daysSinceLastPractice !== null && topic.daysSinceLastPractice >= 7 && (
                            <span className="text-orange-500 ml-1">· {topic.daysSinceLastPractice}d ago</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {topic.accuracy !== null ? (
                          <span className={`text-sm font-bold ${
                            topic.accuracy >= 70 ? "text-green-600" : topic.accuracy >= 40 ? "text-yellow-600" : "text-red-600"
                          }`}>{topic.accuracy}%</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
