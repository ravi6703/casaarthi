import { Skeleton } from "@/components/ui/skeleton";

export default function StudyPlanLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Skeleton className="h-8 w-44" />
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <Skeleton className="h-5 w-48 mb-4" />
        <div className="grid grid-cols-4 gap-3 mb-6">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}
