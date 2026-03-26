"use client";

import Link from "next/link";
import { X, Trophy, Users, Zap, Award, Play, Bell, HelpCircle, Shield } from "lucide-react";

const menuItems = [
  { href: "/matches", label: "Matches", icon: Trophy },
  { href: "/standings", label: "Standings", icon: Award },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/zone", label: "Zone", icon: Zap },
  { href: "/prize", label: "Prize", icon: Award },
  { href: "/highlights", label: "Watch", icon: Play },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/my-team", label: "My Team", icon: Shield },
];

interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MoreMenu({ open, onClose }: MoreMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" onClick={onClose}>
      <div className="absolute inset-0 bg-bg-overlay" />
      <div
        className="absolute bottom-0 left-0 right-0 glass-strong rounded-t-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs font-display font-bold text-text-primary uppercase tracking-wide">Explore</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-elevated transition-colors">
            <X className="h-4 w-4 text-text-muted" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5 px-3 pb-4 pb-safe">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl hover:bg-bg-elevated transition-colors"
            >
              <Icon className="h-4 w-4 text-text-secondary" />
              <span className="text-[10px] font-medium text-text-primary">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
