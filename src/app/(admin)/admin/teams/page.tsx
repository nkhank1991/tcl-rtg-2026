"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Plus, Users, X } from "lucide-react";

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

export default function AdminTeamsPage() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newShortName, setNewShortName] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newGroupId, setNewGroupId] = useState("");

  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["admin", "teams"],
    queryFn: async () => {
      const res = await fetch("/api/admin/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json();
    },
  });

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

  const createMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      shortName?: string;
      primaryColor?: string;
      groupId?: string;
    }) => {
      const res = await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create team");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "teams"] });
      setShowCreate(false);
      setNewName("");
      setNewShortName("");
      setNewColor("");
      setNewGroupId("");
    },
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate({
      name: newName,
      shortName: newShortName || undefined,
      primaryColor: newColor || undefined,
      groupId: newGroupId || undefined,
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Teams"
        description="Manage tournament teams and rosters"
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Plus size={16} />
              Add Team
            </span>
          </button>
        }
      />

      {/* Create Dialog */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Team</h3>
              <button
                onClick={() => setShowCreate(false)}
                className="text-white/40 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Team Name *
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="Enter team name"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1">
                  Short Name
                </label>
                <input
                  value={newShortName}
                  onChange={(e) => setNewShortName(e.target.value)}
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
                    value={newColor || "#E4002B"}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded border border-white/20 bg-transparent"
                  />
                  <input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
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
                    value={newGroupId}
                    onChange={(e) => setNewGroupId(e.target.value)}
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
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Create Team"}
                </button>
              </div>
              {createMutation.isError && (
                <p className="text-sm text-red-400">
                  {createMutation.error.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Team Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : teams && teams.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <a
              key={team.id}
              href={`/admin/teams/${team.id}`}
              className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start gap-3">
                {team.logoUrl ? (
                  <img
                    src={team.logoUrl}
                    alt={team.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg text-white font-bold text-sm"
                    style={{
                      backgroundColor: team.primaryColor
                        ? `${team.primaryColor}30`
                        : "rgba(255,255,255,0.1)",
                    }}
                  >
                    {team.shortName || team.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate group-hover:text-[#E4002B] transition-colors">
                    {team.name}
                  </h3>
                  {team.shortName && (
                    <p className="text-xs text-white/40">{team.shortName}</p>
                  )}
                </div>
                {team.primaryColor && (
                  <div
                    className="h-4 w-4 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: team.primaryColor }}
                    title={team.primaryColor}
                  />
                )}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
                {team.group && (
                  <span className="rounded bg-white/10 px-2 py-0.5">
                    {team.group.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {team._count.players} player{team._count.players !== 1 ? "s" : ""}
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <Users size={40} className="mx-auto text-white/20" />
          <p className="mt-3 text-white/50">No teams yet</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            Add First Team
          </button>
        </div>
      )}
    </div>
  );
}
