"use client";

import { useState, useEffect } from "react";

export function SplashScreen() {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fading"), 3200);
    const goneTimer = setTimeout(() => setPhase("gone"), 3800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#050508] transition-opacity duration-600 overflow-hidden ${
        phase === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* ── Cinematic letterbox bars ── */}
      <div className="absolute top-0 left-0 right-0 h-[6%] bg-black z-40" />
      <div className="absolute bottom-0 left-0 right-0 h-[6%] bg-black z-40" />

      {/* ── Deep atmospheric lighting ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central red spotlight from top */}
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[400px] h-[700px] bg-tcl-red/[0.07] rounded-full blur-[200px] animate-[breathe_3s_ease-in-out_infinite]" />
        {/* Left red accent */}
        <div className="absolute top-1/2 -left-[20%] w-[300px] h-[300px] bg-tcl-red/[0.03] rounded-full blur-[150px]" />
        {/* Right gold accent */}
        <div className="absolute top-1/2 -right-[20%] w-[300px] h-[300px] bg-arsenal-gold/[0.025] rounded-full blur-[150px]" />
        {/* Floor glow */}
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[60%] h-[120px] bg-tcl-red/[0.04] rounded-full blur-[80px]" />
      </div>

      {/* ── Particle/dust motes (decorative lines) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-[1px] h-[15%] bg-gradient-to-b from-transparent via-white/[0.04] to-transparent animate-[fade-in_2s_ease-out_0.5s_both]" />
        <div className="absolute top-[30%] right-[20%] w-[1px] h-[12%] bg-gradient-to-b from-transparent via-white/[0.03] to-transparent animate-[fade-in_2s_ease-out_1s_both]" />
        <div className="absolute top-[15%] left-[40%] w-[1px] h-[8%] bg-gradient-to-b from-transparent via-tcl-red/[0.06] to-transparent animate-[fade-in_2s_ease-out_0.8s_both]" />
        <div className="absolute top-[25%] right-[35%] w-[1px] h-[10%] bg-gradient-to-b from-transparent via-arsenal-gold/[0.04] to-transparent animate-[fade-in_2s_ease-out_1.2s_both]" />
      </div>

      {/* ── Main content — full-center cinematic ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
        {/* Partnership logos */}
        <div className="flex items-center gap-5 mb-10 animate-[scale-in_0.8s_cubic-bezier(0.22,1,0.36,1)_0.2s_both]">
          <div className="w-14 h-14 rounded-2xl bg-tcl-red flex items-center justify-center shadow-2xl shadow-tcl-red/40">
            <span className="text-white text-[10px] font-black font-display tracking-wide">TCL</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/15 text-[10px] font-bold">×</span>
            <div className="w-8 h-[1px] bg-gradient-to-r from-tcl-red/40 via-white/10 to-arsenal-gold/40" />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm">
            <span className="text-white/90 text-[18px] font-black font-display">A</span>
          </div>
        </div>

        {/* Horizontal accent line */}
        <div className="w-12 h-[1px] bg-gradient-to-r from-tcl-red/40 to-arsenal-gold/30 mb-8 animate-[fade-in_1s_ease-out_0.4s_both]" />

        {/* Title block */}
        <div className="animate-[cinemaReveal_1.2s_cubic-bezier(0.22,1,0.36,1)_0.4s_both]">
          <p className="text-[8px] font-bold uppercase tracking-[0.6em] text-tcl-red/50 mb-4 text-center">
            Season 2026
          </p>
          <h1 className="font-display font-black text-[52px] leading-[0.82] tracking-[-0.04em] text-white text-center mb-1">
            ROAD TO
          </h1>
          <h1 className="font-display font-black text-[52px] leading-[0.82] tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-r from-tcl-red via-tcl-red to-arsenal-gold text-center">
            GREATNESS
          </h1>
        </div>

        {/* Subtitle line */}
        <div className="mt-8 flex items-center gap-3 animate-[fade-in_1s_ease-out_0.9s_both]">
          <div className="w-6 h-[1px] bg-white/[0.08]" />
          <p className="text-[9px] text-white/20 tracking-[0.2em] uppercase font-medium">
            Inspire Greatness
          </p>
          <div className="w-6 h-[1px] bg-white/[0.08]" />
        </div>

        {/* Loading bar */}
        <div className="mt-10 w-20 h-[2px] rounded-full bg-white/[0.04] overflow-hidden animate-[fade-in_1s_ease-out_1.1s_both]">
          <div className="h-full bg-gradient-to-r from-tcl-red to-arsenal-gold rounded-full animate-[splashLoad_2.8s_ease-in-out_0.4s_both]" />
        </div>

        {/* Powered by */}
        <p className="text-[7px] text-white/[0.08] uppercase tracking-[0.4em] mt-5 animate-[fade-in_1s_ease-out_1.3s_both]">
          Powered by TCL Mini LED
        </p>
      </div>

      {/* ── Accent lines on letterbox edges ── */}
      <div className="absolute top-[6%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-tcl-red/20 to-transparent z-40 animate-[fade-in_0.8s_ease-out]" />
      <div className="absolute bottom-[6%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-arsenal-gold/12 to-transparent z-40 animate-[fade-in_1.2s_ease-out_0.3s_both]" />
    </div>
  );
}
