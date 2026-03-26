"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Plus, Save, Trash2 } from "lucide-react";

type SiteContent = {
  id: string;
  key: string;
  value: string;
  type: string;
};

const inputClass =
  "w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none";
const primaryBtn =
  "rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors";
const secondaryBtn =
  "rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors";
const card = "rounded-xl border border-white/10 bg-white/5 p-4";

export default function ContentPage() {
  const queryClient = useQueryClient();
  const [editedValues, setEditedValues] = useState<
    Record<string, { value: string; type: string }>
  >({});
  const [newItem, setNewItem] = useState({ key: "", value: "", type: "text" });
  const [showNewForm, setShowNewForm] = useState(false);

  const { data: content = [], isLoading } = useQuery<SiteContent[]>({
    queryKey: ["admin", "content"],
    queryFn: async () => {
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error("Failed to fetch content");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { key: string; value: string; type: string }) => {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
    },
  });

  function handleSaveItem(item: SiteContent) {
    const edited = editedValues[item.key];
    saveMutation.mutate({
      key: item.key,
      value: edited?.value ?? item.value,
      type: edited?.type ?? item.type,
    });
    setEditedValues((prev) => {
      const next = { ...prev };
      delete next[item.key];
      return next;
    });
  }

  function handleSaveAll() {
    const promises = content.map((item) => {
      const edited = editedValues[item.key];
      if (!edited) return Promise.resolve();
      return saveMutation.mutateAsync({
        key: item.key,
        value: edited.value ?? item.value,
        type: edited.type ?? item.type,
      });
    });
    Promise.all(promises).then(() => setEditedValues({}));
  }

  function handleAddNew() {
    if (!newItem.key.trim()) return;
    saveMutation.mutate(newItem, {
      onSuccess: () => {
        setNewItem({ key: "", value: "", type: "text" });
        setShowNewForm(false);
      },
    });
  }

  const hasChanges = Object.keys(editedValues).length > 0;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Site Content"
        description="Manage key-value content entries for the site"
        action={
          <div className="flex gap-2">
            {hasChanges && (
              <button onClick={handleSaveAll} className={primaryBtn}>
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save All
                </span>
              </button>
            )}
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className={secondaryBtn}
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Entry
              </span>
            </button>
          </div>
        }
      />

      {showNewForm && (
        <div className={card}>
          <h3 className="mb-3 text-sm font-medium text-white">
            New Content Entry
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Key (e.g. homepage_title)"
              value={newItem.key}
              onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
              className={inputClass}
            />
            <textarea
              placeholder="Value"
              value={newItem.value}
              onChange={(e) =>
                setNewItem({ ...newItem, value: e.target.value })
              }
              className={`${inputClass} min-h-[80px] resize-y`}
            />
            <select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className={inputClass}
            >
              <option value="text">Text</option>
              <option value="html">HTML</option>
              <option value="json">JSON</option>
              <option value="url">URL</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleAddNew} className={primaryBtn}>
                Add
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className={secondaryBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-white/50">Loading content...</p>
      ) : content.length === 0 ? (
        <p className="text-sm text-white/50">No content entries yet.</p>
      ) : (
        <div className="space-y-3">
          {content.map((item) => {
            const edited = editedValues[item.key];
            const currentValue = edited?.value ?? item.value;
            const isModified = edited !== undefined;

            return (
              <div key={item.id} className={card}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {item.key}
                  </span>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/50">
                    {edited?.type ?? item.type}
                  </span>
                  {isModified && (
                    <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
                      Modified
                    </span>
                  )}
                </div>
                <textarea
                  value={currentValue}
                  onChange={(e) =>
                    setEditedValues((prev) => ({
                      ...prev,
                      [item.key]: {
                        value: e.target.value,
                        type: prev[item.key]?.type ?? item.type,
                      },
                    }))
                  }
                  className={`${inputClass} min-h-[60px] resize-y`}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleSaveItem(item)}
                    disabled={saveMutation.isPending}
                    className={primaryBtn}
                  >
                    <span className="flex items-center gap-2">
                      <Save className="h-3 w-3" />
                      Save
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
