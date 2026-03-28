"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function StudentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Student section error:", error); }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">📚</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Oops! Something broke</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">This page ran into an issue. Your study progress is safe.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--teal-dark)] transition-colors">
            Retry
          </button>
          <Link href="/dashboard" className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
