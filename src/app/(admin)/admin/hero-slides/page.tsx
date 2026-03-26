"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CldUploadWidget } from "next-cloudinary";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface HeroSlide {
  id: string;
  backgroundUrl: string;
  tag: string | null;
  title1: string;
  title2: string;
  description: string;
  ctaText: string | null;
  ctaHref: string | null;
  cta2Text: string | null;
  cta2Href: string | null;
  accent: string;
  order: number;
  isActive: boolean;
}

type SlideFormData = Omit<HeroSlide, "id">;

const emptyForm: SlideFormData = {
  backgroundUrl: "",
  tag: "",
  title1: "",
  title2: "",
  description: "",
  ctaText: "",
  ctaHref: "",
  cta2Text: "",
  cta2Href: "",
  accent: "tcl-red",
  order: 0,
  isActive: true,
};

/* ------------------------------------------------------------------ */
/*  API helpers                                                        */
/* ------------------------------------------------------------------ */

async function fetchSlides(): Promise<HeroSlide[]> {
  const res = await fetch("/api/admin/hero-slides");
  if (!res.ok) throw new Error("Failed to fetch slides");
  return res.json();
}

async function createSlide(data: SlideFormData): Promise<HeroSlide> {
  const res = await fetch("/api/admin/hero-slides", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create slide");
  return res.json();
}

async function updateSlide({
  id,
  ...data
}: Partial<HeroSlide> & { id: string }): Promise<HeroSlide> {
  const res = await fetch(`/api/admin/hero-slides/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update slide");
  return res.json();
}

async function deleteSlide(id: string): Promise<void> {
  const res = await fetch(`/api/admin/hero-slides/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete slide");
}

async function reorderSlides(ids: string[]): Promise<void> {
  const res = await fetch("/api/admin/hero-slides/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Failed to reorder slides");
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function HeroSlidesPage() {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState<SlideFormData>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  /* ---- Queries & Mutations ---- */

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ["admin", "hero-slides"],
    queryFn: fetchSlides,
  });

  const createMutation = useMutation({
    mutationFn: createSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "hero-slides"] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "hero-slides"] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "hero-slides"] });
      setDeleteConfirmId(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderSlides,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "hero-slides"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (slide: HeroSlide) =>
      updateSlide({ id: slide.id, isActive: !slide.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "hero-slides"] });
    },
  });

  /* ---- Helpers ---- */

  function openCreate() {
    setEditingSlide(null);
    setForm({ ...emptyForm, order: slides.length });
    setDialogOpen(true);
  }

  function openEdit(slide: HeroSlide) {
    setEditingSlide(slide);
    setForm({
      backgroundUrl: slide.backgroundUrl,
      tag: slide.tag ?? "",
      title1: slide.title1,
      title2: slide.title2,
      description: slide.description,
      ctaText: slide.ctaText ?? "",
      ctaHref: slide.ctaHref ?? "",
      cta2Text: slide.cta2Text ?? "",
      cta2Href: slide.cta2Href ?? "",
      accent: slide.accent,
      order: slide.order,
      isActive: slide.isActive,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingSlide(null);
    setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      tag: form.tag || null,
      ctaText: form.ctaText || null,
      ctaHref: form.ctaHref || null,
      cta2Text: form.cta2Text || null,
      cta2Href: form.cta2Href || null,
    };

    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide.id, ...payload });
    } else {
      createMutation.mutate(payload as SlideFormData);
    }
  }

  function moveSlide(index: number, direction: "up" | "down") {
    const newSlides = [...slides];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSlides.length) return;
    [newSlides[index], newSlides[swapIndex]] = [
      newSlides[swapIndex],
      newSlides[index],
    ];
    reorderMutation.mutate(newSlides.map((s) => s.id));
  }

  function setField<K extends keyof SlideFormData>(
    key: K,
    value: SlideFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  /* ---- Render ---- */

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Hero Slides"
        description="Manage the homepage hero carousel slides."
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Slide
          </button>
        }
      />

      {/* ---- Loading ---- */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      )}

      {/* ---- Empty state ---- */}
      {!isLoading && slides.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-16 text-center">
          <ImageIcon className="mb-4 h-12 w-12 text-white/20" />
          <p className="text-lg font-medium text-white">No hero slides yet</p>
          <p className="mt-1 text-sm text-white/50">
            Create your first slide to get started.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Slide
          </button>
        </div>
      )}

      {/* ---- Slides Grid ---- */}
      {!isLoading && slides.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              {/* Image preview */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/30">
                {slide.backgroundUrl ? (
                  <img
                    src={slide.backgroundUrl}
                    alt={slide.title1}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-white/20" />
                  </div>
                )}
                {/* Active badge */}
                <span
                  className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium ${
                    slide.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {slide.isActive ? "Active" : "Inactive"}
                </span>
                {/* Order badge */}
                <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white/70">
                  #{index + 1}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="truncate text-sm font-semibold text-white">
                  {slide.title1} {slide.title2}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/50">
                  {slide.description}
                </p>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => moveSlide(index, "up")}
                    disabled={index === 0 || reorderMutation.isPending}
                    className="rounded-md border border-white/20 p-1.5 text-white/70 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveSlide(index, "down")}
                    disabled={
                      index === slides.length - 1 ||
                      reorderMutation.isPending
                    }
                    className="rounded-md border border-white/20 p-1.5 text-white/70 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <div className="flex-1" />

                  {/* Active toggle */}
                  <button
                    onClick={() => toggleMutation.mutate(slide)}
                    disabled={toggleMutation.isPending}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      slide.isActive ? "bg-green-500" : "bg-white/20"
                    }`}
                    title={slide.isActive ? "Deactivate" : "Activate"}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        slide.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => openEdit(slide)}
                    className="rounded-md border border-white/20 p-1.5 text-white/70 hover:bg-white/5 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(slide.id)}
                    className="rounded-md border border-red-500/30 p-1.5 text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Delete Confirmation Dialog ---- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
            <h3 className="text-lg font-semibold text-white">Delete Slide</h3>
            <p className="mt-2 text-sm text-white/50">
              Are you sure you want to delete this slide? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                disabled={deleteMutation.isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Add / Edit Dialog ---- */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 py-8 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {editingSlide ? "Edit Slide" : "Add Slide"}
              </h3>
              <button
                onClick={closeDialog}
                className="rounded-md p-1 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Background Image */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Background Image
                </label>
                {form.backgroundUrl ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10">
                    <img
                      src={form.backgroundUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setField("backgroundUrl", "")}
                      className="absolute right-2 top-2 rounded-md bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset="tcl_unsigned"
                    onSuccess={(result: any) => {
                      if (typeof result.info === "object") {
                        setField("backgroundUrl", result.info.secure_url);
                      }
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/20 px-4 py-10 text-sm text-white/50 hover:border-white/40 hover:text-white/70 transition-colors"
                      >
                        <Upload className="h-5 w-5" />
                        Upload Image
                      </button>
                    )}
                  </CldUploadWidget>
                )}
              </div>

              {/* Tag */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Tag{" "}
                  <span className="text-white/30">(optional)</span>
                </label>
                <input
                  value={form.tag ?? ""}
                  onChange={(e) => setField("tag", e.target.value)}
                  placeholder="e.g. NEW SEASON"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                />
              </div>

              {/* Title 1 & 2 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Title Line 1
                  </label>
                  <input
                    required
                    value={form.title1}
                    onChange={(e) => setField("title1", e.target.value)}
                    placeholder="First line"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    Title Line 2
                  </label>
                  <input
                    required
                    value={form.title2}
                    onChange={(e) => setField("title2", e.target.value)}
                    placeholder="Second line"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Slide description"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none resize-none"
                />
              </div>

              {/* CTA 1 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    CTA Text{" "}
                    <span className="text-white/30">(optional)</span>
                  </label>
                  <input
                    value={form.ctaText ?? ""}
                    onChange={(e) => setField("ctaText", e.target.value)}
                    placeholder="e.g. Learn More"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    CTA Link{" "}
                    <span className="text-white/30">(optional)</span>
                  </label>
                  <input
                    value={form.ctaHref ?? ""}
                    onChange={(e) => setField("ctaHref", e.target.value)}
                    placeholder="/matches"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
              </div>

              {/* CTA 2 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    CTA 2 Text{" "}
                    <span className="text-white/30">(optional)</span>
                  </label>
                  <input
                    value={form.cta2Text ?? ""}
                    onChange={(e) => setField("cta2Text", e.target.value)}
                    placeholder="e.g. Watch Now"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/70">
                    CTA 2 Link{" "}
                    <span className="text-white/30">(optional)</span>
                  </label>
                  <input
                    value={form.cta2Href ?? ""}
                    onChange={(e) => setField("cta2Href", e.target.value)}
                    placeholder="/highlights"
                    className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Accent */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/70">
                  Accent Color
                </label>
                <input
                  value={form.accent}
                  onChange={(e) => setField("accent", e.target.value)}
                  placeholder="tcl-red"
                  className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setField("isActive", !form.isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    form.isActive ? "bg-green-500" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-white/70">Active</span>
              </div>

              {/* Actions */}
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
                  disabled={isSaving || !form.backgroundUrl}
                  className="rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : editingSlide
                      ? "Update Slide"
                      : "Create Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
