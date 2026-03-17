"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BookOpen, FileText, Trophy,
  BookMarked, Settings, ChevronRight, BarChart2, CalendarDays, Newspaper,
  MessageSquare, Brain,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/practice",    label: "Practice",    icon: BookOpen },
  { href: "/study-plan",  label: "Study Plan",  icon: CalendarDays },
  { href: "/analytics",   label: "Analytics",   icon: BarChart2 },
  { href: "/mock-tests",  label: "Mock Tests",  icon: FileText },
  { href: "/profile",     label: "My Profile",  icon: BookMarked },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/resources",   label: "Resources",   icon: Settings },
  { href: "/learn",       label: "AI Explainer", icon: Brain },
  { href: "/discussions",  label: "Doubts",      icon: MessageSquare },
  { href: "/blog",        label: "Blog",        icon: Newspaper },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">CA</div>
          <span className="font-bold text-gray-900 dark:text-gray-100">CA Saarthi</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                active
                  ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
              {label}
              {active && <ChevronRight className="ml-auto h-3 w-3 text-blue-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom spacer */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-slate-700">
        <div className="text-xs text-gray-400 text-center">CA Saarthi v1.0</div>
      </div>
    </aside>
  );
}
