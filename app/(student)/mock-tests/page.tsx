import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Bell } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Mock Tests" };

const PAPERS = [
  { id: 1, name: "Accounting",    emoji: "📊", chapters: 12 },
  { id: 2, name: "Business Laws", emoji: "⚖️", chapters: 10 },
  { id: 3, name: "Maths & Stats", emoji: "🔢", chapters: 14 },
  { id: 4, name: "Economics",     emoji: "📈", chapters: 11 },
];

export default function MockTestsPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mock Test Series</h1>
        <p className="text-gray-500 mt-1">Full-length ICAI-pattern tests with detailed analytics</p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Mock Tests Coming Soon!</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            We are preparing full-length ICAI-pattern mock tests for all 4 papers.
            Each mock will have timed sections, proctored mode, and detailed analytics.
          </p>
          <Badge variant="secondary" className="text-sm px-4 py-1">
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Expected: Coming weeks
          </Badge>
        </CardContent>
      </Card>

      {/* Paper Preview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PAPERS.map((paper) => (
          <Card key={paper.id} className="border-dashed opacity-75">
            <CardContent className="p-5 text-center">
              <span className="text-3xl mb-3 block">{paper.emoji}</span>
              <h3 className="font-bold text-gray-900 mb-1">Paper {paper.id}</h3>
              <p className="text-sm text-gray-500 mb-2">{paper.name}</p>
              <p className="text-xs text-gray-400">{paper.chapters} chapters covered</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-3">Meanwhile, strengthen your basics with practice questions</p>
        <Link href="/practice">
          <Button>Start Practicing <FileText className="h-4 w-4 ml-2" /></Button>
        </Link>
      </div>
    </div>
  );
}
