"use client";

import { useState } from "react";

const FEATURED_VIDEO = {
  title: "Road to Greatness 2025 Highlights",
  duration: "3:42",
};

const VIDEO_THUMBS = [
  { id: 1, title: "Official Teaser", category: "Teaser", duration: "0:45" },
  { id: 2, title: "Match Day Highlights", category: "Highlights", duration: "4:12" },
  { id: 3, title: "Behind the Scenes", category: "Behind the Scenes", duration: "6:30" },
  { id: 4, title: "Winner's Journey", category: "Winner's Journey", duration: "5:18" },
];

function PlayButton({ size = "lg" }: { size?: "lg" | "sm" }) {
  const dim = size === "lg" ? "h-16 w-16" : "h-9 w-9";
  const tri = size === "lg" ? "border-l-[18px] border-y-[11px] ml-1" : "border-l-[10px] border-y-[6px] ml-0.5";
  return (
    <div
      className={`${dim} rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all group-hover:bg-white/30 group-hover:scale-110`}
    >
      <div
        className={`${tri} border-y-transparent border-l-white w-0 h-0`}
      />
    </div>
  );
}

export function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <section className="py-12">
      {/* Section title */}
      <h2 className="mb-8 font-display font-bold text-2xl text-text-primary flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-tcl-red" />
        The Road to Greatness
      </h2>

      {/* Featured video */}
      <div className="gradient-border rounded-2xl p-[1px] mb-6">
        <div
          className="card-cinematic group relative aspect-video w-full rounded-2xl bg-bg-surface overflow-hidden cursor-pointer"
          onClick={() => setActiveVideo(0)}
        >
          {/* Placeholder pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-tcl-red/10 via-bg-surface to-arsenal-gold/5" />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayButton size="lg" />
          </div>
          {/* Bottom overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-5 pt-16">
            <span className="inline-block rounded-md bg-tcl-red/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white mb-2">
              Watch Now
            </span>
            <h3 className="font-display font-bold text-lg text-white">
              {FEATURED_VIDEO.title}
            </h3>
            <p className="text-xs text-white/60 mt-1">
              {FEATURED_VIDEO.duration}
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnail rail */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {VIDEO_THUMBS.map((vid) => (
          <div
            key={vid.id}
            className="card-cinematic group flex-shrink-0 cursor-pointer"
            onClick={() => setActiveVideo(vid.id)}
          >
            <div className="relative w-48 h-28 rounded-xl bg-bg-surface overflow-hidden">
              {/* Placeholder gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-bg-elevated via-bg-surface to-tcl-red/5" />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayButton size="sm" />
              </div>
              {/* Category badge */}
              <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-secondary">
                {vid.category}
              </span>
              {/* Duration */}
              <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white/80">
                {vid.duration}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-text-secondary truncate w-48">
              {vid.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
