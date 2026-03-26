"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { MatchCard } from "@/components/matches/match-card";
import { useQuery } from "@tanstack/react-query";
import type { Match } from "@/types";
import { Calendar, Clock } from "lucide-react";

/* ── Filter types ── */
const STAGE_FILTERS = ["All Matches", "Group Stage", "Knockout"] as const;
type StageFilter = (typeof STAGE_FILTERS)[number];

/* ── Time slots for day filtering ── */
const TIME_SLOTS = ["12:00 PM", "12:40 PM", "1:20 PM", "2:00 PM", "2:40 PM", "3:20 PM", "4:10 PM", "5:00 PM", "6:00 PM"] as const;

function getTimeLabel(iso: string): string {
  const d = new Date(iso);
  const h = d.getUTCHours() + 4; // UTC→Dubai
  const m = d.getUTCMinutes();
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function filterByStage(allMatches: Match[], filter: StageFilter) {
  switch (filter) {
    case "Group Stage":
      return allMatches.filter((m) => m.stage === "GROUP");
    case "Knockout":
      return allMatches.filter((m) => m.stage !== "GROUP");
    default:
      return allMatches;
  }
}

export default function MatchesPage() {
  const [stageFilter, setStageFilter] = useState<StageFilter>("All Matches");
  const [timeFilter, setTimeFilter] = useState<string | null>(null);

  const { data, isLoading } = useQuery<{ matches: Match[] }>({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await fetch("/api/matches");
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
    },
  });

  const allMatches = data?.matches ?? [];

  let matches = filterByStage(allMatches, stageFilter);

  // Group by time slot
  const grouped = new Map<string, typeof matches>();
  matches.forEach((match) => {
    const label = getTimeLabel(match.scheduledAt);
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label)!.push(match);
  });

  // If time filter active, only show that slot
  const displayGroups = timeFilter
    ? [[timeFilter, grouped.get(timeFilter) || []] as const]
    : Array.from(grouped.entries());

  const groupCount = allMatches.filter((m) => m.stage === "GROUP").length;
  const knockoutCount = allMatches.filter((m) => m.stage !== "GROUP").length;

  if (isLoading) {
    return (
      <PageContainer className="pt-8 pb-20">
        <div className="mb-7">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-tcl-red/80 mb-2">
            TCL × Arsenal Road to Greatness
          </p>
          <h1 className="font-display font-black text-[28px] text-white leading-none tracking-tight">
            TOURNAMENT<br />
            <span className="text-tcl-red">SCHEDULE</span>
          </h1>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-bg-elevated animate-pulse" />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-8 pb-20">
      {/* ── Header ── */}
      <div className="mb-7">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-tcl-red/80 mb-2">
          TCL × Arsenal Road to Greatness
        </p>
        <h1 className="font-display font-black text-[28px] text-white leading-none tracking-tight">
          TOURNAMENT<br />
          <span className="text-tcl-red">SCHEDULE</span>
        </h1>
        <div className="flex items-center gap-4 mt-3.5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-white/20" />
            <span className="text-[10px] text-white/40">April 26–27, 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-white/20" />
            <span className="text-[10px] text-white/40">12:00 PM – 6:50 PM</span>
          </div>
        </div>
      </div>

      {/* ── Stage Filters ── */}
      <div className="flex gap-2 mb-4">
        {STAGE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => { setStageFilter(f); setTimeFilter(null); }}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-[11px] font-medium border transition-colors ${
              stageFilter === f
                ? "bg-white/[0.06] border-white/[0.08] text-white"
                : "bg-transparent border-white/[0.04] text-white/30 hover:text-white/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Time Slot Chips ── */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-5">
        {Array.from(grouped.keys()).map((t) => (
          <button
            key={t}
            onClick={() => setTimeFilter(timeFilter === t ? null : t)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[10px] font-score border transition-colors ${
              timeFilter === t
                ? "bg-tcl-red/10 border-tcl-red/25 text-tcl-red"
                : "bg-transparent border-white/[0.04] text-white/25 hover:text-white/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Match Grid ── */}
      <div className="space-y-7">
        {displayGroups.map(([timeLabel, slotMatches]) => (
          <div key={timeLabel}>
            {/* Time header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-1 h-3.5 bg-tcl-red rounded-full" />
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">{timeLabel}</span>
              <div className="flex-1 h-px bg-white/[0.04]" />
              <span className="text-[9px] text-white/20">{slotMatches.length} matches</span>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-2.5">
              {slotMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Summary Bar ── */}
      <div className="mt-10 rounded-2xl bg-bg-surface border border-white/[0.05] p-5 flex items-center justify-between">
        <div className="text-center flex-1">
          <span className="font-score text-[22px] font-black text-white block leading-none">{allMatches.length}</span>
          <span className="text-[9px] text-white/25 uppercase tracking-wider mt-1.5 block">Total</span>
        </div>
        <div className="w-px h-10 bg-white/[0.05]" />
        <div className="text-center flex-1">
          <span className="font-score text-[22px] font-black text-tcl-red block leading-none">{groupCount}</span>
          <span className="text-[9px] text-white/25 uppercase tracking-wider mt-1.5 block">Group</span>
        </div>
        <div className="w-px h-10 bg-white/[0.05]" />
        <div className="text-center flex-1">
          <span className="font-score text-[22px] font-black text-arsenal-gold block leading-none">{knockoutCount}</span>
          <span className="text-[9px] text-white/25 uppercase tracking-wider mt-1.5 block">Knockout</span>
        </div>
      </div>
    </PageContainer>
  );
}
