"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TopicData {
  name: string;
  score: number | null;
  attempted: number;
}

interface Props {
  papers: { id: number; name: string; short: string }[];
  topicsByPaper: Record<number, TopicData[]>;
}

function getBarColor(score: number | null): string {
  if (score === null) return "#e5e7eb";
  if (score >= 80) return "#22c55e";
  if (score >= 65) return "#84cc16";
  if (score >= 40) return "#eab308";
  if (score >= 20) return "#f97316";
  return "#ef4444";
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-900 mb-1">{data.name}</p>
      <p className="text-gray-600">
        {data.score !== null ? `${data.score}% accuracy` : "Not tested yet"}
      </p>
      {data.attempted > 0 && (
        <p className="text-gray-500">{data.attempted} questions attempted</p>
      )}
    </div>
  );
}

export function TopicHeatCharts({ papers, topicsByPaper }: Props) {
  return (
    <div className="space-y-8">
      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap text-xs">
        {[
          { color: "#22c55e", label: "80%+" },
          { color: "#84cc16", label: "65-79%" },
          { color: "#eab308", label: "40-64%" },
          { color: "#f97316", label: "20-39%" },
          { color: "#ef4444", label: "<20%" },
          { color: "#e5e7eb", label: "Not tested" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
            <span className="text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      {papers.map((paper) => {
        const data = topicsByPaper[paper.id] ?? [];
        if (data.length === 0) return null;

        const chartData = data.map((t) => ({
          name: t.name.length > 25 ? t.name.slice(0, 22) + "..." : t.name,
          fullName: t.name,
          score: t.score ?? 0,
          actualScore: t.score,
          attempted: t.attempted,
        }));

        const chartHeight = Math.max(200, data.length * 36);

        return (
          <div key={paper.id}>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">
              {paper.short} — {paper.name}
            </h3>
            <div style={{ width: "100%", height: chartHeight }}>
              <ResponsiveContainer>
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={160}
                    fontSize={11}
                    tick={{ fill: "#374151" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={getBarColor(entry.actualScore)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
