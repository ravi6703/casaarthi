import { Skeleton } from "@/components/ui/skeleton";

export default function PapersLoading() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-fade-in">
      <Skeleton className="h-10 w-64" />
      <div className="grid sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
            <Skeleton className="h-6 w-48 mb-3" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex gap-2">{Array.from({ length: 3 }).map((_, j) => <Skeleton key={j} className="h-6 w-20 rounded-full" />)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
