"use client";

import { useState, useEffect } from "react";
import { Bell, Zap, Radio, Info } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { useQuery } from "@tanstack/react-query";
import type { Notification } from "@/types";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  match: <Radio className="h-4 w-4 text-tcl-red" />,
  zone: <Zap className="h-4 w-4 text-warning" />,
  general: <Info className="h-4 w-4 text-text-secondary" />,
  application: <Bell className="h-4 w-4 text-success" />,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const { data, isLoading } = useQuery<{ notifications: Notification[] }>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications);
    }
  }, [data]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <PageContainer className="pt-6">
        <h1 className="text-lg font-display font-bold text-text-primary flex items-center mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
          Notifications
        </h1>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-bg-elevated animate-pulse" />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-display font-bold text-text-primary flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
          Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[11px] text-tcl-red font-medium hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="stagger-children space-y-0">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start gap-3 py-3 border-b border-border-default/50 last:border-b-0 ${
              !n.isRead ? "bg-bg-surface/50" : ""
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {CATEGORY_ICONS[n.category] || <Bell className="h-4 w-4 text-text-muted" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-text-primary">{n.title}</p>
              <p className="text-[12px] text-text-secondary line-clamp-1 mt-0.5">{n.body}</p>
              <p className="text-[10px] text-text-muted mt-1">{timeAgo(n.createdAt)}</p>
            </div>

            {!n.isRead && (
              <div className="mt-2 shrink-0">
                <span className="block w-2 h-2 rounded-full bg-blue-500" />
              </div>
            )}
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <p className="text-center text-[13px] text-text-muted py-8">No notifications yet</p>
      )}
    </PageContainer>
  );
}
