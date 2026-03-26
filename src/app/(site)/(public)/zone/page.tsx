"use client";

import { useState, useEffect } from "react";
import { Gamepad2, Camera, UtensilsCrossed, Monitor } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { ZoneScheduleItem } from "@/types";

const ZONE_ICONS: Record<string, React.ReactNode> = {
  Gaming: <Gamepad2 className="h-4 w-4" />,
  Photography: <Camera className="h-4 w-4" />,
  Hospitality: <UtensilsCrossed className="h-4 w-4" />,
  Screening: <Monitor className="h-4 w-4" />,
};

function useCountdown(targetHour: number, targetMinute: number) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function calc() {
      const now = new Date();
      const target = new Date(now);
      target.setHours(targetHour, targetMinute, 0, 0);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      );
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetHour, targetMinute]);

  return timeLeft;
}

export default function ZonePage() {
  const countdown = useCountdown(19, 30);

  const { data, isLoading } = useQuery<{ items: ZoneScheduleItem[]; status: string; screeningTime: string }>({
    queryKey: ["zone"],
    queryFn: async () => {
      const res = await fetch("/api/zone");
      if (!res.ok) throw new Error("Failed to fetch zone data");
      return res.json();
    },
  });

  const zoneItems = data?.items ?? [];

  if (isLoading) {
    return (
      <PageContainer className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-lg font-display font-bold text-text-primary flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
            Indoor Zone
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-bg-elevated animate-pulse" />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-6">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-lg font-display font-bold text-text-primary flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
          Indoor Zone
        </h1>
        <Badge variant="warning" className="text-[10px] px-1.5 py-0 h-4">Opening Soon</Badge>
      </div>

      <div className="glass rounded-xl p-4 mb-4">
        <p className="text-[11px] text-text-muted uppercase tracking-wide mb-1">Opens from Quarterfinals</p>
        <p className="font-score text-3xl font-bold text-text-primary">7:30 PM</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 stagger-children">
        {zoneItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-bg-surface border border-border-default p-3"
          >
            <div className="flex items-center gap-2 mb-1.5 text-text-secondary">
              {ZONE_ICONS[item.category || ""] || <Monitor className="h-4 w-4" />}
              <span className="text-[13px] font-semibold text-text-primary">{item.title}</span>
            </div>
            <p className="text-[10px] text-text-muted">{item.location}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-bg-surface border border-border-default p-4 text-center">
        <p className="text-[11px] text-text-muted uppercase tracking-wide mb-1">Screening starts in</p>
        <p className="font-score text-2xl font-bold text-text-primary animate-pulse-live">{countdown}</p>
        <p className="text-[10px] text-text-muted mt-1">Main Hall &middot; 7:30 PM</p>
      </div>
    </PageContainer>
  );
}
