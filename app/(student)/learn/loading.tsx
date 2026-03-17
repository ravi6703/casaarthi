import { Skeleton } from "@/components/ui/skeleton";

export default function LearnLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <Skeleton className="h-24 w-full rounded-lg mb-4" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}
