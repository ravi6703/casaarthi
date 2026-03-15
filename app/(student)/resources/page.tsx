import { BookOpen, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Resources — CA Saarthi" };

const RESOURCES = [
  {
    paper: "Paper 1 — Accounts",
    items: [
      { title: "ICAI Study Material — Accounting", desc: "Official ICAI module covering all chapters for Paper 1.", url: "https://www.icai.org/post/ca-foundation-study-material" },
      { title: "Accounting Standards Summary", desc: "Quick-reference summary of all applicable Accounting Standards for CA Foundation.", url: "https://www.icai.org/post/accounting-standards" },
      { title: "Journal Entries & Ledger Practice Sheet", desc: "Downloadable practice problems for journal entries, ledger posting, and trial balance.", url: "https://www.icai.org/post/ca-foundation-practice-manual" },
    ],
  },
  {
    paper: "Paper 2 — Laws",
    items: [
      { title: "ICAI Study Material — Business Laws", desc: "Official module covering Indian Contract Act, Sale of Goods Act, and more.", url: "https://www.icai.org/post/ca-foundation-study-material" },
      { title: "Important Case Laws Compilation", desc: "Key landmark case laws frequently tested in CA Foundation exams.", url: "https://www.icai.org/post/ca-foundation-practice-manual" },
    ],
  },
  {
    paper: "Paper 3 — Maths & Statistics",
    items: [
      { title: "ICAI Study Material — Business Maths", desc: "Official module with chapters on ratio, indices, equations, and statistics.", url: "https://www.icai.org/post/ca-foundation-study-material" },
      { title: "Formula Sheet — All Chapters", desc: "One-page formula reference covering all important formulas for Paper 3.", url: "https://www.icai.org/post/ca-foundation-practice-manual" },
    ],
  },
  {
    paper: "Paper 4 — Economics",
    items: [
      { title: "ICAI Study Material — Business Economics", desc: "Official module covering micro & macro economics for CA Foundation.", url: "https://www.icai.org/post/ca-foundation-study-material" },
      { title: "Economics Revision Notes", desc: "Concise chapter-wise revision notes for quick last-minute preparation.", url: "https://www.icai.org/post/ca-foundation-practice-manual" },
      { title: "Previous Year Question Papers", desc: "ICAI official previous year question papers with suggested answers.", url: "https://www.icai.org/post/ca-foundation-question-papers" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Resources</h1>
            <p className="text-gray-500 text-sm">Curated reference material for all CA Foundation papers</p>
          </div>
        </div>
      </div>

      {RESOURCES.map((section) => (
        <div key={section.paper}>
          <h2 className="font-bold text-gray-900 mb-3">{section.paper}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((item) => (
              <a
                key={item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</h3>
                      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    <Badge variant="secondary" className="mt-3 text-xs">ICAI Official</Badge>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
