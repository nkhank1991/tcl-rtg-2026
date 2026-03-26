"use client";

import { useState } from "react";
import { use } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  ArrowLeft,
  Save,
  Trash2,
  Plus,
  X,
  Pencil,
  UserRound,
} from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface Group {
  id: string;
  name: string;
  order: number;
}

interface Team {
  id: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  groupId: string | null;
  group: Group | null;
  bio: string | null;
  source: string | null;
  _count: { players: number };
}

interface Player {
  id: string;
  teamId: string;
  name: string;
  position: string | null;
  number: number | null;
  photoUrl: string | null;
  isCaptain: boolean;
}

export default function AdminTeamDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const queryClient = useQueryClient();

  // Team form state
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [bio, setBio] = useState("");
  const [source, setSource] = useState("");
  const [groupId, setGroupId] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Player dialog state
  const [showPlayerDialog, setShowPlayerDialog] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [playerPosition, setPlayerPosition] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");
  const [playerIsCaptain, setPlayerIsCaptain] = useState(false);

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  const { data: team, isLoading } = useQuery<Team>({
    queryKey: ["admin", "teams", teamId],
    queryFn: async () => {
      const res = await fetch("/api/admin/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      const teams: Team[] = await res.json();
      const found = teams.find((t) => t.id === teamId);
      if (!found) throw new Error("Team not found");
      return found;
    },
  });

  const { data: players, isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["admin", "teams", teamId, "players"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/teams/${teamId}/players`);
      if (!res.ok) throw new Error("Failed to fetch players");
      return res.json();
    },
  });

  // Extract groups from team query for the dropdown
  const { data: groups } = useQuery<Group[]>({
    queryKey: ["admin", "groups"],
    queryFn: async () => {
      const res = await fetch("/api/admin/teams");
      if (!res.ok) return [];
      const data: Team[] = await res.json();
      const groupMap = new Map<string, Group>();
      for (const t of data) {
        if (t.group) groupMap.set(t.group.id, t.group);
      }
      return Array.from(groupMap.values()).sort((a, b) => a.order - b.order);
    },
  });

  // Initialize form when team data loads
  if (team && !initialized) {
    setName(team.name);
    setShortName(team.shortName || "");
    setPrimaryColor(team.primaryColor || "");
    setBio(team.bio || "");
    setSource(team.source || "");
    setGroupId(team.groupId || "");
    setLogoUrl(team.logoUrl || "");
    setInitialized(true);
  }

  const updateTeamMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(`/api/admin/teams/${teamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update team");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/teams/${teamId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete team");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      window.location.href = "/admin/teams";
    },
  });

  const createPlayerMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(`/api/admin/teams/${teamId}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create player");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "teams", teamId, "players"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      closePlayerDialog();
    },
  });

  const updatePlayerMutation = useMutation({
    mutationFn: async ({
      playerId,
      data,
    }: {
      playerId: string;
      data: Record<string, unknown>;
    }) => {
      const res = await fetch(
        `/api/admin/teams/${teamId}/players/${playerId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update player");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "teams", teamId, "players"],
      });
      closePlayerDialog();
    },
  });

  const deletePlayerMutation = useMutation({
    mutationFn: async (playerId: string) => {
      const res = await fetch(
        `/api/admin/teams/${teamId}/players/${playerId}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete player");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "teams", teamId, "players"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      setPlayerToDelete(null);
    },
  });

  function closePlayerDialog() {
    setShowPlayerDialog(false);
    setEditingPlayer(null);
    setPlayerName("");
    setPlayerPosition("");
    setPlayerNumber("");
    setPlayerIsCaptain(false);
  }

  function openAddPlayer() {
    setEditingPlayer(null);
    setPlayerName("");
    setPlayerPosition("");
    setPlayerNumber("");
    setPlayerIsCaptain(false);
    setShowPlayerDialog(true);
  }

  function openEditPlayer(player: Player) {
    setEditingPlayer(player);
    setPlayerName(player.name);
    setPlayerPosition(player.position || "");
    setPlayerNumber(player.number?.toString() || "");
    setPlayerIsCaptain(player.isCaptain);
    setShowPlayerDialog(true);
  }

  function handleSaveTeam(e: React.FormEvent) {
    e.preventDefault();
    updateTeamMutation.mutate({
      name,
      shortName: shortName || null,
      primaryColor: primaryColor || null,
      bio: bio || null,
      source: source || null,
      groupId: groupId || null,
      logoUrl: logoUrl || null,
    });
  }

  function handleSavePlayer(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: playerName,
      position: playerPosition || null,
      number: playerNumber ? parseInt(playerNumber, 10) : null,
      isCaptain: playerIsCaptain,
    };

    if (editingPlayer) {
      updatePlayerMutation.mutate({ playerId: editingPlayer.id, data });
    } else {
      createPlayerMutation.mutate(data);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-white/10" />
        <div className="h-64 animate-pulse rounded-xl border border-white/10 bg-white/5" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <p className="text-white/50">Team not found</p>
        <a
          href="/admin/teams"
          className="mt-4 inline-block rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
        >
          Back to Teams
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={team.name}
        description="Edit team details and manage roster"
        action={
          <div className="flex items-center gap-3">
            <a
              href="/admin/teams"
              className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </a>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        }
      />

      {/* Delete Team Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
            <h3 className="text-lg font-semibold text-white">Delete Team?</h3>
            <p className="mt-2 text-sm text-white/50">
              This will permanently delete &ldquo;{team.name}&rdquo; and all its
              players. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTeamMutation.mutate()}
                disabled={deleteTeamMutation.isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteTeamMutation.isPending ? "Deleting..." : "Delete Team"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Info Form */}
      <form
        onSubmit={handleSaveTeam}
        className="rounded-xl border border-white/10 bg-white/5 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Team Info</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Team Name *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Short Name
            </label>
            <input
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="e.g. ABC"
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Primary Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor || "#E4002B"}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-9 w-9 cursor-pointer rounded border border-white/20 bg-transparent"
              />
              <input
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#E4002B"
                className="flex-1 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
              />
            </div>
          </div>
          {groups && groups.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Group
              </label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
              >
                <option value="">No group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Source
            </label>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Where the team is from"
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">
              Logo
            </label>
            <div className="flex items-center gap-3">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-10 w-10 rounded-lg object-cover"
                />
              )}
              <CldUploadWidget
                uploadPreset="tcl_unsigned"
                onSuccess={(result: any) => {
                  if (typeof result.info === "object")
                    setLogoUrl(result.info.secure_url);
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
                  >
                    {logoUrl ? "Change Logo" : "Upload Logo"}
                  </button>
                )}
              </CldUploadWidget>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/70 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Team bio or description"
              className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none resize-none"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            {updateTeamMutation.isSuccess && (
              <p className="text-sm text-green-400">Team updated</p>
            )}
            {updateTeamMutation.isError && (
              <p className="text-sm text-red-400">
                {updateTeamMutation.error.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={updateTeamMutation.isPending}
            className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            {updateTeamMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Player Roster */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Player Roster ({players?.length ?? 0})
          </h3>
          <button
            onClick={openAddPlayer}
            className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Player
          </button>
        </div>

        {playersLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg border border-white/10 bg-white/5"
              />
            ))}
          </div>
        ) : players && players.length > 0 ? (
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                    {player.number ?? "-"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {player.name}
                      </span>
                      {player.isCaptain && (
                        <span className="rounded bg-[#E4002B]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#E4002B] uppercase">
                          Captain
                        </span>
                      )}
                    </div>
                    {player.position && (
                      <p className="text-xs text-white/40">{player.position}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditPlayer(player)}
                    className="rounded p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
                    title="Edit player"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setPlayerToDelete(player)}
                    className="rounded p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    title="Remove player"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <UserRound size={32} className="mx-auto text-white/20" />
            <p className="mt-2 text-sm text-white/40">No players yet</p>
          </div>
        )}
      </div>

      {/* Player Add/Edit Dialog */}
      {showPlayerDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {editingPlayer ? "Edit Player" : "Add Player"}
              </h3>
              <button
                onClick={closePlayerDialog}
                className="text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePlayer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Player Name *
                </label>
                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                  placeholder="Full name"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Position
                  </label>
                  <input
                    value={playerPosition}
                    onChange={(e) => setPlayerPosition(e.target.value)}
                    placeholder="e.g. Midfielder"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={playerIsCaptain}
                  onChange={(e) => setPlayerIsCaptain(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#E4002B] focus:ring-[#E4002B]"
                />
                <span className="text-sm text-white/70">Team Captain</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePlayerDialog}
                  className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createPlayerMutation.isPending ||
                    updatePlayerMutation.isPending
                  }
                  className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors disabled:opacity-50"
                >
                  {createPlayerMutation.isPending ||
                  updatePlayerMutation.isPending
                    ? "Saving..."
                    : editingPlayer
                      ? "Update Player"
                      : "Add Player"}
                </button>
              </div>
              {(createPlayerMutation.isError ||
                updatePlayerMutation.isError) && (
                <p className="text-sm text-red-400">
                  {createPlayerMutation.error?.message ||
                    updatePlayerMutation.error?.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Delete Player Confirmation */}
      {playerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
            <h3 className="text-lg font-semibold text-white">
              Remove Player?
            </h3>
            <p className="mt-2 text-sm text-white/50">
              Remove &ldquo;{playerToDelete.name}&rdquo; from the roster? This
              action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setPlayerToDelete(null)}
                className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deletePlayerMutation.mutate(playerToDelete.id)}
                disabled={deletePlayerMutation.isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletePlayerMutation.isPending ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
