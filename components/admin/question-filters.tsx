"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";

interface Props {
  papers: { id: number; name: string }[];
  currentParams: Record<string, string | undefined>;
}

export function QuestionFilters({ papers, currentParams }: Props) {
  const router = useRouter();

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== key && k !== "page") params.set(k, v);
    });
    if (value) params.set(key, value);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={currentParams.paper ?? ""}
        onChange={(e) => update("paper", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Papers</option>
        {papers.map((p) => (
          <option key={p.id} value={String(p.id)}>{p.name}</option>
        ))}
      </select>

      <select
        value={currentParams.difficulty ?? ""}
        onChange={(e) => update("difficulty", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <select
        value={currentParams.status ?? ""}
        onChange={(e) => update("status", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="retired">Retired</option>
      </select>
    </div>
  );
}
