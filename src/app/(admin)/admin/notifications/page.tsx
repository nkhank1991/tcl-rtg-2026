"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Bell, Plus, Send, Pencil, X } from "lucide-react";

type Template = {
  id: string;
  key: string;
  title: string;
  body: string;
  category: string;
};

type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: string;
  isRead: boolean;
  createdAt: string;
};

const inputClass =
  "w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#E4002B] focus:outline-none";
const primaryBtn =
  "rounded-md bg-[#E4002B] px-4 py-2 text-sm font-medium text-white hover:bg-[#c0001f] transition-colors";
const secondaryBtn =
  "rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors";
const card = "rounded-xl border border-white/10 bg-white/5 p-4";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateForm, setTemplateForm] = useState({
    key: "",
    title: "",
    body: "",
    category: "",
  });
  const [sendForm, setSendForm] = useState({
    title: "",
    body: "",
    category: "",
    target: "ALL" as "ALL" | "FAN" | "CAPTAIN",
  });

  const { data: templates = [], isLoading: templatesLoading } = useQuery<
    Template[]
  >({
    queryKey: ["admin", "notification-templates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/notifications/templates");
      if (!res.ok) throw new Error("Failed to fetch templates");
      return res.json();
    },
  });

  const { data: recentNotifications = [], isLoading: notificationsLoading } =
    useQuery<Notification[]>({
      queryKey: ["admin", "recent-notifications"],
      queryFn: async () => {
        const res = await fetch("/api/admin/notifications/templates");
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      },
    });

  const saveTemplate = useMutation({
    mutationFn: async (data: typeof templateForm) => {
      const res = await fetch("/api/admin/notifications/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save template");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "notification-templates"],
      });
      setShowTemplateForm(false);
      setEditingTemplate(null);
      setTemplateForm({ key: "", title: "", body: "", category: "" });
    },
  });

  const sendNotification = useMutation({
    mutationFn: async (data: typeof sendForm) => {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send");
      }
      return res.json();
    },
    onSuccess: (data) => {
      alert(`Notification sent to ${data.count} users`);
      setSendForm({ title: "", body: "", category: "", target: "ALL" });
    },
  });

  function openEditTemplate(template: Template) {
    setEditingTemplate(template);
    setTemplateForm({
      key: template.key,
      title: template.title,
      body: template.body,
      category: template.category,
    });
    setShowTemplateForm(true);
  }

  function openNewTemplate() {
    setEditingTemplate(null);
    setTemplateForm({ key: "", title: "", body: "", category: "" });
    setShowTemplateForm(true);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Notifications"
        description="Manage notification templates and send notifications"
        action={
          <button onClick={openNewTemplate} className={primaryBtn}>
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Template
            </span>
          </button>
        }
      />

      {/* Templates Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Templates</h2>

        {showTemplateForm && (
          <div className={card}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">
                {editingTemplate ? "Edit Template" : "New Template"}
              </h3>
              <button
                onClick={() => setShowTemplateForm(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveTemplate.mutate(templateForm);
              }}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Key (e.g. welcome_notification)"
                value={templateForm.key}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, key: e.target.value })
                }
                className={inputClass}
                disabled={!!editingTemplate}
              />
              <input
                type="text"
                placeholder="Title"
                value={templateForm.title}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, title: e.target.value })
                }
                className={inputClass}
              />
              <textarea
                placeholder="Body"
                value={templateForm.body}
                onChange={(e) =>
                  setTemplateForm({ ...templateForm, body: e.target.value })
                }
                className={`${inputClass} min-h-[80px] resize-y`}
              />
              <input
                type="text"
                placeholder="Category"
                value={templateForm.category}
                onChange={(e) =>
                  setTemplateForm({
                    ...templateForm,
                    category: e.target.value,
                  })
                }
                className={inputClass}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saveTemplate.isPending}
                  className={primaryBtn}
                >
                  {saveTemplate.isPending ? "Saving..." : "Save Template"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTemplateForm(false)}
                  className={secondaryBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {templatesLoading ? (
          <p className="text-sm text-white/50">Loading templates...</p>
        ) : templates.length === 0 ? (
          <p className="text-sm text-white/50">No templates yet.</p>
        ) : (
          <div className="grid gap-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className={`${card} flex items-start justify-between`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {tpl.title}
                    </span>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/50">
                      {tpl.key}
                    </span>
                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/60">{tpl.body}</p>
                </div>
                <button
                  onClick={() => openEditTemplate(tpl)}
                  className="ml-3 text-white/40 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Send Notification Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Send Notification</h2>
        <div className={card}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendNotification.mutate(sendForm);
            }}
            className="space-y-3"
          >
            <input
              type="text"
              placeholder="Title"
              value={sendForm.title}
              onChange={(e) =>
                setSendForm({ ...sendForm, title: e.target.value })
              }
              className={inputClass}
            />
            <textarea
              placeholder="Body"
              value={sendForm.body}
              onChange={(e) =>
                setSendForm({ ...sendForm, body: e.target.value })
              }
              className={`${inputClass} min-h-[80px] resize-y`}
            />
            <input
              type="text"
              placeholder="Category"
              value={sendForm.category}
              onChange={(e) =>
                setSendForm({ ...sendForm, category: e.target.value })
              }
              className={inputClass}
            />
            <div>
              <label className="mb-1 block text-sm text-white/60">
                Target Audience
              </label>
              <select
                value={sendForm.target}
                onChange={(e) =>
                  setSendForm({
                    ...sendForm,
                    target: e.target.value as "ALL" | "FAN" | "CAPTAIN",
                  })
                }
                className={inputClass}
              >
                <option value="ALL">All Users</option>
                <option value="FAN">Fans Only</option>
                <option value="CAPTAIN">Captains Only</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={sendNotification.isPending}
              className={primaryBtn}
            >
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {sendNotification.isPending ? "Sending..." : "Send Notification"}
              </span>
            </button>
            {sendNotification.isError && (
              <p className="text-sm text-red-400">
                {sendNotification.error.message}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Recent Notifications */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Recent Notifications
        </h2>
        {notificationsLoading ? (
          <p className="text-sm text-white/50">Loading...</p>
        ) : recentNotifications.length === 0 ? (
          <p className="text-sm text-white/50">No recent notifications.</p>
        ) : (
          <div className="grid gap-2">
            {recentNotifications.map((n) => (
              <div key={n.id} className={card}>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-white/40" />
                  <span className="text-sm font-medium text-white">
                    {n.title}
                  </span>
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
                    {n.category}
                  </span>
                  {n.isRead && (
                    <span className="text-xs text-white/30">Read</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-white/60">{n.body}</p>
                <p className="mt-1 text-xs text-white/30">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
