import { BulkImportForm } from "@/components/admin/bulk-import-form";

export const metadata = { title: "Bulk Import — Admin" };

export default function BulkImportPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Import Questions</h1>
        <p className="text-gray-500 text-sm mt-1">Upload a CSV file to import questions in batch</p>
      </div>
      <BulkImportForm />
    </div>
  );
}
