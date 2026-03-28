"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, Target } from "lucide-react";

/* ── colour tokens ─────────────────────────────────────── */
const BLUE   = "#3b82f6";
const GREEN  = "#22c55e";
const YELLOW = "#eab308";
const ORANGE = "#f97316";
const RED    = "#ef4444";
const PURPLE = "#8b5cf6";

const MASTERY_COLORS: Record<string, string> = {
  Strong:  GREEN,
  Good:    BLUE,
  Average: YELLOW,
  Weak:    RED,
};

/* ── types ─────────────────────────────────────────────── */
interface WeeklyDatum   { day: string; questions: number }
interface AccuracyDatum { session: string; accuracy: number }
interface PaperDatum    { paper: string; score: number; fill: string }
interface MasteryDatum  { name: string; value: number }

interface AnalyticsChartsProps {
  weeklyPractice:   WeeklyDatum[];
  accuracyTrend:    AccuracyDatum[];
  paperPerformance: PaperDatum[];
  totalHours:       number;
  totalSessions:    number;
  topicMastery:     MasteryDatum[];
}

/* ── component ─────────────────────────────────────────── */
export function AnalyticsCharts({
  weeklyPractice,
  accuracyTrend,
  paperPerformance,
  totalHours,
  totalSessions,
  topicMastery,
}: AnalyticsChartsProps) {
  const totalTopics = topicMastery.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      {/* ── Top stats row ───────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BarChart3 className="h-5 w-5 text-[var(--primary)]" />}
          label="Total Sessions"
          value={String(totalSessions)}
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-purple-500" />}
          label="Hours Practiced"
          value={totalHours.toFixed(1)}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          label="Avg Accuracy"
          value={
            accuracyTrend.length > 0
              ? `${Math.round(
                  accuracyTrend.reduce((s, d) => s + d.accuracy, 0) /
                    accuracyTrend.length
                )}%`
              : "—"
          }
        />
        <StatCard
          icon={<Target className="h-5 w-5 text-orange-500" />}
          label="Topics Covered"
          value={String(totalTopics)}
        />
      </div>

      {/* ── Row 1: Weekly practice + Accuracy trend ───── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly practice bar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[var(--primary)]" />
              Weekly Practice Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyPractice.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={weeklyPractice} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="questions" fill={BLUE} radius={[4, 4, 0, 0]} name="Questions" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="No practice data for the last 7 days" />
            )}
          </CardContent>
        </Card>

        {/* Accuracy trend line chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Accuracy Trend (Last 10 Sessions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {accuracyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={accuracyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="session" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke={GREEN}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Accuracy"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="Complete some sessions to see your accuracy trend" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Paper performance + Topic mastery ── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Paper-wise performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              Paper-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paperPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={paperPerformance} barSize={40} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="paper" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip formatter={(v) => `${v}/100`} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} name="Score">
                    {paperPerformance.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState text="No paper scores available yet" />
            )}
          </CardContent>
        </Card>

        {/* Topic mastery donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Topic Mastery Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalTopics > 0 ? (
              <div className="flex items-center justify-center gap-6">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={topicMastery}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {topicMastery.map((entry, i) => (
                        <Cell key={i} fill={MASTERY_COLORS[entry.name] ?? PURPLE} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {topicMastery.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: MASTERY_COLORS[entry.name] ?? PURPLE }}
                      />
                      <span className="text-gray-700">{entry.name}</span>
                      <span className="text-gray-400 ml-auto">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState text="Practice more topics to see mastery distribution" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ── helpers ───────────────────────────────────────────── */
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">{icon}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center h-[260px] text-sm text-gray-400">
      {text}
    </div>
  );
}
