"use client";

import Link from "next/link";
import type { CampaignState } from "@/types";

interface HeroSectionProps {
  campaignState: CampaignState;
}

export function HeroSection({ campaignState }: HeroSectionProps) {
  const isLive = campaignState === "LIVE";
  const isPost = campaignState === "POST_EVENT";

  return (
    <section
      className={`relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-bg-primary text-center ${
        isLive ? "bg-gradient-to-b from-tcl-red/5 to-bg-primary" : ""
      }`}
    >
      {/* --- Single red glow orb --- */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-tcl-red rounded-full blur-[100px] opacity-[0.07] animate-glow" />

      {/* --- LIVE pulsing overlay --- */}
      {isLive && (
        <div className="pointer-events-none absolute inset-0 bg-tcl-red/5 animate-pulse-live" />
      )}

      {/* --- Gradient fade at bottom --- */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />

      {/* --- Content --- */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* LIVE badge */}
        {isLive && (
          <div className="flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tcl-red opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-tcl-red" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-tcl-red">
              Live Now
            </span>
          </div>
        )}

        {/* POST_EVENT trophy */}
        {isPost && (
          <div className="relative mb-3">
            <div className="pointer-events-none absolute inset-0 w-16 h-16 rounded-full bg-arsenal-gold blur-[30px] opacity-30 mx-auto" />
            <svg
              className="relative h-12 w-12 text-arsenal-gold drop-shadow-lg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
          </div>
        )}

        {/* Partnership pill */}
        {!isPost && (
          <div className="glass rounded-full px-4 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-medium">
              TCL &times; Arsenal
            </span>
          </div>
        )}

        {/* Tagline */}
        <p className="text-xs uppercase tracking-[0.2em] text-tcl-red font-semibold mt-4">
          Inspire It. Dream It. Do It.
        </p>

        {/* Title */}
        <h1 className="mt-3">
          {isPost ? (
            <span className="text-4xl font-display font-black text-text-primary text-glow leading-tight block">
              Champions Crowned
            </span>
          ) : (
            <>
              <span className="text-4xl font-display font-black text-text-primary text-glow leading-tight block">
                Road to Greatness
              </span>
              <span className="text-2xl font-display font-bold text-arsenal-gold text-glow-gold block mt-1">
                2026
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-text-secondary mt-3 max-w-[280px] mx-auto leading-relaxed">
          {isPost
            ? "The Road to London awaits the victors"
            : "The most exciting 5-a-side tournament in the UAE"}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2.5 mt-6 w-full max-w-[280px]">
          {isPost ? (
            <Link
              href="/highlights"
              className="flex items-center justify-center rounded-xl bg-tcl-red h-12 text-sm font-semibold text-white glow-red-strong transition-all hover:scale-[1.02]"
            >
              View Highlights
            </Link>
          ) : isLive ? (
            <Link
              href="/matches"
              className="flex items-center justify-center rounded-xl bg-tcl-red h-12 text-sm font-semibold text-white glow-red-strong animate-glow transition-all hover:scale-[1.02]"
            >
              Watch Live Matches
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-xl bg-tcl-red h-12 text-sm font-semibold text-white glow-red-strong transition-all hover:scale-[1.02]"
              >
                Register Your Team
              </Link>
              <Link
                href="/fan-interest"
                className="flex items-center justify-center rounded-xl glass h-11 text-sm font-semibold text-text-primary border border-border-default transition-all hover:bg-white/5"
              >
                I&apos;m a Fan
              </Link>
            </>
          )}
        </div>

        {/* Event info pills */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {["Apr 26-27", "Dubai", "5v5"].map((info) => (
            <span
              key={info}
              className="glass rounded-full px-3 py-1 text-[10px] text-text-muted font-medium"
            >
              {info}
            </span>
          ))}
        </div>
      </div>

      {/* --- Scroll indicator --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-float opacity-30">
        <svg
          className="h-5 w-5 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
