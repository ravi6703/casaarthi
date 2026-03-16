"use client";
import { useEffect, useRef } from "react";

interface Props {
  code: string;
}

export function MindMapViewer({ code }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !containerRef.current) return;

    // Dynamically import mermaid
    import("mermaid").then((mermaid) => {
      mermaid.default.initialize({
        startOnLoad: false,
        theme: "default",
        mindmap: { padding: 16 },
        themeVariables: {
          fontSize: "14px",
        },
      });

      const id = `mindmap-${Date.now()}`;
      containerRef.current!.innerHTML = "";

      mermaid.default.render(id, code).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          // Make SVG responsive
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.maxWidth = "100%";
            svgEl.style.height = "auto";
          }
        }
      }).catch((err) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-sm text-red-500 p-4">Could not render mind map. ${err.message || ""}</div>`;
        }
      });
    });
  }, [code]);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-xl border border-gray-200 p-4 min-h-[200px] flex items-center justify-center overflow-auto"
    />
  );
}
