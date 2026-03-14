import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, FileText, BarChart2, Layers, LogOut } from "lucide-react";

export const metadata = { title: "Admin — CA Saarthi" };

const NAV = [
  { href: "/admin/questions", icon: <BookOpen className="h-4 w-4" />, label: "Questions" },
  { href: "/admin/mock-builder", icon: <FileText className="h-4 w-4" />, label: "Mock Builder" },
  { href: "/admin/taxonomy", icon: <Layers className="h-4 w-4" />, label: "Taxonomy" },
  { href: "/admin/analytics", icon: <BarChart2 className="h-4 w-4" />, label: "Analytics" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const isAdmin = user.user_metadata?.role === "admin";
  if (!isAdmin) redirect("/dashboard");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="font-bold text-gray-900">CA Saarthi</div>
          <div className="text-xs text-red-600 font-semibold mt-0.5">Admin CMS</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">
            <LogOut className="h-4 w-4" />
            Student View
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
