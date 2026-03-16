"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Clock, Target, Trophy } from "lucide-react";
import Link from "next/link";

interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  config: {
    question_count?: number;
    time_limit_sec?: number;
    xp_reward?: number;
    difficulty?: string;
  };
}

interface Props {
  challenges: Challenge[];
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  speed: <Clock className="h-4 w-4 text-red-500" />,
  accuracy: <Target className="h-4 w-4 text-green-500" />,
  volume: <Trophy className="h-4 w-4 text-purple-500" />,
};

const TYPE_COLORS: Record<string, string> = {
  speed: "border-l-red-500",
  accuracy: "border-l-green-500",
  volume: "border-l-purple-500",
};

export function MicroChallengeCards({ challenges }: Props) {
  if (challenges.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Zap className="h-4 w-4 text-yellow-500" />
        Micro-Challenges
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {challenges.map((ch) => (
          <Link key={ch.id} href={`/practice/session?type=challenge&challengeId=${ch.id}`}>
            <Card className={`border-l-4 ${TYPE_COLORS[ch.challenge_type] ?? "border-l-gray-500"} hover:shadow-md transition-all cursor-pointer h-full`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  {TYPE_ICONS[ch.challenge_type]}
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{ch.title}</div>
                    <p className="text-xs text-gray-500 mt-0.5">{ch.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {ch.config.xp_reward && (
                        <Badge variant="secondary" className="text-[10px] bg-yellow-100 text-yellow-800">
                          +{ch.config.xp_reward} XP
                        </Badge>
                      )}
                      {ch.config.time_limit_sec && (
                        <Badge variant="secondary" className="text-[10px]">
                          {ch.config.time_limit_sec}s limit
                        </Badge>
                      )}
                      {ch.config.question_count && (
                        <Badge variant="secondary" className="text-[10px]">
                          {ch.config.question_count} Qs
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
