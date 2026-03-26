"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CldUploadWidget } from "next-cloudinary";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  Clock,
  Users,
  ImageIcon,
} from "lucide-react";

interface ZoneSchedule {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  status: "UPCOMING" | "ACTIVE" | "PAUSED" | "COMPLETED";
  category: string | null;
  capacity: number | null;
  order: number;
}

type ZoneForm = {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  startTime: string;
  endTime: string;
  status: ZoneSchedule["status"];
  category: string;
  capacity: string;
};

const emptyForm: ZoneForm = {
  title: "",
  description: "",
  imageUrl: "",
  location: "",
  startTime: "",
  endTime: "",
  status: "UPCOMING",
  category: "",
  capacity: "",
};

const statusColors: Record<string, string> = {
  UPCOMING: "bg-blue-500/20 text-blue-400",
  ACTIVE: "bg-green-500/20 text-green-400",
  PAUSED: "bg-yellow-500/20 text-yellow-400",
  COMPLETED: "bg-white/10 text-white/50",
};

const statusOptions: ZoneSchedule["status"][] = [
  "UPCOMING",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
];

function toLocalDatetime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function AdminZonePage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ZoneForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: zones = [], isLoading } = useQuery<ZoneSchedule[]>({
    queryKey: ["admin", "zone"],
    queryFn: async () => {
      const res = await fetch("/api/admin/zone");
      if (!res.ok) throw new Error("Failed to fetch zone schedules");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch("/api/admin/zone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create zone activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "zone"] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await fetch(`/api/admin/zone/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update zone activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "zone"] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/zone/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete zone activity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "zone"] });
      setDeleteId(null);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/zone/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "zone"] });
    },
  });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(item: ZoneSchedule) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      location: item.location ?? "",
      startTime: toLocalDatetime(item.startTime),
      endTime: toLocalDatetime(item.endTime),
      status: item.status,
      category: item.category ?? "",
      capacity: item.capacity?.toString() ?? "",
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
    const payload: Record<string, unknown> = {
      title: form.title,
      description: form.description || undefined,
      imageUrl: form.imageUrl || undefined,
      location: form.location || undefined,
      startTime: form.startTime ? new Date(form.startTime).toISOString() : undefined,
      endTime: form.endTime ? new Date(form.endTime).toISOString() : undefined,
      status: form.status,
      category: form.category || undefined,
      capacity: form.capacity ? parseInt(form.capacity, 10) : undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function formatTime(iso: string) {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Zone"
        description="Manage zone activities and schedules"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            <Plus size={16} />
            Add Activity
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
      ) : zones.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <MapPin size={40} className="mx-auto text-white/20" />
          <p className="mt-3 text-white/50">No zone activities yet</p>
          <button
            onClick={openCreate}
            className="mt-4 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            Add your first activity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((item) => (
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
                  <MapPin size={40} className="text-white/20" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-white truncate">{item.title}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[item.status] ?? "bg-white/10 text-white/50"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-1 text-sm text-white/50 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 space-y-1.5 text-xs text-white/40">
                  {item.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} />
                      <span>{item.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </span>
                  </div>
                  {item.capacity && (
                    <div className="flex items-center gap-1.5">
                      <Users size={12} />
                      <span>Capacity: {item.capacity}</span>
                    </div>
                  )}
                  {item.category && (
                    <span className="inline-block rounded bg-white/10 px-2 py-0.5 text-white/50">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Status toggle buttons */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        s !== item.status && statusMutation.mutate({ id: item.id, status: s })
                      }
                      disabled={statusMutation.isPending}
                      className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                        s === item.status
                          ? statusColors[s]
                          : "bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex justify-end gap-2">
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
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {editingId ? "Edit Activity" : "Add Activity"}
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
                  placeholder="Activity title"
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
                  <label className="mb-1 block text-sm text-white/70">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                    placeholder="e.g. Main Stage"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/70">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                    placeholder="e.g. Music, Games"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-white/70">Start Time</label>
                  <input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/70">End Time</label>
                  <input
                    type="datetime-local"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    required
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm text-white/70">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as ZoneSchedule["status"] })
                    }
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PAUSED">Paused</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/70">Capacity</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    min={1}
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                    placeholder="Optional"
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
                  disabled={isSaving || !form.title || !form.startTime || !form.endTime}
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
            <h3 className="text-lg font-semibold text-white">Delete Activity</h3>
            <p className="mt-2 text-sm text-white/50">
              Are you sure you want to delete this activity? This action cannot be undone.
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
