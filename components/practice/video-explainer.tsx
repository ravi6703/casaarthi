"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Play } from "lucide-react";

interface Video {
  id: string;
  title: string;
  url: string;
}

interface Props {
  videos: Video[];
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?\s]+)/);
  return match ? match[1] : null;
}

export function VideoExplainer({ videos }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (videos.length === 0) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
      >
        <Play className="h-4 w-4" />
        {videos.length} Video{videos.length > 1 ? "s" : ""} Available
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {videos.map((video) => {
            const ytId = getYouTubeId(video.url);
            const isActive = activeVideo === video.id;
            return (
              <div key={video.id}>
                <button
                  onClick={() => setActiveVideo(isActive ? null : video.id)}
                  className="text-xs text-gray-600 hover:text-[var(--primary)] flex items-center gap-1"
                >
                  <Play className="h-3 w-3" />
                  {video.title}
                </button>
                {isActive && ytId && (
                  <div className="mt-1 rounded-lg overflow-hidden aspect-video max-w-md">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
