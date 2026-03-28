"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  code: string;
}

export function MindMapViewer({ code }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code || !containerRef.current) return;

    setLoading(true);
    setError(null);

    // Debounce rendering to avoid excessive re-renders
    const timeout = setTimeout(() => {
      import("mermaid").then((mermaid) => {
        mermaid.default.initialize({
          startOnLoad: false,
          theme: "default",
          mindmap: { padding: 16 },
          themeVariables: { fontSize: "14px" },
        });

        const id = `mindmap-${Date.now()}`;
        if (containerRef.current) containerRef.current.innerHTML = "";

        mermaid.default.render(id, code).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            const svgEl = containerRef.current.querySelector("svg");
            if (svgEl) {
              svgEl.style.maxWidth = "100%";
              svgEl.style.height = "auto";
            }
          }
          setLoading(false);
        }).catch((err) => {
          setError(err.message || "Could not render mind map");
          setLoading(false);
        });
      }).catch(() => {
        setError("Failed to load diagram library");
        setLoading(false);
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [code]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 min-h-[200px] relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl z-10">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
        </div>
      )}
      {error && (
        <div className="text-sm text-red-500 p-4 text-center">{error}</div>
      )}
      <div
        ref={containerRef}
        className="flex items-center justify-center overflow-auto"
      />
    </div>
  );
}
