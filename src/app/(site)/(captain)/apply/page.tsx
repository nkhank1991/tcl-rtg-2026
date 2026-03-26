'use client';

import { useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SOURCE_CATEGORIES } from '@/lib/constants';

const AREAS = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
] as const;

const TEAM_TYPES = ['Community', 'Academy', 'Friends', 'Corporate'] as const;

const TOTAL_STEPS = 4;

interface FormData {
  fullName: string;
  mobile: string;
  email: string;
  area: string;
  teamName: string;
  teamType: string;
  squadSize: string;
  socialHandle: string;
  sourceCategory: string;
  sourceDetail: string;
  highlightLink: string;
  whySelected: string;
  consent: boolean;
}

const initialFormData: FormData = {
  fullName: '',
  mobile: '',
  email: '',
  area: '',
  teamName: '',
  teamType: '',
  squadSize: '',
  socialHandle: '',
  sourceCategory: '',
  sourceDetail: '',
  highlightLink: '',
  whySelected: '',
  consent: false,
};

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setRefNumber(`TCL-${Date.now().toString(36).toUpperCase()}`);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <PageContainer>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto">
            <div className="mx-auto h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
              <svg className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-2xl text-text-primary">
              Application Submitted!
            </h2>
            <p className="text-text-secondary">
              Your submission reference number is:
            </p>
            <div className="bg-bg-surface rounded-lg border border-border-default px-6 py-3 inline-block">
              <span className="font-mono text-lg text-tcl-red font-semibold">{refNumber}</span>
            </div>
            <div className="bg-bg-surface rounded-lg border border-border-default p-4 text-left space-y-2">
              <h3 className="font-semibold text-text-primary">What happens next?</h3>
              <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
                <li>Our team will review your application within 5-7 business days</li>
                <li>You will receive an SMS notification with your status update</li>
                <li>Shortlisted teams will be invited to complete their roster details</li>
                <li>Check your application status anytime at the Status page</li>
              </ul>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-lg mx-auto py-8 space-y-6">
        <h1 className="font-display font-bold text-2xl text-text-primary">Team Application</h1>

        {/* Progress bar */}
        <div className="flex items-center gap-0">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div
                className={`h-3 w-3 rounded-full shrink-0 ${
                  i + 1 <= step ? 'bg-tcl-red' : 'bg-bg-surface border border-border-default'
                }`}
              />
              {i < TOTAL_STEPS - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    i + 1 < step ? 'bg-tcl-red' : 'bg-border-default'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 - Personal Info */}
        {step === 1 && (
          <Card className="bg-bg-surface border-border-default">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg text-text-primary">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Full Name</label>
                  <Input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Mobile</label>
                  <Input value={form.mobile} onChange={(e) => update('mobile', e.target.value)} placeholder="+971 50 123 4567" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Email</label>
                  <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Area</label>
                  <select
                    className="w-full rounded-lg bg-bg-elevated border border-border-default px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tcl-red"
                    value={form.area}
                    onChange={(e) => update('area', e.target.value)}
                  >
                    <option value="">Select your area</option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 - Team Info */}
        {step === 2 && (
          <Card className="bg-bg-surface border-border-default">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg text-text-primary">Team Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Team Name</label>
                  <Input value={form.teamName} onChange={(e) => update('teamName', e.target.value)} placeholder="Your team name" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Team Type</label>
                  <select
                    className="w-full rounded-lg bg-bg-elevated border border-border-default px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tcl-red"
                    value={form.teamType}
                    onChange={(e) => update('teamType', e.target.value)}
                  >
                    <option value="">Select team type</option>
                    {TEAM_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Squad Size</label>
                  <Input type="number" value={form.squadSize} onChange={(e) => update('squadSize', e.target.value)} placeholder="8" min={5} max={15} />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Instagram / TikTok Handle</label>
                  <Input value={form.socialHandle} onChange={(e) => update('socialHandle', e.target.value)} placeholder="@yourhandle" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 - Source */}
        {step === 3 && (
          <Card className="bg-bg-surface border-border-default">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg text-text-primary">Additional Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">How did you hear about us?</label>
                  <select
                    className="w-full rounded-lg bg-bg-elevated border border-border-default px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tcl-red"
                    value={form.sourceCategory}
                    onChange={(e) => update('sourceCategory', e.target.value)}
                  >
                    <option value="">Select source</option>
                    {SOURCE_CATEGORIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Source Detail</label>
                  <Input value={form.sourceDetail} onChange={(e) => update('sourceDetail', e.target.value)} placeholder="Tell us more..." />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Highlight Link (optional)</label>
                  <Input type="url" value={form.highlightLink} onChange={(e) => update('highlightLink', e.target.value)} placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Why should your team be selected?</label>
                  <textarea
                    className="w-full rounded-lg bg-bg-elevated border border-border-default px-3 py-2 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-tcl-red min-h-[100px] resize-none"
                    value={form.whySelected}
                    onChange={(e) => update('whySelected', e.target.value)}
                    placeholder="Tell us what makes your team stand out..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4 - Review & Submit */}
        {step === 4 && (
          <Card className="bg-bg-surface border-border-default">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg text-text-primary">Review & Submit</h2>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-text-muted">Full Name</span>
                  <span className="text-text-primary">{form.fullName || '---'}</span>
                  <span className="text-text-muted">Mobile</span>
                  <span className="text-text-primary">{form.mobile || '---'}</span>
                  <span className="text-text-muted">Email</span>
                  <span className="text-text-primary">{form.email || '---'}</span>
                  <span className="text-text-muted">Area</span>
                  <span className="text-text-primary">{form.area || '---'}</span>
                  <span className="text-text-muted">Team Name</span>
                  <span className="text-text-primary">{form.teamName || '---'}</span>
                  <span className="text-text-muted">Team Type</span>
                  <span className="text-text-primary">{form.teamType || '---'}</span>
                  <span className="text-text-muted">Squad Size</span>
                  <span className="text-text-primary">{form.squadSize || '---'}</span>
                  <span className="text-text-muted">Social Handle</span>
                  <span className="text-text-primary">{form.socialHandle || '---'}</span>
                  <span className="text-text-muted">Source</span>
                  <span className="text-text-primary">{form.sourceCategory || '---'}</span>
                  <span className="text-text-muted">Source Detail</span>
                  <span className="text-text-primary">{form.sourceDetail || '---'}</span>
                  <span className="text-text-muted">Highlight Link</span>
                  <span className="text-text-primary break-all">{form.highlightLink || '---'}</span>
                </div>
                {form.whySelected && (
                  <div>
                    <span className="text-text-muted block mb-1">Why should your team be selected?</span>
                    <p className="text-text-primary">{form.whySelected}</p>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 pt-4 border-t border-border-default cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => update('consent', e.target.checked)}
                  className="mt-1 h-4 w-4 accent-tcl-red"
                />
                <span className="text-sm text-text-secondary">
                  I agree to the tournament rules and terms
                </span>
              </label>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              className="flex-1 border-border-default text-text-secondary"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
            >
              Back
            </Button>
          )}
          {step < TOTAL_STEPS ? (
            <Button
              className="flex-1 bg-tcl-red hover:bg-tcl-red/90 text-white"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
            >
              Next
            </Button>
          ) : (
            <Button
              className="flex-1 bg-tcl-red hover:bg-tcl-red/90 text-white"
              onClick={handleSubmit}
              disabled={!form.consent || loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
