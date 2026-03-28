import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-white to-[var(--background)] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm">CA</div>
            <span className="font-bold text-lg text-gray-900">CA Saarthi</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl font-bold text-[var(--primary)] mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, the page you are looking for does not exist or has been moved.
            Let&apos;s get you back on track with your CA Foundation preparation.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Home className="w-4 h-4" />
                Go to Homepage
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Need help? Reach us at{" "}
            <a href="mailto:support@casaarthi.in" className="text-[var(--primary)] hover:underline">
              support@casaarthi.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
