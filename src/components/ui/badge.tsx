import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "live" | "success" | "warning" | "error" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-bg-elevated text-text-secondary": variant === "default",
          "bg-live/20 text-live animate-pulse-live": variant === "live",
          "bg-success/20 text-success": variant === "success",
          "bg-warning/20 text-warning": variant === "warning",
          "bg-error/20 text-error": variant === "error",
          "border border-border-default text-text-secondary": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
