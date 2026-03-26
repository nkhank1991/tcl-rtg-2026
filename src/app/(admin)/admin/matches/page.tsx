"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Filter, Eye } from "lucide-react";

type Score = {
  id: string;
  matchId: string;
  homeGoals: number;
  awayGoals: number;
  homePenalties: number | null;
  awayPenalties: number | null;
};

type Team = {
  id: string;
  name: string;
};

type Pitch = {
  id: string;
  name: string;
};

type Group = {
  id: string;
  name: string;
};

type Match = {
  id: string;
  matchNumber: number | null;
  stage: string;
  status: string;
  scheduledAt: string;
  homeTeam: Team | null;
  awayTeam: Team | null;
  score: Score | null;
  pitch: Pitch | null;
  group: Group | null;
};

const STAGES = ["GROUP", "QUARTER_FINAL", "SEMI_FINAL", "THIRD_PLACE", "FINAL"] as const;
const STATUSES = [
  "SCHEDULED",
  "LIVE_FIRST_HALF",
  "HALF_TIME",
  "LIVE_SECOND_HALF",
  "FULL_TIME",
  "PENALTIES",
  "COMPLETED",
  "POSTPONED",
  "CANCELLED",
] as const;

function formatStage(stage: string) {
  return stage.replace(/_/g, " ");
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

function statusColor(status: string) {
  switch (status) {
    case "LIVE_FIRST_HALF":
    case "LIVE_SECOND_HALF":
      return "text-green-400";
    case "HALF_TIME":
    case "PENALTIES":
      return "text-yellow-400";
    case "FULL_TIME":
    case "COMPLETED":
      return "text-white/60";
    case "POSTPONED":
    case "CANCELLED":
      return "text-red-400";
    default:
      return "text-white/40";
  }
}

export default function MatchesPage() {
  const router = useRouter();
  const [stageFilter, setStageFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ["admin-matches", stageFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (stageFilter) params.set("stage", stageFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/matches?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Matches"
        description="Manage match schedules, scores, and events"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-white/40" />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
        >
          <option value="">All Stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {formatStage(s)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatStatus(s)}
            </option>
          ))}
        </select>
        {(stageFilter || statusFilter) && (
          <button
            onClick={() => {
              setStageFilter("");
              setStatusFilter("");
            }}
            className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center text-white/40">Loading matches...</div>
        ) : !matches?.length ? (
          <div className="py-12 text-center text-white/40">No matches found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3">
                  #
                </th>
                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3">
                  Teams
                </th>
                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3">
                  Score
                </th>
                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3">
                  Stage
                </th>
                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3">
                  Pitch
                </th>
                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3">
                  Scheduled
                </th>
                <th className="text-right text-xs font-medium text-white/40 uppercase tracking-wider pb-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {matches.map((match) => (
                <tr
                  key={match.id}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() =>
                    router.push(`/admin/matches/${match.id}`)
                  }
                >
                  <td className="py-3 text-sm text-white/60">
                    {match.matchNumber ?? "-"}
                  </td>
                  <td className="py-3 text-sm text-white">
                    <span className="font-medium">
                      {match.homeTeam?.name ?? "TBD"}
                    </span>
                    <span className="text-white/40 mx-2">vs</span>
                    <span className="font-medium">
                      {match.awayTeam?.name ?? "TBD"}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white font-mono">
                    {match.score
                      ? `${match.score.homeGoals} - ${match.score.awayGoals}${
                          match.score.homePenalties != null
                            ? ` (${match.score.homePenalties}-${match.score.awayPenalties} pen)`
                            : ""
                        }`
                      : "-"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-sm font-medium ${statusColor(match.status)}`}
                    >
                      {formatStatus(match.status)}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-white/60">
                    {formatStage(match.stage)}
                  </td>
                  <td className="py-3 text-sm text-white/60">
                    {match.pitch?.name ?? "-"}
                  </td>
                  <td className="py-3 text-sm text-white/60">
                    {new Date(match.scheduledAt).toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/matches/${match.id}`);
                      }}
                      className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="h-3 w-3" />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
