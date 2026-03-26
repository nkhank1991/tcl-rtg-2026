"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Award, Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home, accent: false },
  { href: "/matches", label: "Matches", icon: Trophy, accent: false },
  { href: "/register", label: "Register", icon: UserPlus, accent: true },
  { href: "/standings", label: "Standings", icon: Award, accent: false },
  { href: "/teams", label: "Teams", icon: Users, accent: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/register")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/70 backdrop-blur-xl border-t border-white/[0.04] pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto h-14">
        {navItems.map(({ href, label, icon: Icon, accent }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all relative",
                active ? "text-tcl-red" : accent ? "text-tcl-red/80" : "text-white/30 hover:text-white/50"
              )}
            >
              {active && <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-tcl-red rounded-full" />}
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.5 : 1.5} />
              <span className={cn("text-[9px] tracking-wide", active ? "font-bold" : "font-medium")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
