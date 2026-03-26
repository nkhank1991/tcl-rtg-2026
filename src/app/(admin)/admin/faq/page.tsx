"use client";

import { useState, useCallback } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Loader2,
  GripVertical,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
}

interface FaqFormData {
  question: string;
  answer: string;
  category: string;
}

const EMPTY_FORM: FaqFormData = { question: "", answer: "", category: "" };

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export default function FaqAdminPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [formData, setFormData] = useState<FaqFormData>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);

  // ---------- Queries ----------
  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery<FaqItem[]>({
    queryKey: ["admin-faq"],
    queryFn: () => apiFetch("/api/admin/faq"),
  });

  // ---------- Mutations ----------
  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["admin-faq"] }),
    [queryClient]
  );

  const createMutation = useMutation({
    mutationFn: (data: FaqFormData) =>
      apiFetch<FaqItem>("/api/admin/faq", {
        method: "POST",
        body: JSON.stringify({
          question: data.question,
          answer: data.answer,
          category: data.category || undefined,
        }),
      }),
    onSuccess: () => {
      invalidate();
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FaqFormData }) =>
      apiFetch<FaqItem>(`/api/admin/faq/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          question: data.question,
          answer: data.answer,
          category: data.category || null,
        }),
      }),
    onSuccess: () => {
      invalidate();
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/admin/faq/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) =>
      apiFetch("/api/admin/faq/reorder", {
        method: "PATCH",
        body: JSON.stringify({ ids }),
      }),
    onSuccess: () => invalidate(),
  });

  // ---------- Handlers ----------
  function openCreate() {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(item: FaqItem) {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category ?? "",
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData(EMPTY_FORM);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  function moveItem(item: FaqItem, direction: "up" | "down") {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((i) => i.id === item.id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === sorted.length - 1)
    ) {
      return;
    }
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const reordered = [...sorted];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    reorderMutation.mutate(reordered.map((i) => i.id));
  }

  // ---------- Grouped items ----------
  const grouped = items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.category || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // Sort items within each category by order
  for (const cat in grouped) {
    grouped[cat].sort((a, b) => a.order - b.order);
  }

  const categories = Object.keys(grouped).sort((a, b) => {
    if (a === "Uncategorized") return 1;
    if (b === "Uncategorized") return -1;
    return a.localeCompare(b);
  });

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    reorderMutation.isPending;

  // ---------- Render ----------
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="FAQ Management"
        description="Create, edit, reorder, and delete frequently asked questions."
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add FAQ
          </button>
        }
      />

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-white/50" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {(error as Error).message || "Failed to load FAQ items."}
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && items.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-white/50">No FAQ items yet.</p>
          <button
            onClick={openCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add your first FAQ
          </button>
        </div>
      )}

      {/* FAQ list grouped by category */}
      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
            {category}
          </h3>
          <div className="space-y-2">
            {grouped[category].map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex flex-col gap-0.5">
                    <button
                      onClick={() => moveItem(item, "up")}
                      disabled={isMutating}
                      className="rounded p-0.5 text-white/30 hover:bg-white/10 hover:text-white/70 transition-colors disabled:opacity-30"
                      title="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <GripVertical className="h-4 w-4 text-white/20" />
                    <button
                      onClick={() => moveItem(item, "down")}
                      disabled={isMutating}
                      className="rounded p-0.5 text-white/30 hover:bg-white/10 hover:text-white/70 transition-colors disabled:opacity-30"
                      title="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{item.question}</p>
                    <p className="mt-1 text-sm text-white/60 line-clamp-2">
                      {item.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(item)}
                      disabled={isMutating}
                      className="rounded-md border border-white/20 p-2 text-white/70 hover:bg-white/5 transition-colors disabled:opacity-30"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      disabled={isMutating}
                      className="rounded-md border border-white/20 p-2 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ===== Add / Edit Dialog ===== */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#111] p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-white">
                {editingItem ? "Edit FAQ" : "Add FAQ"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="rounded-md p-1 text-white/50 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, question: e.target.value }))
                  }
                  placeholder="e.g. How do I reset my password?"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Answer
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, answer: e.target.value }))
                  }
                  placeholder="Provide a detailed answer..."
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Category
                  <span className="ml-1 text-white/30">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, category: e.target.value }))
                  }
                  placeholder="e.g. Account, Billing, General"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="inline-flex items-center gap-2 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {editingItem ? "Save Changes" : "Create FAQ"}
                </button>
              </div>

              {(createMutation.error || updateMutation.error) && (
                <p className="text-sm text-red-400">
                  {(createMutation.error as Error)?.message ||
                    (updateMutation.error as Error)?.message}
                </p>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ===== Delete Confirmation Dialog ===== */}
      <Dialog.Root
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#111] p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <Dialog.Title className="text-lg font-semibold text-white">
              Delete FAQ
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-white/60">
              Are you sure you want to delete this FAQ item? This action cannot
              be undone.
            </Dialog.Description>

            {deleteTarget && (
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-sm font-medium text-white">
                  {deleteTarget.question}
                </p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete
              </button>
            </div>

            {deleteMutation.error && (
              <p className="mt-3 text-sm text-red-400">
                {(deleteMutation.error as Error).message}
              </p>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
