"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RefreshCw, Loader2, Clock } from "lucide-react";

interface Team {
  id: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
}

interface Standing {
  id: string;
  groupId: string;
  teamId: string;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
  lastUpdated: string;
}

interface Group {
  id: string;
  name: string;
  order: number;
  standings: Standing[];
}

interface RecalculateResult {
  success: boolean;
  matchesProcessed: number;
  groupsUpdated: number;
  lastUpdated: string;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminStandingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ groups: Group[] }>({
    queryKey: ["admin", "standings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/standings");
      if (!res.ok) throw new Error("Failed to fetch standings");
      return res.json();
    },
  });

  const recalcMutation = useMutation<RecalculateResult>({
    mutationFn: async () => {
      const res = await fetch("/api/admin/standings/recalculate", {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to recalculate");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "standings"] });
    },
  });

  const groups = data?.groups ?? [];

  // Find the most recent lastUpdated across all standings
  const lastUpdated = groups
    .flatMap((g) => g.standings)
    .reduce<string | null>((latest, s) => {
      if (!latest) return s.lastUpdated;
      return new Date(s.lastUpdated) > new Date(latest)
        ? s.lastUpdated
        : latest;
    }, null);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Standings"
        description="Group standings and recalculation"
        action={
          <button
            onClick={() => recalcMutation.mutate()}
            disabled={recalcMutation.isPending}
            className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {recalcMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            Recalculate
          </button>
        }
      />

      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Clock size={14} />
          <span>
            Last updated:{" "}
            {lastUpdated ? formatTimestamp(lastUpdated) : "Never"}
          </span>
        </div>
        {recalcMutation.isSuccess && (
          <span className="text-sm text-green-400">
            Recalculated: {recalcMutation.data.matchesProcessed} matches across{" "}
            {recalcMutation.data.groupsUpdated} groups
          </span>
        )}
        {recalcMutation.isError && (
          <span className="text-sm text-red-400">
            {recalcMutation.error?.message || "Recalculation failed"}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/50">
            No groups found. Create groups and assign teams first.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <h3 className="mb-4 text-lg font-semibold text-white">
                {group.name}
              </h3>

              {group.standings.length === 0 ? (
                <p className="py-4 text-center text-sm text-white/40">
                  No standings yet. Click Recalculate to generate.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3 w-8">
                          #
                        </th>
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3">
                          Team
                        </th>
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3 w-10">
                          P
                        </th>
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3 w-10">
                          W
                        </th>
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3 w-10">
                          D
                        </th>
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3 w-10">
                          L
                        </th>
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3 w-12">
                          GF
                        </th>
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3 w-12">
                          GA
                        </th>
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3 w-12">
                          GD
                        </th>
                        <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider pb-3 w-12">
                          Pts
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.standings.map((s) => (
                        <tr
                          key={s.id}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="py-3 text-sm text-white/50">
                            {s.position}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {s.team.logoUrl ? (
                                <img
                                  src={s.team.logoUrl}
                                  alt={s.team.name}
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                              ) : (
                                <div
                                  className="h-6 w-6 rounded-full"
                                  style={{
                                    backgroundColor:
                                      s.team.primaryColor || "#333",
                                  }}
                                />
                              )}
                              <span className="text-sm font-medium text-white">
                                {s.team.shortName || s.team.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-white/70">
                            {s.played}
                          </td>
                          <td className="py-3 text-sm text-white/70">
                            {s.won}
                          </td>
                          <td className="py-3 text-sm text-white/70">
                            {s.drawn}
                          </td>
                          <td className="py-3 text-sm text-white/70">
                            {s.lost}
                          </td>
                          <td className="py-3 text-sm text-white/70">
                            {s.goalsFor}
                          </td>
                          <td className="py-3 text-sm text-white/70">
                            {s.goalsAgainst}
                          </td>
                          <td className="py-3 text-sm text-white/70">
                            {s.goalDifference > 0
                              ? `+${s.goalDifference}`
                              : s.goalDifference}
                          </td>
                          <td className="py-3 text-sm font-bold text-white">
                            {s.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
