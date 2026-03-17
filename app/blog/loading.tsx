import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-fade-in">
      <Skeleton className="h-10 w-48" />
      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
            <Skeleton className="h-4 w-24 mb-3" /><Skeleton className="h-6 w-full mb-2" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
