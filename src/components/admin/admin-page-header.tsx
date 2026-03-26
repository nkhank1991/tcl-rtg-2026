"use client";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-white/50">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
