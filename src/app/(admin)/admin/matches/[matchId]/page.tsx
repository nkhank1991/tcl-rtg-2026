"use client";

import { useState, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  ArrowLeft,
  Save,
  Plus,
  Goal,
  AlertTriangle,
  Square,
  RefreshCw,
  CircleDot,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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
  startedAt: string | null;
  endedAt: string | null;
  homeTeamId: string | null;
  awayTeamId: string | null;
  pitchId: string | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  score: Score | null;
  pitch: Pitch | null;
  group: Group | null;
};

type MatchEvent = {
  id: string;
  matchId: string;
  type: string;
  minute: number;
  teamSide: string;
  playerName: string | null;
  detail: string | null;
  createdAt: string;
};

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

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

const EVENT_TYPES = [
  "GOAL",
  "YELLOW_CARD",
  "RED_CARD",
  "SUBSTITUTION",
  "PENALTY",
] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatStatus(s: string) {
  return s.replace(/_/g, " ");
}

function formatStage(s: string) {
  return s.replace(/_/g, " ");
}

function eventIcon(type: string) {
  switch (type) {
    case "GOAL":
      return <Goal className="h-4 w-4 text-green-400" />;
    case "YELLOW_CARD":
      return <Square className="h-4 w-4 text-yellow-400 fill-yellow-400" />;
    case "RED_CARD":
      return <Square className="h-4 w-4 text-red-500 fill-red-500" />;
    case "SUBSTITUTION":
      return <RefreshCw className="h-4 w-4 text-blue-400" />;
    case "PENALTY":
      return <CircleDot className="h-4 w-4 text-orange-400" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-white/40" />;
  }
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ----- Data fetching ----- */
  const {
    data: match,
    isLoading,
    error,
  } = useQuery<Match>({
    queryKey: ["admin-match", matchId],
    queryFn: async () => {
      // Re-use the list endpoint and find this match (or fetch individually via PATCH with empty body is wrong)
      // We'll fetch from the list and filter; alternatively we could add a GET single route.
      const res = await fetch(`/api/admin/matches?`);
      if (!res.ok) throw new Error("Failed to fetch matches");
      const all: Match[] = await res.json();
      const found = all.find((m) => m.id === matchId);
      if (!found) throw new Error("Match not found");
      return found;
    },
  });

  const { data: events = [], refetch: refetchEvents } = useQuery<MatchEvent[]>({
    queryKey: ["admin-match-events", matchId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/matches/${matchId}/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const { data: allTeams = [] } = useQuery<Team[]>({
    queryKey: ["admin-teams-for-match"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/teams`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: allPitches = [] } = useQuery<Pitch[]>({
    queryKey: ["admin-pitches-for-match"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/pitches`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  /* ----- Local form state ----- */
  const [status, setStatus] = useState<string>("");
  const [homeGoals, setHomeGoals] = useState<number>(0);
  const [awayGoals, setAwayGoals] = useState<number>(0);
  const [homePenalties, setHomePenalties] = useState<string>("");
  const [awayPenalties, setAwayPenalties] = useState<string>("");
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");
  const [pitchId, setPitchId] = useState<string>("");
  const [formInitialized, setFormInitialized] = useState(false);

  // Sync once when match loads
  if (match && !formInitialized) {
    setStatus(match.status);
    setHomeGoals(match.score?.homeGoals ?? 0);
    setAwayGoals(match.score?.awayGoals ?? 0);
    setHomePenalties(
      match.score?.homePenalties != null ? String(match.score.homePenalties) : ""
    );
    setAwayPenalties(
      match.score?.awayPenalties != null ? String(match.score.awayPenalties) : ""
    );
    setHomeTeamId(match.homeTeamId ?? "");
    setAwayTeamId(match.awayTeamId ?? "");
    setPitchId(match.pitchId ?? "");
    setFormInitialized(true);
  }

  /* ----- Event form state ----- */
  const [eventType, setEventType] = useState<string>("GOAL");
  const [eventMinute, setEventMinute] = useState<number>(0);
  const [eventTeamSide, setEventTeamSide] = useState<string>("HOME");
  const [eventPlayerName, setEventPlayerName] = useState<string>("");
  const [eventDetail, setEventDetail] = useState<string>("");

  /* ----- Mutations ----- */
  const updateMatch = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(`/api/admin/matches/${matchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update match");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-match", matchId] });
      queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
    },
  });

  const createEvent = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(`/api/admin/matches/${matchId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create event");
      }
      return res.json();
    },
    onSuccess: () => {
      refetchEvents();
      setEventPlayerName("");
      setEventDetail("");
      setEventMinute(0);
    },
  });

  /* ----- Handlers ----- */
  function handleSaveMatch() {
    const payload: Record<string, unknown> = { status };

    if (homeTeamId) payload.homeTeamId = homeTeamId;
    else payload.homeTeamId = null;

    if (awayTeamId) payload.awayTeamId = awayTeamId;
    else payload.awayTeamId = null;

    if (pitchId) payload.pitchId = pitchId;
    else payload.pitchId = null;

    payload.score = {
      homeGoals,
      awayGoals,
      homePenalties: homePenalties !== "" ? Number(homePenalties) : null,
      awayPenalties: awayPenalties !== "" ? Number(awayPenalties) : null,
    };

    updateMatch.mutate(payload);
  }

  function handleAddEvent() {
    createEvent.mutate({
      type: eventType,
      minute: eventMinute,
      teamSide: eventTeamSide,
      playerName: eventPlayerName || null,
      detail: eventDetail || null,
    });
  }

  /* ----- Render ----- */
  if (isLoading) {
    return (
      <div className="py-24 text-center text-white/40">Loading match...</div>
    );
  }

  if (error || !match) {
    return (
      <div className="py-24 text-center text-red-400">
        Failed to load match. <br />
        <button
          onClick={() => router.push("/admin/matches")}
          className="mt-4 rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
        >
          Back to Matches
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Match #${match.matchNumber ?? "-"}`}
        description={`${match.homeTeam?.name ?? "TBD"} vs ${match.awayTeam?.name ?? "TBD"} — ${formatStage(match.stage)}`}
        action={
          <button
            onClick={() => router.push("/admin/matches")}
            className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ---- Score & Status Card ---- */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-5">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Score &amp; Status
          </h2>

          {/* Status */}
          <div>
            <label className="mb-1 block text-xs text-white/40">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {formatStatus(s)}
                </option>
              ))}
            </select>
          </div>

          {/* Goals */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-white/40">
                Home Goals ({match.homeTeam?.name ?? "TBD"})
              </label>
              <input
                type="number"
                min={0}
                value={homeGoals}
                onChange={(e) => setHomeGoals(Number(e.target.value))}
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">
                Away Goals ({match.awayTeam?.name ?? "TBD"})
              </label>
              <input
                type="number"
                min={0}
                value={awayGoals}
                onChange={(e) => setAwayGoals(Number(e.target.value))}
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
              />
            </div>
          </div>

          {/* Penalties */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-white/40">
                Home Penalties
              </label>
              <input
                type="number"
                min={0}
                value={homePenalties}
                onChange={(e) => setHomePenalties(e.target.value)}
                placeholder="N/A"
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-white/40">
                Away Penalties
              </label>
              <input
                type="number"
                min={0}
                value={awayPenalties}
                onChange={(e) => setAwayPenalties(e.target.value)}
                placeholder="N/A"
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSaveMatch}
            disabled={updateMatch.isPending}
            className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {updateMatch.isPending ? "Saving..." : "Save Match"}
          </button>

          {updateMatch.isError && (
            <p className="text-sm text-red-400">
              {(updateMatch.error as Error).message}
            </p>
          )}
          {updateMatch.isSuccess && (
            <p className="text-sm text-green-400">Match updated successfully.</p>
          )}
        </div>

        {/* ---- Team & Pitch Assignment Card ---- */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-5">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
            Team &amp; Pitch Assignment
          </h2>

          <div>
            <label className="mb-1 block text-xs text-white/40">Home Team</label>
            <select
              value={homeTeamId}
              onChange={(e) => setHomeTeamId(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
            >
              <option value="">TBD</option>
              {allTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/40">Away Team</label>
            <select
              value={awayTeamId}
              onChange={(e) => setAwayTeamId(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
            >
              <option value="">TBD</option>
              {allTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/40">Pitch</label>
            <select
              value={pitchId}
              onChange={(e) => setPitchId(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
            >
              <option value="">None</option>
              {allPitches.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <p className="text-xs text-white/40">
              <strong className="text-white/60">Stage:</strong>{" "}
              {formatStage(match.stage)}
            </p>
            <p className="text-xs text-white/40 mt-1">
              <strong className="text-white/60">Group:</strong>{" "}
              {match.group?.name ?? "N/A"}
            </p>
            <p className="text-xs text-white/40 mt-1">
              <strong className="text-white/60">Scheduled:</strong>{" "}
              {new Date(match.scheduledAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ---- Match Events ---- */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-5">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          Match Events
        </h2>

        {/* Add event form */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <div>
            <label className="mb-1 block text-xs text-white/40">Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/40">Minute</label>
            <input
              type="number"
              min={0}
              value={eventMinute}
              onChange={(e) => setEventMinute(Number(e.target.value))}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/40">Side</label>
            <select
              value={eventTeamSide}
              onChange={(e) => setEventTeamSide(e.target.value)}
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
            >
              <option value="HOME">Home</option>
              <option value="AWAY">Away</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/40">Player</label>
            <input
              type="text"
              value={eventPlayerName}
              onChange={(e) => setEventPlayerName(e.target.value)}
              placeholder="Player name"
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/40">Detail</label>
            <input
              type="text"
              value={eventDetail}
              onChange={(e) => setEventDetail(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddEvent}
              disabled={createEvent.isPending}
              className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors inline-flex items-center gap-2 disabled:opacity-50 w-full justify-center"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {createEvent.isError && (
          <p className="text-sm text-red-400">
            {(createEvent.error as Error).message}
          </p>
        )}

        {/* Events list */}
        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-white/30">
            No events recorded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
              >
                {eventIcon(ev.type)}
                <span className="text-sm font-mono text-white/60 w-10 shrink-0">
                  {ev.minute}&apos;
                </span>
                <span className="text-sm text-white/80">
                  {ev.type.replace(/_/g, " ")}
                </span>
                <span className="text-sm text-white/40">
                  ({ev.teamSide})
                </span>
                {ev.playerName && (
                  <span className="text-sm text-white">{ev.playerName}</span>
                )}
                {ev.detail && (
                  <span className="text-sm text-white/40 ml-auto">
                    {ev.detail}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
