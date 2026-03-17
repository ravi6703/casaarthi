import { Skeleton } from "@/components/ui/skeleton";

export default function DiagnosticLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in text-center py-12">
      <Skeleton className="h-12 w-12 rounded-full mx-auto" />
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-4 w-96 mx-auto" />
      <Skeleton className="h-12 w-48 rounded-lg mx-auto" />
    </div>
  );
}
