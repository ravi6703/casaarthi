"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Root error:", error); }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">😵</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Something went wrong</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Don&apos;t worry, your progress is safe. Please try again.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--teal-dark)] transition-colors">
            Try Again
          </button>
          <Link href="/" className="px-5 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
