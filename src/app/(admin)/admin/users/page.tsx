"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Search, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";

type User = {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type UsersResponse = {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const ALL_ROLES = ["FAN", "CAPTAIN", "ADMIN", "SUPER_ADMIN"] as const;

const roleBadge: Record<string, string> = {
  FAN: "bg-gray-500/20 text-gray-400",
  CAPTAIN: "bg-blue-500/20 text-blue-400",
  ADMIN: "bg-purple-500/20 text-purple-400",
  SUPER_ADMIN: "bg-red-500/20 text-red-400",
};

const inputClass =
  "w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none";
const primaryBtn =
  "rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors";
const secondaryBtn =
  "rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors";
const card = "rounded-xl border border-white/10 bg-white/5 p-4";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["admin", "users", search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setEditingUserId(null);
    },
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  const users = data?.users ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Users"
        description="Manage user accounts and roles (Super Admin only)"
      />

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={`${inputClass} pl-9`}
          />
        </div>
        <button type="submit" className={primaryBtn}>
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setPage(1);
            }}
            className={secondaryBtn}
          >
            Clear
          </button>
        )}
      </form>

      {/* Users Table */}
      {isLoading ? (
        <p className="text-sm text-white/50">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-white/50">No users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-medium uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Verified</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium text-white">
                      {user.name ?? "Unnamed"}
                    </td>
                    <td className="px-4 py-3 text-white/70">{user.phone}</td>
                    <td className="px-4 py-3">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className={`${inputClass} w-auto`}
                          >
                            {ALL_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() =>
                              updateMutation.mutate({
                                id: user.id,
                                role: editRole,
                              })
                            }
                            disabled={updateMutation.isPending}
                            className="text-xs text-green-400 hover:text-green-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="text-xs text-white/40 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge[user.role] ?? "bg-gray-500/20 text-gray-400"}`}
                        >
                          {user.role.replace("_", " ")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.isVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-white/30" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {editingUserId !== user.id && (
                        <button
                          onClick={() => {
                            setEditingUserId(user.id);
                            setEditRole(user.role);
                          }}
                          className="text-xs text-[#E4002B] hover:text-[#c0001f]"
                        >
                          Edit Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/50">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.total
                )}{" "}
                of {pagination.total} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`${secondaryBtn} disabled:opacity-30`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="flex items-center px-3 text-sm text-white/60">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                  className={`${secondaryBtn} disabled:opacity-30`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
