"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, AlertCircle, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

interface DayData {
  date: string;
  dayName: string;
  dayNum: number;
  practiced: number;
  dueTopics: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

export function RevisionCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [stats, setStats] = useState({ totalSessions: 0, avgDaily: 0, streak: 0, dueCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeek() {
      setLoading(true);
      const supabase = createClient();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate week start (Monday)
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);

      const days: DayData[] = [];
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        const isToday = dateStr === today.toISOString().slice(0, 10);

        days.push({
          date: dateStr,
          dayName: dayNames[i],
          dayNum: d.getDate(),
          practiced: 0,
          dueTopics: 0,
          isToday,
          isPast: d < today && !isToday,
          isFuture: d > today,
        });
      }

      // Fetch practice sessions for the week
      const weekStart = days[0].date;
      const weekEnd = days[6].date + "T23:59:59";

      const [sessionsRes, dueRes] = await Promise.all([
        supabase
          .from("practice_sessions")
          .select("started_at, total_questions")
          .eq("status", "completed")
          .gte("started_at", weekStart)
          .lte("started_at", weekEnd),
        supabase
          .from("spaced_repetition")
          .select("next_review_date")
          .gte("next_review_date", weekStart)
          .lte("next_review_date", weekEnd),
      ]);

      const sessions = (sessionsRes.data as any[]) ?? [];
      const dueTopics = (dueRes.data as any[]) ?? [];

      // Map sessions to days
      sessions.forEach((s: any) => {
        const sDate = s.started_at.slice(0, 10);
        const day = days.find(d => d.date === sDate);
        if (day) day.practiced += 1;
      });

      dueTopics.forEach((d: any) => {
        const dDate = d.next_review_date;
        const day = days.find(dd => dd.date === dDate);
        if (day) day.dueTopics += 1;
      });

      // Calculate stats
      const totalSessions = sessions.length;
      const practicedDays = days.filter(d => d.practiced > 0 && (d.isPast || d.isToday)).length;
      const pastDays = days.filter(d => d.isPast || d.isToday).length;
      const avgDaily = pastDays > 0 ? Math.round(totalSessions / pastDays * 10) / 10 : 0;

      // Calculate streak
      let streak = 0;
      const sortedDays = [...days].filter(d => d.isPast || d.isToday).reverse();
      for (const d of sortedDays) {
        if (d.practiced > 0) streak++;
        else break;
      }

      const todayDue = days.find(d => d.isToday)?.dueTopics ?? 0;

      setWeekData(days);
      setStats({ totalSessions, avgDaily, streak, dueCount: todayDue });
      setLoading(false);
    }
    fetchWeek();
  }, [weekOffset]);

  const weekLabel = weekData.length > 0
    ? `${new Date(weekData[0].date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} — ${new Date(weekData[6].date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`
    : "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Weekly Progress
          </CardTitle>
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekOffset(o => o - 1)} className="p-1 rounded-md hover:bg-gray-100">
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </button>
            <span className="text-sm text-gray-600 min-w-[140px] text-center">{weekLabel}</span>
            <button onClick={() => setWeekOffset(o => Math.min(o + 1, 1))} className="p-1 rounded-md hover:bg-gray-100" disabled={weekOffset >= 1}>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center text-gray-400 text-sm">Loading...</div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-700">{stats.totalSessions}</div>
                <div className="text-[10px] text-blue-600">Sessions</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-700">{stats.avgDaily}</div>
                <div className="text-[10px] text-green-600">Avg/Day</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-700">{stats.streak}</div>
                <div className="text-[10px] text-orange-600">Day Streak</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <div className="text-lg font-bold text-red-700">{stats.dueCount}</div>
                <div className="text-[10px] text-red-600">Due Today</div>
              </div>
            </div>

            {/* Daily Progress Bars */}
            <div className="space-y-2">
              {weekData.map((day) => {
                const maxSessions = Math.max(...weekData.map(d => d.practiced), 1);
                const barWidth = day.practiced > 0 ? Math.max((day.practiced / maxSessions) * 100, 8) : 0;

                return (
                  <div key={day.date} className={`flex items-center gap-3 p-2 rounded-lg ${day.isToday ? "bg-blue-50 border border-blue-200" : ""}`}>
                    <div className="w-10 text-center flex-shrink-0">
                      <div className={`text-xs font-medium ${day.isToday ? "text-blue-700" : "text-gray-500"}`}>{day.dayName}</div>
                      <div className={`text-sm font-bold ${day.isToday ? "text-blue-800" : "text-gray-700"}`}>{day.dayNum}</div>
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                      {/* Progress bar */}
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden relative">
                        {barWidth > 0 && (
                          <div
                            className={`h-full rounded-full transition-all duration-500 flex items-center px-2 ${
                              day.isToday ? "bg-blue-500" : "bg-green-500"
                            }`}
                            style={{ width: `${barWidth}%` }}
                          >
                            <span className="text-[10px] text-white font-medium whitespace-nowrap">
                              {day.practiced} session{day.practiced !== 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                        {barWidth === 0 && day.isPast && (
                          <div className="absolute inset-0 flex items-center px-3">
                            <span className="text-[10px] text-gray-400">No practice</span>
                          </div>
                        )}
                        {barWidth === 0 && day.isFuture && (
                          <div className="absolute inset-0 flex items-center px-3">
                            <span className="text-[10px] text-gray-300">Upcoming</span>
                          </div>
                        )}
                        {barWidth === 0 && day.isToday && day.practiced === 0 && (
                          <div className="absolute inset-0 flex items-center px-3">
                            <span className="text-[10px] text-blue-400">Start today&apos;s session!</span>
                          </div>
                        )}
                      </div>

                      {/* Status icons */}
                      <div className="flex items-center gap-1 w-16 justify-end flex-shrink-0">
                        {day.practiced > 0 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {day.dueTopics > 0 && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-orange-100 text-orange-700">
                            {day.dueTopics} due
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <div className="w-3 h-3 rounded-sm bg-green-500" /> Completed
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <div className="w-3 h-3 rounded-sm bg-blue-500" /> Today
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                <div className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-300" /> Topics Due
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
