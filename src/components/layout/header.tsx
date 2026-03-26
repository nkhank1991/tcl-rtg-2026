"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-bg-primary/60 backdrop-blur-xl border-b border-white/[0.04]">
      <div className="flex items-center justify-between px-5 h-11 max-w-lg mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-tcl-red flex items-center justify-center">
              <span className="text-white text-[7px] font-black font-display">TCL</span>
            </div>
            <div className="w-6 h-6 rounded-md bg-tcl-red flex items-center justify-center">
              <span className="text-white text-[8px] font-black font-display">A</span>
            </div>
          </div>
          <span className="text-[11px] font-display font-bold text-white/90 tracking-tight">
            Road to Greatness
          </span>
        </Link>
        <Link href="/notifications" className="relative p-2 -mr-1 rounded-lg hover:bg-white/[0.04] transition-colors">
          <Bell className="h-4 w-4 text-white/40" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-tcl-red rounded-full" />
        </Link>
      </div>
    </header>
  );
}
