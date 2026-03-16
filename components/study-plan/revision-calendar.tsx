"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface DayData {
  date: string;
  practiced: number;
  due: number;
  overdue: boolean;
}

export function RevisionCalendar() {
  const [monthOffset, setMonthOffset] = useState(0);
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const viewMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthName = viewMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  useEffect(() => {
    loadData();
  }, [monthOffset]);

  async function loadData() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const lastDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
    const startStr = firstDay.toISOString().slice(0, 10);
    const endStr = lastDay.toISOString().slice(0, 10);

    const [practiceRes, srRes] = await Promise.all([
      supabase
        .from("practice_sessions")
        .select("completed_at")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .gte("completed_at", startStr)
        .lte("completed_at", endStr + "T23:59:59"),
      supabase
        .from("spaced_repetition")
        .select("next_review_date")
        .eq("user_id", user.id)
        .gte("next_review_date", startStr)
        .lte("next_review_date", endStr),
    ]);

    const practiced: Record<string, number> = {};
    for (const s of (practiceRes.data ?? []) as any[]) {
      const d = new Date(s.completed_at).toISOString().slice(0, 10);
      practiced[d] = (practiced[d] || 0) + 1;
    }

    const due: Record<string, number> = {};
    for (const s of (srRes.data ?? []) as any[]) {
      due[s.next_review_date] = (due[s.next_review_date] || 0) + 1;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const dayList: DayData[] = [];
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${firstDay.getFullYear()}-${String(firstDay.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      dayList.push({
        date: dateStr,
        practiced: practiced[dateStr] || 0,
        due: due[dateStr] || 0,
        overdue: dateStr < todayStr && (due[dateStr] || 0) > 0 && !(practiced[dateStr]),
      });
    }
    setDays(dayList);
    setLoading(false);
  }

  const firstDayOfWeek = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Revision Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <button onClick={() => setMonthOffset(monthOffset - 1)} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">{monthName}</span>
            <button onClick={() => setMonthOffset(Math.min(monthOffset + 1, 1))} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center"><Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" /></div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-[10px] text-gray-400 font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                let bg = "bg-gray-100";
                if (day.practiced > 0) bg = "bg-green-400";
                else if (day.date === todayStr && day.due > 0) bg = "bg-orange-400";
                else if (day.overdue) bg = "bg-red-300";
                else if (day.due > 0) bg = "bg-blue-200";

                const isToday = day.date === todayStr;

                return (
                  <div
                    key={day.date}
                    className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium relative ${bg} ${
                      isToday ? "ring-2 ring-blue-600" : ""
                    } ${day.practiced > 0 ? "text-white" : "text-gray-600"}`}
                    title={`${day.date}: ${day.practiced} sessions, ${day.due} topics due`}
                  >
                    {parseInt(day.date.slice(-2))}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 justify-center">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-400" /><span className="text-[10px] text-gray-500">Practiced</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-200" /><span className="text-[10px] text-gray-500">Scheduled</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-400" /><span className="text-[10px] text-gray-500">Due Today</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-300" /><span className="text-[10px] text-gray-500">Overdue</span></div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
