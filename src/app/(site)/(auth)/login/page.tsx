'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { PageContainer } from '@/components/layout/page-container';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = useCallback(async () => {
    if (!phone || phone.length < 7) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+971${phone}` }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        setTimer(60);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [phone]);

  const handleVerify = useCallback(async () => {
    if (code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+971${phone}`, code }),
      });
      const data = await res.json();
      if (data.success) {
        await refresh();
        router.push('/my-team');
      } else {
        setError(data.message || 'Invalid code');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [phone, code, refresh, router]);

  const handleResend = useCallback(async () => {
    if (timer > 0) return;
    setTimer(60);
    setError('');
    try {
      await fetch('/api/auth/otp/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+971${phone}` }),
      });
    } catch {
      setError('Failed to resend code');
    }
  }, [phone, timer]);

  return (
    <PageContainer>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-sm mx-auto space-y-8">
          {/* TCL Logo Placeholder */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-tcl-red flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">TCL</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-text-primary">Sign In</h1>
          </div>

          {error && (
            <div className="rounded-lg bg-bg-surface border border-red-500/30 px-4 py-3 text-error text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-secondary">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="flex items-center rounded-lg bg-bg-surface border border-border-default px-3 text-text-muted text-sm shrink-0">
                  +971
                </div>
                <Input
                  type="tel"
                  placeholder="50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                />
              </div>
              <Button
                className="w-full bg-tcl-red hover:bg-tcl-red/90 text-white"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-secondary">
                Enter the 6-digit code sent to +971{phone}
              </label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em]"
              />
              <Button
                className="w-full bg-tcl-red hover:bg-tcl-red/90 text-white"
                onClick={handleVerify}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
              <div className="text-center">
                {timer > 0 ? (
                  <span className="text-sm text-text-muted">
                    Resend code in {timer}s
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm text-tcl-red hover:underline"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
