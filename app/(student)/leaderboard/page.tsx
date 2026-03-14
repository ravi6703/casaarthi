import { Trophy } from "lucide-react";

export const metadata = { title: "Leaderboard — CA Saarthi" };

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
        <Trophy className="h-8 w-8 text-orange-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
      <p className="text-gray-500 max-w-sm">
        See how you rank against other CA aspirants. Leaderboard will be available once you complete your first practice session.
      </p>
      <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium">
        Coming Soon
      </span>
    </div>
  );
}
