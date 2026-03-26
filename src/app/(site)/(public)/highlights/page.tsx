"use client";

import { useState } from "react";
import { Play, Camera, Music2, AtSign, Video } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Highlight } from "@/types";

const FILTERS = ["All", "Goals", "Saves", "Celebrations"] as const;
type Filter = (typeof FILTERS)[number];

const DURATIONS: Record<string, string> = {
  h1: "1:24",
  h2: "0:48",
  h3: "0:35",
  h4: "2:10",
  h5: "1:02",
  h6: "5:30",
};

export default function HighlightsPage() {
  const [active, setActive] = useState<Filter>("All");

  const { data, isLoading } = useQuery<{ highlights: Highlight[] }>({
    queryKey: ["highlights"],
    queryFn: async () => {
      const res = await fetch("/api/highlights");
      if (!res.ok) throw new Error("Failed to fetch highlights");
      return res.json();
    },
  });

  const highlights = data?.highlights ?? [];

  const filtered =
    active === "All"
      ? highlights
      : highlights.filter((h) => h.category === active);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (isLoading) {
    return (
      <PageContainer className="pt-6">
        <h1 className="text-lg font-display font-bold text-text-primary flex items-center mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
          Highlights
        </h1>
        <div className="space-y-3">
          <div className="aspect-video rounded-xl bg-bg-elevated animate-pulse" />
          <div className="grid grid-cols-2 gap-2.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video rounded-xl bg-bg-elevated animate-pulse" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-6">
      <h1 className="text-lg font-display font-bold text-text-primary flex items-center mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
        Highlights
      </h1>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
              active === f
                ? "bg-tcl-red text-white"
                : "bg-bg-elevated text-text-muted hover:text-text-secondary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured && (
        <div className="rounded-xl bg-bg-elevated border border-border-default overflow-hidden mb-4">
          <div className="aspect-video relative flex items-center justify-center bg-bg-elevated">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[13px] font-semibold text-white">{featured.title}</p>
              <p className="text-[10px] text-white/60">{featured.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2.5 stagger-children">
        {rest.map((h) => (
          <div
            key={h.id}
            className="rounded-xl bg-bg-surface border border-border-default overflow-hidden"
          >
            <div className="aspect-video relative flex items-center justify-center bg-bg-elevated">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="h-3.5 w-3.5 text-white fill-white" />
              </div>
              <Badge
                variant="default"
                className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0 h-4 bg-black/60"
              >
                {DURATIONS[h.id] || "0:30"}
              </Badge>
            </div>
            <div className="p-2.5">
              <p className="text-[12px] font-semibold text-text-primary line-clamp-1">{h.title}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{h.category}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[13px] text-text-muted py-8">No highlights yet</p>
      )}

      {/* Follow Us */}
      <div className="mt-6">
        <h2 className="text-[11px] uppercase tracking-wide text-text-muted mb-2">Follow Us</h2>
        <div className="flex gap-2">
          {[
            { icon: <Camera className="h-3.5 w-3.5" />, label: "Instagram" },
            { icon: <Music2 className="h-3.5 w-3.5" />, label: "TikTok" },
            { icon: <AtSign className="h-3.5 w-3.5" />, label: "X" },
            { icon: <Video className="h-3.5 w-3.5" />, label: "YouTube" },
          ].map((s) => (
            <button
              key={s.label}
              className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-text-primary transition-colors"
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
