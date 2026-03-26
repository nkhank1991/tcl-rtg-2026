"use client";

import { PageContainer } from "@/components/layout/page-container";
import { useQuery } from "@tanstack/react-query";
import type { Group } from "@/types";

const QF_PAIRS = [
  { home: "A1", away: "B2", label: "QF1" },
  { home: "B1", away: "A2", label: "QF2" },
  { home: "C1", away: "D2", label: "QF3" },
  { home: "D1", away: "C2", label: "QF4" },
];

export default function StandingsPage() {
  const { data, isLoading } = useQuery<{ groups: Group[] }>({
    queryKey: ["standings"],
    queryFn: async () => {
      const res = await fetch("/api/standings");
      if (!res.ok) throw new Error("Failed to fetch standings");
      return res.json();
    },
  });

  const groups = data?.groups ?? [];

  if (isLoading) {
    return (
      <PageContainer className="pt-8 pb-20">
        <div className="mb-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-tcl-red/80 mb-2">
            TCL × Arsenal Road to Greatness
          </p>
          <h1 className="font-display font-black text-[28px] text-white leading-none tracking-tight">
            GROUP <span className="text-tcl-red">STANDINGS</span>
          </h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-bg-elevated animate-pulse" />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-8 pb-20">
      {/* ── Header ── */}
      <div className="mb-8">
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-tcl-red/80 mb-2">
          TCL × Arsenal Road to Greatness
        </p>
        <h1 className="font-display font-black text-[28px] text-white leading-none tracking-tight">
          GROUP <span className="text-tcl-red">STANDINGS</span>
        </h1>
        <p className="text-[11px] text-white/30 mt-2.5">Track your team&apos;s progress</p>
      </div>

      {/* ── 4-Group Grid ── */}
      <div className="grid grid-cols-1 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="rounded-2xl bg-bg-surface border border-white/[0.05] overflow-hidden">
            {/* Group header */}
            <div className="px-5 py-3.5 border-b border-white/[0.04]">
              <h2 className="font-display font-bold text-[13px] text-tcl-red uppercase tracking-wider">
                {group.name}
              </h2>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead>
                <tr className="text-[9px] text-text-muted uppercase tracking-wider border-b border-white/[0.03]">
                  <th className="text-left pl-4 py-2 font-medium">Team</th>
                  <th className="text-center py-2 font-medium w-8">P</th>
                  <th className="text-center py-2 font-medium w-8">W</th>
                  <th className="text-center py-2 font-medium w-8">D</th>
                  <th className="text-center py-2 font-medium w-8">L</th>
                  <th className="text-center py-2 font-medium w-9">GD</th>
                  <th className="text-center pr-4 py-2 font-medium w-9">Pts</th>
                </tr>
              </thead>
              <tbody>
                {group.standings.map((s, i) => (
                  <tr key={s.id} className="border-b border-white/[0.02] last:border-b-0">
                    <td className="pl-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0"
                          style={{
                            backgroundColor: `${s.team.primaryColor}20`,
                            color: s.team.primaryColor || undefined,
                          }}
                        >
                          {s.team.shortName?.charAt(0)}
                        </div>
                        <span className="text-[12px] font-semibold text-text-primary">
                          {s.team.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-2.5 text-[12px] font-score text-text-muted">{s.played}</td>
                    <td className="text-center py-2.5 text-[12px] font-score text-text-muted">{s.won}</td>
                    <td className="text-center py-2.5 text-[12px] font-score text-text-muted">{s.drawn}</td>
                    <td className="text-center py-2.5 text-[12px] font-score text-text-muted">{s.lost}</td>
                    <td className="text-center py-2.5 text-[12px] font-score text-text-muted">
                      {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                    </td>
                    <td className={`text-center pr-4 py-2.5 text-[12px] font-score font-bold ${i < 2 ? "text-tcl-red" : "text-text-primary"}`}>
                      {s.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* ── Knockout Bracket ── */}
      <div className="mt-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-4 bg-arsenal-gold rounded-full" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Day 2</span>
          </div>
          <h2 className="font-display font-black text-[24px] text-white leading-none tracking-tight">
            KNOCKOUT <span className="text-arsenal-gold">BRACKET</span>
          </h2>
        </div>

        {/* Quarterfinals */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3">Quarterfinals</p>
          <div className="grid grid-cols-2 gap-2">
            {QF_PAIRS.map((qf) => (
              <div key={qf.label} className="rounded-xl bg-bg-surface border border-white/[0.05] p-3">
                <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider mb-2 block">{qf.label}</span>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-text-primary">{qf.home}</span>
                  <span className="text-[9px] text-text-muted">vs</span>
                  <span className="text-[12px] font-bold text-text-primary">{qf.away}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semifinals */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3">Semifinals</p>
          <div className="grid grid-cols-2 gap-2">
            {["SF1", "SF2"].map((sf) => (
              <div key={sf} className="rounded-xl bg-bg-surface border border-white/[0.05] p-3">
                <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider mb-2 block">{sf}</span>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-text-muted">W-QF{sf === "SF1" ? "1" : "3"}</span>
                  <span className="text-[9px] text-text-muted">vs</span>
                  <span className="text-[12px] font-medium text-text-muted">W-QF{sf === "SF1" ? "2" : "4"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final */}
        <div className="rounded-2xl bg-bg-surface border border-arsenal-gold/15 p-5 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-arsenal-gold/50 to-transparent" />
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-arsenal-gold block mb-3">The Final</span>
          <div className="flex items-center justify-center gap-6">
            <span className="text-[14px] font-bold text-text-muted">W-SF1</span>
            <span className="text-[10px] text-text-muted">vs</span>
            <span className="text-[14px] font-bold text-text-muted">W-SF2</span>
          </div>
          <p className="text-[10px] text-text-muted mt-2">April 27, 2026 · 6:00 PM · Pitch A</p>
          <p className="text-[9px] text-arsenal-gold/60 mt-1">Winner earns the Road to London</p>
        </div>
      </div>
    </PageContainer>
  );
}
