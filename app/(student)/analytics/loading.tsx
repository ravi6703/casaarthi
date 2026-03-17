import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Skeleton className="h-8 w-36" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <Skeleton className="h-4 w-20 mb-2" /><Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <Skeleton className="h-5 w-36 mb-4" /><Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <Skeleton className="h-5 w-36 mb-4" /><Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
