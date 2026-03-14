import { BookOpen } from "lucide-react";

export const metadata = { title: "Resources — CA Saarthi" };

export default function ResourcesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-blue-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Study Resources</h1>
      <p className="text-gray-500 max-w-sm">
        Curated notes, formula sheets, and revision material for all CA Foundation papers. Resources will be added here soon.
      </p>
      <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
        Coming Soon
      </span>
    </div>
  );
}
