import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Taxonomy — Admin" };

const PAPER_COLORS: Record<number, string> = {
  1: "bg-blue-100 text-blue-700",
  2: "bg-purple-100 text-purple-700",
  3: "bg-green-100 text-green-700",
  4: "bg-orange-100 text-orange-700",
};

export default async function TaxonomyPage() {
  const supabase = await createClient();

  const { data: papers } = await supabase.from("papers").select(`
    id, code, name,
    topics (
      id, name, sort_order,
      sub_topics (id, name, sort_order),
      questions (count)
    )
  `).order("id");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Taxonomy</h1>
        <p className="text-gray-500 text-sm mt-1">Papers → Topics → Sub-topics structure</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {(papers ?? []).map((paper: any) => (
          <Card key={paper.id}>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${PAPER_COLORS[paper.id]}`}>{paper.code}</span>
                {paper.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {(paper.topics ?? [])
                  .sort((a: any, b: any) => a.sort_order - b.sort_order)
                  .map((topic: any) => (
                    <div key={topic.id} className="px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{topic.name}</span>
                        <span className="text-xs text-gray-400">{topic.questions?.[0]?.count ?? 0} Qs</span>
                      </div>
                      {topic.sub_topics && topic.sub_topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {topic.sub_topics
                            .sort((a: any, b: any) => a.sort_order - b.sort_order)
                            .map((st: any) => (
                              <span key={st.id} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                {st.name}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
