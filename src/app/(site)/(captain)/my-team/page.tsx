'use client';

import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CHECKLIST = [
  {
    label: 'Roster',
    detail: '3/8 players added',
    progress: 3 / 8,
    status: 'in-progress' as const,
    href: '/my-team/roster',
  },
  {
    label: 'Kit Sizes',
    detail: '0/8 submitted',
    progress: 0,
    status: 'warning' as const,
    href: '/my-team/kit-sizes',
  },
  {
    label: 'Participation Agreement',
    detail: 'Not signed',
    progress: 0,
    status: 'error' as const,
    href: '/my-team/agreements',
  },
  {
    label: 'Check-in Instructions',
    detail: 'Available after confirmation',
    progress: 0,
    status: 'locked' as const,
    href: '#',
  },
];

export default function MyTeamPage() {
  return (
    <PageContainer>
      <div className="max-w-lg mx-auto py-8 space-y-6">
        {/* Team Identity Card */}
        <Card className="bg-bg-surface border-border-default overflow-hidden">
          <div className="bg-gradient-to-r from-tcl-red/20 to-bg-surface p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display font-bold text-2xl text-text-primary">
                  Desert Hawks
                </h1>
                <p className="text-sm text-text-secondary mt-1">Captain Dashboard</p>
              </div>
              <Badge className="bg-arsenal-gold/20 text-arsenal-gold border-arsenal-gold/30">
                Group A
              </Badge>
            </div>
            <div className="mt-4 bg-bg-elevated/50 rounded-lg p-3">
              <p className="text-xs text-text-muted uppercase tracking-wide">Upcoming Match</p>
              <p className="text-sm text-text-primary mt-1 font-medium">
                Desert Hawks vs Sand Vipers
              </p>
              <p className="text-xs text-text-secondary">Group Stage - Match Day 1</p>
            </div>
          </div>
        </Card>

        {/* Completion Checklist */}
        <div className="space-y-3">
          <h2 className="font-semibold text-text-primary">Setup Checklist</h2>
          {CHECKLIST.map((item) => (
            <Card key={item.label} className="bg-bg-surface border-border-default">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        item.status === 'in-progress'
                          ? 'bg-tcl-red'
                          : item.status === 'warning'
                          ? 'bg-yellow-500'
                          : item.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-border-default'
                      }`}
                    />
                    <span className="text-sm font-medium text-text-primary">{item.label}</span>
                  </div>
                  <span
                    className={`text-xs ${
                      item.status === 'warning'
                        ? 'text-warning'
                        : item.status === 'error'
                        ? 'text-error'
                        : 'text-text-muted'
                    }`}
                  >
                    {item.detail}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tcl-red rounded-full transition-all"
                    style={{ width: `${item.progress * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h2 className="font-semibold text-text-primary">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/my-team/roster">
              <Button variant="outline" className="w-full border-border-default text-text-secondary text-sm">
                Edit Roster
              </Button>
            </Link>
            <Link href="/my-team/kit-sizes">
              <Button variant="outline" className="w-full border-border-default text-text-secondary text-sm">
                Submit Kit Sizes
              </Button>
            </Link>
            <Link href="/my-team/agreements">
              <Button variant="outline" className="w-full border-border-default text-text-secondary text-sm">
                Sign Agreement
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full border-border-default text-text-secondary text-sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Desert Hawks - TCL 2026', url: window.location.href });
                }
              }}
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Team
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
