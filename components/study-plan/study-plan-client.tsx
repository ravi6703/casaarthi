"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Target, BookOpen, CheckCircle2, Calendar, Zap, Clock, Flame, Rocket } from "lucide-react";

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
  totalTopics: number;
}

const PRIORITY_CONFIG = {
  critical: { label: "Critical — Below 30%", icon: AlertTriangle, color: "red", bg: "bg-red-50 border-red-200", badge: "destructive" as const },
  high: { label: "High Priority — Below 50%", icon: Target, color: "orange", bg: "bg-orange-50 border-orange-200", badge: "warning" as const },
  untested: { label: "Not Yet Tested", icon: BookOpen, color: "gray", bg: "bg-gray-50 border-gray-200", badge: "secondary" as const },
  medium: { label: "Needs Improvement — Below 70%", icon: Calendar, color: "yellow", bg: "bg-yellow-50 border-yellow-200", badge: "secondary" as const },
};

const PACE_OPTIONS = [
  {
    id: "relaxed",
    label: "Relaxed",
    days: 120,
    icon: Clock,
    emoji: "🐢",
    description: "2-3 hrs/day, steady pace",
    dailyQuestions: 20,
    topicsPerDay: 2,
    mocksPerWeek: 0,
    studyDays: 5,
    color: "green",
    bg: "bg-green-50 border-green-300",
    activeBg: "bg-green-100 border-green-500 ring-2 ring-green-500",
  },
  {
    id: "balanced",
    label: "Balanced",
    days: 90,
    icon: Zap,
    emoji: "🎯",
    description: "3-4 hrs/day, recommended",
    dailyQuestions: 35,
    topicsPerDay: 3,
    mocksPerWeek: 1,
    studyDays: 6,
    color: "blue",
    bg: "bg-blue-50 border-blue-300",
    activeBg: "bg-blue-100 border-blue-500 ring-2 ring-blue-500",
  },
  {
    id: "intensive",
    label: "Intensive",
    days: 60,
    icon: Flame,
    emoji: "🔥",
    description: "5-6 hrs/day, fast track",
    dailyQuestions: 50,
    topicsPerDay: 4,
    mocksPerWeek: 2,
    studyDays: 6,
    color: "orange",
    bg: "bg-orange-50 border-orange-300",
    activeBg: "bg-orange-100 border-orange-500 ring-2 ring-orange-500",
  },
  {
    id: "crash",
    label: "Crash Course",
    days: 30,
    icon: Rocket,
    emoji: "🚀",
    description: "8+ hrs/day, last-minute prep",
    dailyQuestions: 80,
    topicsPerDay: 6,
    mocksPerWeek: 4,
    studyDays: 7,
    color: "red",
    bg: "bg-red-50 border-red-300",
    activeBg: "bg-red-100 border-red-500 ring-2 ring-red-500",
  },
];

export function StudyPlanClient({ criticalTopics, highTopics, untestedTopics, mediumTopics, papers, daysRemaining, phase, totalTopics }: Props) {
  // Auto-select pace based on days remaining
  const getDefaultPace = () => {
    if (daysRemaining <= 30) return "crash";
    if (daysRemaining <= 60) return "intensive";
    if (daysRemaining <= 90) return "balanced";
    return "relaxed";
  };

  const [selectedPace, setSelectedPace] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ca_study_pace") || getDefaultPace();
    }
    return getDefaultPace();
  });

  const pace = PACE_OPTIONS.find((p) => p.id === selectedPace) || PACE_OPTIONS[1];
  const getPaperName = (paperId: number) => papers.find((p) => p.id === paperId)?.short ?? "";

  const handlePaceChange = (paceId: string) => {
    setSelectedPace(paceId);
    localStorage.setItem("ca_study_pace", paceId);
  };

  // Generate today's study plan based on pace
  const todayTopics: TopicItem[] = [];
  const topicsToday = pace.topicsPerDay;
  // Distribute based on priority: critical first, then high, untested, medium
  const criticalCount = Math.min(Math.ceil(topicsToday * 0.4), criticalTopics.length);
  const highCount = Math.min(Math.ceil(topicsToday * 0.3), highTopics.length);
  const untestedCount = Math.min(Math.ceil(topicsToday * 0.2), untestedTopics.length);
  const mediumCount = Math.min(topicsToday - criticalCount - highCount - untestedCount, mediumTopics.length);

  todayTopics.push(...criticalTopics.slice(0, criticalCount));
  todayTopics.push(...highTopics.slice(0, highCount));
  todayTopics.push(...untestedTopics.slice(0, untestedCount));
  todayTopics.push(...mediumTopics.slice(0, Math.max(mediumCount, 0)));

  // Fill remaining slots if we still have room
  if (todayTopics.length < topicsToday) {
    const remaining = topicsToday - todayTopics.length;
    const allRemaining = [...criticalTopics, ...highTopics, ...untestedTopics, ...mediumTopics]
      .filter((t) => !todayTopics.includes(t));
    todayTopics.push(...allRemaining.slice(0, remaining));
  }

  // Generate weekly schedule based on pace
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const allPriorityTopics = [...criticalTopics, ...highTopics, ...untestedTopics, ...mediumTopics];

  const weeklyPlan = weekDays.map((day, i) => {
    // Rest days based on pace
    if (day === "Sunday" && pace.studyDays < 7) return { day, activity: "Rest & Light Revision", topics: [] as TopicItem[] };
    if (day === "Saturday" && pace.studyDays < 6) return { day, activity: "Rest", topics: [] as TopicItem[] };

    // Mock test days
    if (pace.mocksPerWeek >= 4 && day === "Sunday") return { day, activity: "Full Mock Test", topics: [] as TopicItem[] };
    if (pace.mocksPerWeek >= 2 && day === "Wednesday") return { day, activity: "Full Mock Test", topics: [] as TopicItem[] };
    if (pace.mocksPerWeek >= 1 && day === "Saturday") return { day, activity: "Full Mock Test", topics: [] as TopicItem[] };

    const startIdx = (i * pace.topicsPerDay) % Math.max(allPriorityTopics.length, 1);
    const dayTopics = allPriorityTopics.slice(startIdx, startIdx + pace.topicsPerDay);
    if (dayTopics.length === 0 && allPriorityTopics.length > 0) {
      return { day, activity: "Practice", topics: allPriorityTopics.slice(0, pace.topicsPerDay) };
    }
    return { day, activity: "Practice", topics: dayTopics };
  });

  // Calculate completion estimate
  const topicsToFinish = criticalTopics.length + highTopics.length + untestedTopics.length + mediumTopics.length;
  const estimatedDays = Math.ceil(topicsToFinish / Math.max(pace.topicsPerDay, 1));
  const completionFeasible = estimatedDays <= daysRemaining;

  return (
    <div className="space-y-6">
      {/* Pace Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Choose Your Study Pace
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">Select a pace that fits your schedule. Your plan will adjust automatically.</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {PACE_OPTIONS.map((option) => {
              const isSelected = selectedPace === option.id;
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handlePaceChange(option.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected ? option.activeBg : `${option.bg} hover:shadow-md`
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className={`h-4 w-4 text-${option.color}-600`} />
                    </div>
                  )}
                  <div className="text-2xl mb-2">{option.emoji}</div>
                  <div className="font-bold text-gray-900 text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                  <div className="text-xs font-medium text-gray-700 mt-2">{option.days} days plan</div>
                </button>
              );
            })}
          </div>

          {/* Plan Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{pace.emoji}</span>
              <span className="font-semibold text-gray-900">{pace.label} Plan Summary</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xl font-bold text-blue-600">{pace.dailyQuestions}</div>
                <div className="text-xs text-gray-500">Questions/day</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xl font-bold text-purple-600">{pace.topicsPerDay}</div>
                <div className="text-xs text-gray-500">Topics/day</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xl font-bold text-orange-600">{pace.mocksPerWeek}</div>
                <div className="text-xs text-gray-500">Mocks/week</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-xl font-bold text-green-600">{pace.studyDays}</div>
                <div className="text-xs text-gray-500">Days/week</div>
              </div>
            </div>

            {/* Feasibility indicator */}
            <div className={`mt-3 p-3 rounded-lg text-sm flex items-center gap-2 ${
              completionFeasible ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
            }`}>
              {completionFeasible ? (
                <>
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>At this pace, you can cover all {topicsToFinish} pending topics in ~{estimatedDays} days. You have {daysRemaining} days — enough time!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>At this pace, you need ~{estimatedDays} days but have {daysRemaining} days. Consider a faster pace or prioritise critical topics.</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Focus */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Today&apos;s Focus — {pace.topicsPerDay} Topics, {pace.dailyQuestions} Questions
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
        <CardHeader><CardTitle>Weekly Schedule — {pace.label} Pace</CardTitle></CardHeader>
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
                  ) : day.activity === "Rest" ? (
                    <Badge variant="secondary" className="text-xs">😴 Rest Day</Badge>
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
