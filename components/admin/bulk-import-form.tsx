"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface ImportResult {
  row: number;
  status: "ok" | "error" | "skipped";
  message?: string;
  question_text?: string;
}

const CSV_TEMPLATE = `paper_id,topic_id,question_text,option_a,option_b,option_c,option_d,correct_option,explanation,difficulty,source,year,is_diagnostic
1,"",What is the full form of ICAI?,Institute of Chartered Accountants of India,International Committee of Accountants India,Indian Committee of Accountancy Institutes,Indian Chartered Accountants Institution,a,"ICAI stands for the Institute of Chartered Accountants of India, the statutory body that regulates the CA profession.",easy,ICAI Study Material,2023,false`;

export function BulkImportForm() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".csv")) {
      setFile(f);
      setResults(null);
    } else {
      toast.error("Please select a .csv file");
    }
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/questions/bulk", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Import failed");
      } else {
        setResults(data.results);
        const ok = data.results.filter((r: ImportResult) => r.status === "ok").length;
        const errors = data.results.filter((r: ImportResult) => r.status === "error").length;
        toast.success(`Imported ${ok} questions${errors > 0 ? `, ${errors} errors` : ""}`);
      }
    } catch {
      toast.error("Network error during import");
    }
    setImporting(false);
  }

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ca-saarthi-questions-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">CSV Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">Required columns:</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs font-mono">
            {[
              ["paper_id", "1, 2, 3, or 4"],
              ["topic_id", "UUID or empty string"],
              ["question_text", "Question body"],
              ["option_a..d", "4 answer options"],
              ["correct_option", "a, b, c, or d"],
              ["explanation", "Why the answer is correct"],
              ["difficulty", "easy / medium / hard"],
              ["source", "Optional — e.g. Nov 2023"],
              ["year", "Optional — e.g. 2023"],
              ["is_diagnostic", "true or false"],
            ].map(([col, desc]) => (
              <div key={col} className="flex items-center gap-2">
                <span className="text-blue-600">{col}</span>
                <span className="text-gray-400">— {desc}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <FileText className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </CardContent>
      </Card>

      {/* Upload */}
      <Card>
        <CardContent className="p-6">
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
          >
            <Upload className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            {file ? (
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">Click to select a CSV file</p>
                <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />

          {file && (
            <div className="mt-4 flex gap-3">
              <Button onClick={handleImport} loading={importing} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Import Questions
              </Button>
              <Button variant="outline" onClick={() => { setFile(null); setResults(null); }}>
                Clear
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-3">
              Import Results
              <Badge variant="secondary">{results.filter((r) => r.status === "ok").length} imported</Badge>
              {results.some((r) => r.status === "error") && (
                <Badge className="bg-red-100 text-red-700">{results.filter((r) => r.status === "error").length} errors</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-64 overflow-y-auto">
            {results.map((r) => (
              <div key={r.row} className="flex items-start gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0">
                {r.status === "ok" && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />}
                {r.status === "error" && <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />}
                {r.status === "skipped" && <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />}
                <div className="text-xs">
                  <span className="text-gray-400">Row {r.row}:</span>{" "}
                  {r.status === "ok" ? (
                    <span className="text-gray-700">{r.question_text?.slice(0, 80)}{(r.question_text?.length ?? 0) > 80 ? "…" : ""}</span>
                  ) : (
                    <span className="text-red-600">{r.message}</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
