"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earned: boolean;
  earnedAt: string | null;
}

export function BadgeGallery() {
  const [badges, setBadges] = useState<BadgeDef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/badges")
      .then((r) => r.json())
      .then((data) => {
        setBadges(data.badges ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Achievements</span>
          <span className="text-sm font-normal text-gray-500">{earned.length}/{badges.length} earned</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`text-center p-3 rounded-xl border transition-all ${
                badge.earned
                  ? "bg-yellow-50 border-yellow-200 hover:shadow-md"
                  : "bg-gray-50 border-gray-200 opacity-50"
              }`}
              title={badge.description}
            >
              <div className={`text-3xl mb-1 ${badge.earned ? "" : "grayscale"}`}>
                {badge.earned ? badge.icon : <Lock className="h-6 w-6 text-gray-400 mx-auto" />}
              </div>
              <div className={`text-xs font-medium truncate ${badge.earned ? "text-gray-900" : "text-gray-400"}`}>
                {badge.name}
              </div>
              {badge.earned && badge.earnedAt && (
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {new Date(badge.earnedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
