"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Admin error:", error); }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">⚙️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Error</h2>
        <p className="text-gray-500 mb-6 text-sm">Something went wrong in the admin panel.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Retry</button>
          <Link href="/admin" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Admin Home</Link>
        </div>
      </div>
    </div>
  );
}
