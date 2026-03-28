"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, Crown } from "lucide-react";

type LeaderboardEntry = {
  user_id: string;
  name: string;
  value: number;
  rank: number;
};

type LeaderboardData = {
  overallScore: LeaderboardEntry[];
  streakChampions: LeaderboardEntry[];
  practiceWarriors: LeaderboardEntry[];
};

const TABS = [
  { key: "overallScore", label: "Overall Score", icon: Trophy, color: "text-[var(--primary)]", bg: "bg-[var(--sage-light)]", activeBg: "bg-[var(--primary)]", unit: "pts" },
  { key: "streakChampions", label: "Streak Champions", icon: Flame, color: "text-orange-600", bg: "bg-orange-50", activeBg: "bg-orange-600", unit: "days" },
  { key: "practiceWarriors", label: "Practice Warriors", icon: Target, color: "text-green-600", bg: "bg-green-50", activeBg: "bg-green-600", unit: "Qs" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function getRankBadge(rank: number) {
  if (rank === 1) return <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center"><Crown className="h-4 w-4 text-white" /></div>;
  if (rank === 2) return <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">2</div>;
  if (rank === 3) return <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold">3</div>;
  return <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-semibold">{rank}</div>;
}

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-[var(--primary)]", "bg-purple-500", "bg-green-500", "bg-orange-500",
  "bg-pink-500", "bg-teal-500", "bg-[var(--background)]0", "bg-red-500",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function LeaderboardTabs({
  data,
  currentUserId,
}: {
  data: LeaderboardData;
  currentUserId: string;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("overallScore");

  const currentTab = TABS.find((t) => t.key === activeTab)!;
  const entries = data[activeTab];

  return (
    <div className="space-y-6">
      {/* Tab Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? `${tab.activeBg} text-white shadow-sm`
                  : `${tab.bg} ${tab.color} hover:shadow-sm`
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[entries[1], entries[0], entries[2]].map((entry, i) => {
            const podiumOrder = [2, 1, 3];
            const rank = podiumOrder[i];
            const isCurrentUser = entry.user_id === currentUserId;
            return (
              <Card
                key={entry.user_id}
                className={`text-center transition-shadow hover:shadow-md ${
                  rank === 1 ? "ring-2 ring-yellow-400 shadow-md" : ""
                } ${isCurrentUser ? "bg-[var(--sage-light)] border-[var(--border)]" : ""}`}
              >
                <CardContent className={`p-4 ${rank === 1 ? "pt-6 pb-6" : "pt-4 pb-4"}`}>
                  <div className="flex justify-center mb-2">
                    {getRankBadge(rank)}
                  </div>
                  <div
                    className={`mx-auto rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(entry.name)} ${
                      rank === 1 ? "w-14 h-14 text-xl" : "w-11 h-11 text-base"
                    }`}
                  >
                    {getInitial(entry.name)}
                  </div>
                  <p className={`mt-2 font-semibold text-gray-900 truncate ${rank === 1 ? "text-base" : "text-sm"}`}>
                    {entry.name}
                    {isCurrentUser && <span className="text-xs text-[var(--primary)] ml-1">(You)</span>}
                  </p>
                  <p className={`font-bold mt-1 ${currentTab.color} ${rank === 1 ? "text-2xl" : "text-lg"}`}>
                    {entry.value}
                    <span className="text-xs font-normal text-gray-400 ml-1">{currentTab.unit}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {entries.map((entry) => {
              const isCurrentUser = entry.user_id === currentUserId;
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                    isCurrentUser
                      ? "bg-[var(--sage-light)] border-l-4 border-l-[var(--primary)]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Rank */}
                  {getRankBadge(entry.rank)}

                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(entry.name)}`}
                  >
                    {getInitial(entry.name)}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {entry.name}
                      {isCurrentUser && (
                        <Badge variant="default" className="ml-2 text-[10px] px-1.5 py-0">
                          You
                        </Badge>
                      )}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <span className={`font-bold text-base ${currentTab.color}`}>
                      {entry.value}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{currentTab.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {entries.length === 0 && (
            <div className="py-12 text-center">
              <currentTab.icon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No data yet. Be the first on the leaderboard!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
