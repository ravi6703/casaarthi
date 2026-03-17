import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div><Skeleton className="h-6 w-40 mb-2" /><Skeleton className="h-4 w-56" /></div>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-10 w-full rounded-lg" /></div>
        ))}
      </div>
    </div>
  );
}
