"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  Users,
  Swords,
  ClipboardList,
  Trophy,
} from "lucide-react";

interface DashboardStats {
  teams: number;
  matches: number;
  applications: number;
  campaignState: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your tournament"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Teams"
            value={stats?.teams ?? 0}
            icon={Users}
            color="#E4002B"
          />
          <StatCard
            label="Matches"
            value={stats?.matches ?? 0}
            icon={Swords}
            color="#F59E0B"
          />
          <StatCard
            label="Applications"
            value={stats?.applications ?? 0}
            icon={ClipboardList}
            color="#8B5CF6"
          />
          <StatCard
            label="Campaign"
            value={stats?.campaignState?.replace("_", " ") ?? "—"}
            icon={Trophy}
            color="#22C55E"
          />
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Manage Matches", href: "/admin/matches", desc: "Update scores and match status" },
            { label: "Edit Hero Slides", href: "/admin/hero-slides", desc: "Update homepage carousel" },
            { label: "Review Applications", href: "/admin/applications", desc: "Process team applications" },
            { label: "Update FAQ", href: "/admin/faq", desc: "Add or edit FAQ items" },
            { label: "Upload Highlights", href: "/admin/highlights", desc: "Add videos and images" },
            { label: "Send Notification", href: "/admin/notifications", desc: "Notify users" },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="rounded-lg border border-white/10 p-4 hover:bg-white/5 transition-colors"
            >
              <p className="font-medium text-white">{action.label}</p>
              <p className="mt-1 text-xs text-white/40">{action.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
