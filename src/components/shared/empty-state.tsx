import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, className, children }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <Icon className="h-12 w-12 text-text-muted mb-4" />
      <h3 className="font-display font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-xs">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
