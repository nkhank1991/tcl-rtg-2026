"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft | null {
  const difference = new Date(targetDate).getTime() - Date.now();
  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calculateTimeLeft(targetDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft(targetDate);
      setTimeLeft(remaining);
      if (!remaining) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tcl-red opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-tcl-red" />
        </span>
        <span className="font-display text-2xl font-bold text-tcl-red">
          LIVE NOW
        </span>
      </div>
    );
  }

  const segments: { value: number; label: string }[] = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {segments.map((seg) => (
        <div
          key={seg.label}
          className="flex flex-col items-center rounded-lg bg-bg-elevated px-4 py-3"
        >
          <span className="font-score text-2xl font-bold text-text-primary">
            {String(seg.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-xs uppercase text-text-muted">
            {seg.label}
          </span>
        </div>
      ))}
    </div>
  );
}
