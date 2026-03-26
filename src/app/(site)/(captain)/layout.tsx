'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CaptainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="space-y-4 w-full max-w-sm mx-auto px-4">
          <div className="h-8 bg-bg-surface rounded-lg animate-pulse" />
          <div className="h-32 bg-bg-surface rounded-lg animate-pulse" />
          <div className="h-24 bg-bg-surface rounded-lg animate-pulse" />
          <div className="h-24 bg-bg-surface rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <Card className="bg-bg-surface border-border-default max-w-sm w-full">
          <CardContent className="p-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-xl bg-tcl-red/20 flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-tcl-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-lg text-text-primary">
              Sign In Required
            </h2>
            <p className="text-sm text-text-secondary">
              Sign in to access your team dashboard
            </p>
            <Link href="/login">
              <Button className="w-full bg-tcl-red hover:bg-tcl-red/90 text-white">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
