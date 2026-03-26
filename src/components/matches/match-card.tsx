"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";

interface MatchCardProps {
  match: {
    id: string;
    matchNumber: number | null;
    stage: string;
    status: string;
    scheduledAt: string;
    homeTeam: { name: string; shortName: string | null } | null;
    awayTeam: { name: string; shortName: string | null } | null;
    score: { homeGoals: number; awayGoals: number } | null;
    pitch: { name: string } | null;
    group?: { name: string } | null;
  };
}

export function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status.includes("LIVE") || match.status === "HALF_TIME";
  const isCompleted = match.status === "COMPLETED" || match.status === "FULL_TIME";
  const isScheduled = match.status === "SCHEDULED";

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <div className={`rounded-2xl bg-bg-surface border transition-all active:scale-[0.99] ${
        isLive ? "border-tcl-red/20" : "border-white/[0.05] hover:border-white/[0.08]"
      } ${isCompleted ? "opacity-70" : ""}`}>
        <div className="px-4 py-3.5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isLive && (
                <Badge variant="live" className="text-[8px] px-2 py-0 h-4 tracking-wider">
                  <span className="relative flex h-1.5 w-1.5 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-live" />
                  </span>
                  LIVE
                </Badge>
              )}
              {isCompleted && <span className="text-[9px] font-bold text-white/25 uppercase tracking-wider">Full Time</span>}
              {isScheduled && <span className="text-[9px] font-bold text-white/25 uppercase tracking-wider">Upcoming</span>}
              {match.group && <span className="text-[9px] text-white/20">{match.group.name}</span>}
            </div>
            <span className="text-[9px] text-white/20 font-medium">{match.pitch?.name}</span>
          </div>

          {/* Teams + Score */}
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white/90 truncate">{match.homeTeam?.name || "TBD"}</p>
            </div>
            <div className="flex flex-col items-center min-w-[64px]">
              {isScheduled ? (
                <span className="font-score text-[14px] font-bold text-white/50">{formatTime(match.scheduledAt)}</span>
              ) : (
                <span className="font-score text-[18px] font-black text-white">
                  {match.score ? `${match.score.homeGoals} - ${match.score.awayGoals}` : "- -"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[13px] font-bold text-white/90 truncate">{match.awayTeam?.name || "TBD"}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2.5 border-t border-white/[0.04]">
            <span className="text-[10px] text-white/20">{formatDate(match.scheduledAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
