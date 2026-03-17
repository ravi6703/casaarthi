"use client";
import { Menu, X, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useRef, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

interface TopbarProps {
  userName?: string;
  userEmail?: string;
  streakCount?: number;
}

export function Topbar({ userName, userEmail, streakCount }: TopbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:block" />

        <div className="flex items-center gap-4">
          {streakCount != null && (
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm cursor-default transition-all",
                streakCount > 0
                  ? "bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 hover:scale-105"
                  : "bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
              )}
              title={streakCount > 0 ? `${streakCount} day streak! Keep it going!` : "Start a streak by practicing today!"}
            >
              <span className={streakCount > 0 ? "animate-bounce" : ""}>{streakCount > 0 ? "🔥" : "❄️"}</span>
              <span className={cn("font-bold", streakCount > 0 ? "text-orange-700 dark:text-orange-300" : "text-gray-400")}>{streakCount || 0}</span>
              <span className={cn("text-xs hidden sm:inline", streakCount > 0 ? "text-orange-600 dark:text-orange-400" : "text-gray-400")}>
                {streakCount > 0 ? "day streak" : "no streak"}
              </span>
            </div>
          )}
          <ThemeToggle />
          <NotificationBell />

          {/* Avatar with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              {userName?.[0]?.toUpperCase() ?? "S"}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{userName || "Student"}</p>
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 text-gray-400" />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
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
