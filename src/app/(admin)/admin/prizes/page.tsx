"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CldUploadWidget } from "next-cloudinary";
import { Plus, Pencil, Trash2, X, Gift, ImageIcon } from "lucide-react";

interface PrizePackage {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  value: string | null;
  tier: string;
  order: number;
}

type PrizeForm = {
  title: string;
  description: string;
  imageUrl: string;
  value: string;
  tier: "GRAND" | "RUNNER_UP" | "MVP";
};

const emptyForm: PrizeForm = {
  title: "",
  description: "",
  imageUrl: "",
  value: "",
  tier: "GRAND",
};

const tierLabels: Record<string, string> = {
  GRAND: "Grand Prize",
  RUNNER_UP: "Runner Up",
  MVP: "MVP",
};

const tierColors: Record<string, string> = {
  GRAND: "bg-yellow-500/20 text-yellow-400",
  RUNNER_UP: "bg-gray-400/20 text-gray-300",
  MVP: "bg-purple-500/20 text-purple-400",
};

export default function AdminPrizesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PrizeForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: prizes = [], isLoading } = useQuery<PrizePackage[]>({
    queryKey: ["admin", "prizes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/prizes");
      if (!res.ok) throw new Error("Failed to fetch prizes");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<PrizeForm>) => {
      const res = await fetch("/api/admin/prizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create prize");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "prizes"] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PrizeForm> }) => {
      const res = await fetch(`/api/admin/prizes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update prize");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "prizes"] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/prizes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete prize");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "prizes"] });
      setDeleteId(null);
    },
  });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(item: PrizePackage) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      value: item.value ?? "",
      tier: item.tier as PrizeForm["tier"],
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description || undefined,
      imageUrl: form.imageUrl || undefined,
      value: form.value || undefined,
      tier: form.tier,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Prizes"
        description="Manage prize packages and tiers"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            <Plus size={16} />
            Add Prize
          </button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : prizes.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <Gift size={40} className="mx-auto text-white/20" />
          <p className="mt-3 text-white/50">No prizes yet</p>
          <button
            onClick={openCreate}
            className="mt-4 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            Add your first prize
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prizes.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
            >
              {item.imageUrl ? (
                <div className="aspect-video bg-black/30">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-black/20">
                  <Gift size={40} className="text-white/20" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-medium text-white truncate">{item.title}</h3>
                    {item.description && (
                      <p className="mt-1 text-sm text-white/50 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tierColors[item.tier] ?? "bg-white/10 text-white/60"
                      }`}
                    >
                      {tierLabels[item.tier] ?? item.tier}
                    </span>
                    {item.value && (
                      <span className="text-sm font-medium text-white/70">
                        {item.value}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="rounded p-1.5 text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {editingId ? "Edit Prize" : "Add Prize"}
              </h3>
              <button onClick={closeDialog} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm text-white/70">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  placeholder="Prize title"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/70">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  placeholder="Optional description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-white/70">Tier</label>
                  <select
                    value={form.tier}
                    onChange={(e) =>
                      setForm({ ...form, tier: e.target.value as PrizeForm["tier"] })
                    }
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
                  >
                    <option value="GRAND">Grand Prize</option>
                    <option value="RUNNER_UP">Runner Up</option>
                    <option value="MVP">MVP</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/70">Value</label>
                  <input
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                    placeholder="e.g. $5,000"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/70">Image</label>
                <div className="flex items-center gap-3">
                  <CldUploadWidget
                    uploadPreset="tcl_unsigned"
                    onSuccess={(result: any) => {
                      if (typeof result.info === "object")
                        setForm({ ...form, imageUrl: result.info.secure_url });
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
                      >
                        <ImageIcon size={14} className="mr-2 inline" />
                        Upload Image
                      </button>
                    )}
                  </CldUploadWidget>
                  {form.imageUrl && (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="h-10 w-16 rounded object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !form.title}
                  className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
            <h3 className="text-lg font-semibold text-white">Delete Prize</h3>
            <p className="mt-2 text-sm text-white/50">
              Are you sure you want to delete this prize? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
