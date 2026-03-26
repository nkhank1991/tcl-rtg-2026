'use client';

import { PageContainer } from '@/components/layout/page-container';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const STATUSES = [
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Reserve',
  'Confirmed',
] as const;

type Status = (typeof STATUSES)[number] | 'Not Selected';

const MOCK_STATUS: Status = 'Shortlisted';

const MISSING_ACTIONS = [
  { id: 'roster', label: 'Complete roster details', done: false },
  { id: 'kit', label: 'Submit kit sizes', done: false },
  { id: 'agreement', label: 'Sign participation agreement', done: false },
];

export default function StatusPage() {
  const currentStatus = MOCK_STATUS;
  const currentIndex = STATUSES.indexOf(currentStatus as (typeof STATUSES)[number]);
  const isNotSelected = currentStatus === 'Not Selected';

  const [actions, setActions] = useState(MISSING_ACTIONS);

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  };

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">Application Status</h1>

        {/* Status Stepper */}
        <div className="bg-bg-surface rounded-xl border border-border-default p-6">
          {/* Main pipeline */}
          <div className="flex items-center justify-between">
            {STATUSES.map((status, i) => {
              const isCompleted = !isNotSelected && i < currentIndex;
              const isCurrent = !isNotSelected && i === currentIndex;
              const isFuture = isNotSelected || i > currentIndex;

              return (
                <div key={status} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-500 border-green-500'
                          : isCurrent
                          ? 'border-tcl-red bg-tcl-red animate-pulse'
                          : 'border-border-default bg-bg-elevated'
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isCurrent ? (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-border-default" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center whitespace-nowrap ${
                        isCompleted
                          ? 'text-success'
                          : isCurrent
                          ? 'text-tcl-red font-semibold'
                          : 'text-text-muted'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  {i < STATUSES.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 ${
                        !isNotSelected && i < currentIndex ? 'bg-green-500' : 'bg-border-default'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Not Selected branch */}
          {isNotSelected && (
            <div className="mt-4 pt-4 border-t border-border-default flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-500 border-2 border-red-500 flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-error font-semibold text-sm">Not Selected</span>
            </div>
          )}
        </div>

        {/* Status Details Card */}
        <Card className="bg-bg-surface border-border-default">
          <CardHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Current Status</span>
              <Badge variant={isNotSelected ? 'error' : 'default'} className={!isNotSelected ? 'bg-tcl-red/20 text-tcl-red' : ''}>
                {currentStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-text-primary">
                Current Status: {currentStatus}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {currentStatus === 'Shortlisted'
                  ? "What's Next: We're finalizing the confirmed teams. You'll be notified soon."
                  : currentStatus === 'Confirmed'
                  ? "You're in! Complete your team setup to get ready for the tournament."
                  : currentStatus === 'Not Selected'
                  ? 'Unfortunately your team was not selected this time. We encourage you to apply again next season.'
                  : 'Your application is being processed. Stay tuned for updates.'}
              </p>
            </div>

            {!isNotSelected && currentIndex >= 2 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-text-secondary">Missing Actions</h4>
                {actions.map((action) => (
                  <label
                    key={action.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={action.done}
                      onChange={() => toggleAction(action.id)}
                      className="h-4 w-4 accent-tcl-red"
                    />
                    <span
                      className={`text-sm ${
                        action.done ? 'text-text-muted line-through' : 'text-text-primary'
                      }`}
                    >
                      {action.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="text-center pt-4">
          <p className="text-sm text-text-muted mb-3">Need help with your application?</p>
          <Button variant="outline" className="border-border-default text-text-secondary">
            Contact Support
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
