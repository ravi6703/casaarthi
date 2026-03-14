"use client";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./sidebar";

interface TopbarProps {
  userName?: string;
  streakCount?: number;
}

export function Topbar({ userName, streakCount }: TopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:block" />

        <div className="flex items-center gap-4">
          {streakCount != null && streakCount > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 text-sm">
              <span>🔥</span>
              <span className="font-bold text-orange-700">{streakCount}</span>
              <span className="text-orange-600 text-xs">day streak</span>
            </div>
          )}
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {userName?.[0]?.toUpperCase() ?? "S"}
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <div className="relative">
              <button
                className="absolute top-4 right-4 z-10 p-1 rounded-lg bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
