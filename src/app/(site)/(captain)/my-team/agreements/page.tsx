'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Agreement {
  id: string;
  title: string;
  description: string;
  content: string;
  accepted: boolean;
}

const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: 'rules',
    title: 'Tournament Rules & Terms',
    description: 'Official rules and regulations for the TCL 2026 tournament',
    content:
      'By accepting these terms, you agree to abide by all tournament rules including fair play policies, match scheduling, player eligibility requirements, and the decisions of match officials. Teams must field a minimum of 5 players per match. Yellow and red card accumulations carry across group stage matches. The tournament organizer reserves the right to modify schedules as needed.',
    accepted: true,
  },
  {
    id: 'media',
    title: 'Media Consent',
    description: 'Permission for photos, videos, and media coverage',
    content:
      'By accepting this consent, you grant TCL and its partners permission to capture, use, and distribute photographs, video recordings, and other media content featuring you and your team during the tournament. This content may be used for promotional purposes across social media, websites, and marketing materials.',
    accepted: false,
  },
  {
    id: 'liability',
    title: 'Liability Waiver',
    description: 'Standard liability and participation waiver',
    content:
      'By accepting this waiver, you acknowledge the inherent risks involved in participating in a football tournament. You agree to hold harmless TCL, its organizers, sponsors, and venue operators from any claims, damages, or injuries sustained during the tournament. Participants are encouraged to have personal health insurance coverage.',
    accepted: false,
  },
];

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const acceptAgreement = (id: string) => {
    setAgreements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, accepted: true } : a))
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const allAccepted = agreements.every((a) => a.accepted);

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">
            Agreements & Waivers
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {agreements.filter((a) => a.accepted).length} of {agreements.length} accepted
          </p>
        </div>

        {/* Notice */}
        {!allAccepted && (
          <div className="bg-bg-surface rounded-lg border border-border-default p-3 flex items-start gap-2">
            <svg className="h-4 w-4 text-warning mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xs text-text-secondary">
              All agreements must be accepted before the event
            </p>
          </div>
        )}

        {/* Agreement Cards */}
        <div className="space-y-3">
          {agreements.map((agreement) => (
            <Card key={agreement.id} className="bg-bg-surface border-border-default overflow-hidden">
              <CardHeader
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(agreement.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-text-primary">
                        {agreement.title}
                      </h3>
                      <Badge
                        className={
                          agreement.accepted
                            ? 'bg-green-500/20 text-success text-xs'
                            : 'bg-bg-elevated text-text-muted text-xs'
                        }
                      >
                        {agreement.accepted ? 'Accepted' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-muted mt-1">{agreement.description}</p>
                  </div>
                  <svg
                    className={`h-4 w-4 text-text-muted transition-transform shrink-0 ${
                      expandedId === agreement.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </CardHeader>
              {expandedId === agreement.id && (
                <CardContent className="px-4 pb-4 pt-0 space-y-4">
                  <div className="bg-bg-elevated rounded-lg p-3">
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {agreement.content}
                    </p>
                  </div>
                  {!agreement.accepted && (
                    <Button
                      className="w-full bg-tcl-red hover:bg-tcl-red/90 text-white text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        acceptAgreement(agreement.id);
                      }}
                    >
                      Accept {agreement.title}
                    </Button>
                  )}
                  {agreement.accepted && (
                    <div className="flex items-center gap-2 text-success text-sm">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Accepted
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
