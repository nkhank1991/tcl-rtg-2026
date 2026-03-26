'use client';

import Link from 'next/link';

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg-primary">
      {/* Minimal header with back arrow */}
      <header className="sticky top-0 z-50 glass border-b border-border-default">
        <div className="max-w-lg mx-auto flex items-center h-14 px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">Home</span>
          </Link>
          <span className="ml-auto text-xs font-medium text-text-muted tracking-wider uppercase">
            Team Registration
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}
