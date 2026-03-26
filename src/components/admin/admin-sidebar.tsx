"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Swords,
  Users,
  BarChart3,
  Image,
  HelpCircle,
  Video,
  Gift,
  Calendar,
  Bell,
  FileText,
  ClipboardList,
  UserCog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/campaign", label: "Campaign", icon: Trophy },
  { href: "/admin/matches", label: "Matches", icon: Swords },
  { href: "/admin/teams", label: "Teams", icon: Users },
  { href: "/admin/standings", label: "Standings", icon: BarChart3 },
  { href: "/admin/hero-slides", label: "Hero Slides", icon: Image },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/highlights", label: "Highlights", icon: Video },
  { href: "/admin/prizes", label: "Prizes", icon: Gift },
  { href: "/admin/zone", label: "Zone", icon: Calendar },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList },
  { href: "/admin/users", label: "Users", icon: UserCog },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } flex flex-col border-r border-white/10 bg-[#0a0a0a] transition-all duration-200`}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-white/10">
        {!collapsed && (
          <span className="text-sm font-bold tracking-wide text-white">
            TCL Admin
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[#E4002B]/15 text-[#E4002B] font-medium"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              } ${collapsed ? "justify-center px-2" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-white/10 px-4 py-3">
          <Link
            href="/"
            className="text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            ← Back to public site
          </Link>
        </div>
      )}
    </aside>
  );
}
