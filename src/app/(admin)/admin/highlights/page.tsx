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
  Video,
  ImageIcon,
  Play,
} from "lucide-react";

interface Highlight {
  id: string;
  title: string;
  description: string | null;
  mediaUrl: string;
  mediaType: string;
  thumbnailUrl: string | null;
  matchId: string | null;
  category: string | null;
  order: number;
  publishedAt: string;
}

type HighlightForm = {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: "video" | "image";
  thumbnailUrl: string;
  category: string;
};

const emptyForm: HighlightForm = {
  title: "",
  description: "",
  mediaUrl: "",
  mediaType: "video",
  thumbnailUrl: "",
  category: "",
};

export default function AdminHighlightsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HighlightForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: highlights = [], isLoading } = useQuery<Highlight[]>({
    queryKey: ["admin", "highlights"],
    queryFn: async () => {
      const res = await fetch("/api/admin/highlights");
      if (!res.ok) throw new Error("Failed to fetch highlights");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<HighlightForm>) => {
      const res = await fetch("/api/admin/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create highlight");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "highlights"] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HighlightForm> }) => {
      const res = await fetch(`/api/admin/highlights/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update highlight");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "highlights"] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/highlights/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete highlight");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "highlights"] });
      setDeleteId(null);
    },
  });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(item: Highlight) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description ?? "",
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType as "video" | "image",
      thumbnailUrl: item.thumbnailUrl ?? "",
      category: item.category ?? "",
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
      mediaUrl: form.mediaUrl,
      mediaType: form.mediaType,
      thumbnailUrl: form.thumbnailUrl || undefined,
      category: form.category || undefined,
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
        title="Highlights"
        description="Manage video and image highlights"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            <Plus size={16} />
            Add Highlight
          </button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : highlights.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <Video size={40} className="mx-auto text-white/20" />
          <p className="mt-3 text-white/50">No highlights yet</p>
          <button
            onClick={openCreate}
            className="mt-4 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            Add your first highlight
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
            >
              <div className="relative aspect-video bg-black/30">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : item.mediaType === "image" ? (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Play size={40} className="text-white/30" />
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white/80">
                  {item.mediaType}
                </span>
                {item.category && (
                  <span className="absolute right-2 top-2 rounded bg-[#E4002B]/80 px-2 py-0.5 text-xs text-white">
                    {item.category}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-white truncate">{item.title}</h3>
                {item.description && (
                  <p className="mt-1 text-sm text-white/50 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-white/30">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
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
                {editingId ? "Edit Highlight" : "Add Highlight"}
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
                  placeholder="Highlight title"
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
                  <label className="mb-1 block text-sm text-white/70">Media Type</label>
                  <select
                    value={form.mediaType}
                    onChange={(e) =>
                      setForm({ ...form, mediaType: e.target.value as "video" | "image" })
                    }
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#E4002B] focus:outline-none"
                  >
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/70">Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                    placeholder="e.g. Goals, Skills"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/70">Media</label>
                <div className="flex items-center gap-3">
                  <CldUploadWidget
                    uploadPreset="tcl_unsigned"
                    onSuccess={(result: any) => {
                      if (typeof result.info === "object")
                        setForm({ ...form, mediaUrl: result.info.secure_url });
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
                      >
                        {form.mediaType === "video" ? (
                          <Video size={14} className="mr-2 inline" />
                        ) : (
                          <ImageIcon size={14} className="mr-2 inline" />
                        )}
                        Upload Media
                      </button>
                    )}
                  </CldUploadWidget>
                  {form.mediaUrl && (
                    <span className="truncate text-xs text-green-400 max-w-[200px]">
                      Uploaded
                    </span>
                  )}
                </div>
                {form.mediaUrl && (
                  <input
                    value={form.mediaUrl}
                    onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
                    className="mt-2 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                    placeholder="Or paste URL directly"
                  />
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/70">Thumbnail</label>
                <div className="flex items-center gap-3">
                  <CldUploadWidget
                    uploadPreset="tcl_unsigned"
                    onSuccess={(result: any) => {
                      if (typeof result.info === "object")
                        setForm({ ...form, thumbnailUrl: result.info.secure_url });
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
                      >
                        <ImageIcon size={14} className="mr-2 inline" />
                        Upload Thumbnail
                      </button>
                    )}
                  </CldUploadWidget>
                  {form.thumbnailUrl && (
                    <img
                      src={form.thumbnailUrl}
                      alt="Thumbnail preview"
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
                  disabled={isSaving || !form.title || !form.mediaUrl}
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
            <h3 className="text-lg font-semibold text-white">Delete Highlight</h3>
            <p className="mt-2 text-sm text-white/50">
              Are you sure you want to delete this highlight? This action cannot be undone.
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
