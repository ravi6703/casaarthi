import { Skeleton } from "@/components/ui/skeleton";

export default function PracticeLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Skeleton className="h-8 w-56 mb-2" />
      <Skeleton className="h-4 w-96" />
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <Skeleton className="h-5 w-32 mb-3" />
            <Skeleton className="h-4 w-48 mb-4" />
            <div className="flex gap-2">{Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="h-6 w-16 rounded-full" />)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
