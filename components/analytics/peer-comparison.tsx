"use client";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface Props {
  percentile: number;
  totalStudents: number;
  userScore: number;
}

export function PeerComparison({ percentile, totalStudents, userScore }: Props) {
  if (totalStudents < 2) return null;

  const getMessage = () => {
    if (percentile >= 90) return "Outstanding! You're among the top performers!";
    if (percentile >= 70) return "Great work! Keep pushing to reach the top!";
    if (percentile >= 50) return "You're above average. More practice will boost your rank!";
    if (percentile >= 30) return "Keep going! Consistent practice will improve your ranking.";
    return "Focus on weak topics to climb up the ranks!";
  };

  return (
    <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900">Peer Comparison</p>
            <p className="text-xs text-indigo-600">Based on {totalStudents} students</p>
          </div>
        </div>

        <div className="text-center py-3">
          <div className="text-4xl font-bold text-indigo-700">{percentile}%</div>
          <p className="text-sm text-gray-600 mt-1">
            You scored better than <strong>{percentile}%</strong> of students
          </p>
        </div>

        {/* Visual bar */}
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mt-3">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-1000"
            style={{ width: `${percentile}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow-sm"
            style={{ left: `calc(${percentile}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        <p className="text-xs text-gray-600 mt-3 text-center">{getMessage()}</p>
      </CardContent>
    </Card>
  );
}
