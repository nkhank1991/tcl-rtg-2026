"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/page-container";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface PlayerData {
  fullName: string;
  dob: string;
  emiratesId: string;
  passportNo: string;
  ukVisa: "" | "yes" | "no";
}

interface TeamData {
  teamName: string;
  captainName: string;
  captainEmail: string;
  captainMobile: string;
  cityEmirate: string;
}

interface FormErrors {
  [key: string]: string;
}

const CITIES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
];

const emptyPlayer = (): PlayerData => ({
  fullName: "",
  dob: "",
  emiratesId: "",
  passportNo: "",
  ukVisa: "",
});

/* ──────────────────────────────────────────────
   Icons (inline SVGs)
   ────────────────────────────────────────────── */

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ScrollIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function StadiumIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="12" rx="2" /><path d="M12 8V4" /><path d="M8 8V6" /><path d="M16 8V6" />
      <ellipse cx="12" cy="8" rx="9" ry="3" />
    </svg>
  );
}

function WhistleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="6" /><path d="M2 8l8 4" /><path d="M10 12l3 1.5" /><circle cx="5" cy="6" r="2" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ShirtIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2 12 5 8 2 3.62 3.46a2 2 0 0 0-1.34 1.35L.97 9.41a1 1 0 0 0 .29 1l3.74 3V22h14V13.41l3.74-3a1 1 0 0 0 .29-1l-1.31-4.6a2 2 0 0 0-1.34-1.35z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   Progress Stepper
   ────────────────────────────────────────────── */

const STEP_LABELS = ["Welcome", "Team Details", "Players", "Terms"];

function ProgressStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 py-6">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = current > stepNum;
        const isCurrent = current === stepNum;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted
                    ? "bg-success text-white"
                    : isCurrent
                    ? "bg-tcl-red text-white glow-red shadow-lg"
                    : "border border-border-default text-text-muted"
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className={`text-[10px] mt-1.5 font-medium ${isCurrent ? "text-text-primary" : "text-text-muted"}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-8 md:w-12 h-0.5 mb-4 mx-1 ${current > stepNum ? "bg-success" : "bg-border-default"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Confetti (CSS-only)
   ────────────────────────────────────────────── */

function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#E31B23", "#C8A951", "#22C55E", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6", "#FFFFFF"];
    return Array.from({ length: 30 }, (_, i) => {
      const color = colors[i % colors.length];
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 2 + Math.random() * 2;
      const size = 6 + Math.random() * 8;
      const isCircle = i % 3 === 0;
      const rotation = Math.random() * 360;
      const xDrift = -50 + Math.random() * 100;
      return { color, left, delay, duration, size, isCircle, rotation, xDrift, key: i };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <div
          key={p.key}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "-5%",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
            // @ts-expect-error CSS custom properties
            "--confetti-x": `${p.xDrift}px`,
            "--confetti-rot": `${p.rotation}deg`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) translateX(var(--confetti-x, 0px)) rotate(var(--confetti-rot, 360deg)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Animated Checkmark
   ────────────────────────────────────────────── */

function AnimatedCheckmark() {
  return (
    <div className="relative w-24 h-24 mx-auto mb-6">
      <svg className="w-24 h-24" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="#22C55E"
          strokeWidth="4"
          className="animate-draw-circle"
          strokeDasharray="283"
          strokeDashoffset="283"
        />
        <polyline
          points="30,52 45,65 70,38"
          fill="none"
          stroke="#22C55E"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-check"
          strokeDasharray="60"
          strokeDashoffset="60"
        />
      </svg>
      <style>{`
        @keyframes draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes draw-check { to { stroke-dashoffset: 0; } }
        .animate-draw-circle { animation: draw-circle 0.6s ease-out 0.3s forwards; }
        .animate-draw-check { animation: draw-check 0.4s ease-out 0.9s forwards; }
      `}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Registration Page
   ────────────────────────────────────────────── */

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});

  // Page 1
  const [email, setEmail] = useState("");

  // Page 2
  const [team, setTeam] = useState<TeamData>({
    teamName: "",
    captainName: "",
    captainEmail: "",
    captainMobile: "",
    cityEmirate: "",
  });

  // Page 3
  const [players, setPlayers] = useState<PlayerData[]>(
    Array.from({ length: 7 }, () => emptyPlayer())
  );
  const [expandedPlayer, setExpandedPlayer] = useState<number | null>(0);

  // Page 4
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Page 5
  const [refCode] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return `REF-TCL-2025-${code}`;
  });

  /* ── Validation ── */

  const validatePage1 = useCallback(() => {
    const e: FormErrors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [email]);

  const validatePage2 = useCallback(() => {
    const e: FormErrors = {};
    if (!team.teamName.trim()) e.teamName = "Team name is required";
    if (!team.captainName.trim()) e.captainName = "Captain name is required";
    if (!team.captainEmail.trim()) e.captainEmail = "Captain email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(team.captainEmail)) e.captainEmail = "Enter a valid email";
    if (!team.captainMobile.trim()) e.captainMobile = "Mobile number is required";
    if (!team.cityEmirate) e.cityEmirate = "Please select a city/emirate";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [team]);

  const validatePage3 = useCallback(() => {
    const e: FormErrors = {};
    for (let i = 0; i < 5; i++) {
      const p = players[i];
      if (!p.fullName.trim()) e[`p${i}_fullName`] = "Full name is required";
      if (!p.dob) e[`p${i}_dob`] = "Date of birth is required";
      if (!p.emiratesId.trim()) e[`p${i}_emiratesId`] = "Emirates ID is required";
      if (!p.ukVisa) e[`p${i}_ukVisa`] = "UK visa status is required";
    }
    for (let i = 5; i < 7; i++) {
      const p = players[i];
      const hasAny = p.fullName || p.dob || p.emiratesId || p.passportNo || p.ukVisa;
      if (hasAny) {
        if (!p.fullName.trim()) e[`p${i}_fullName`] = "Full name is required";
        if (!p.dob) e[`p${i}_dob`] = "Date of birth is required";
        if (!p.emiratesId.trim()) e[`p${i}_emiratesId`] = "Emirates ID is required";
        if (!p.ukVisa) e[`p${i}_ukVisa`] = "UK visa status is required";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [players]);

  const validatePage4 = useCallback(() => {
    const e: FormErrors = {};
    if (!termsAccepted) e.terms = "You must accept the terms and conditions";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [termsAccepted]);

  const handleNext = () => {
    let valid = false;
    if (step === 1) valid = validatePage1();
    else if (step === 2) valid = validatePage2();
    else if (step === 3) valid = validatePage3();
    else if (step === 4) valid = validatePage4();
    if (valid) {
      if (step === 4) {
        setStep(5);
      } else {
        setErrors({});
        setStep((s) => s + 1);
      }
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const updatePlayer = (index: number, field: keyof PlayerData, value: string) => {
    setPlayers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const isPlayerComplete = (index: number) => {
    const p = players[index];
    return !!(p.fullName && p.dob && p.emiratesId && p.ukVisa);
  };

  const registeredCount = players.filter((p) => p.fullName && p.dob && p.emiratesId && p.ukVisa).length;

  const handleShare = async () => {
    const text = `I just registered my team for the TCL Cup 2025 - Road to Greatness! UAE Qualifiers. Reference: ${refCode}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "TCL Cup 2025 Registration", text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  /* ──────────────────────────────────────────
     PAGE 1: WELCOME
     ────────────────────────────────────────── */

  const renderPage1 = () => (
    <div className="animate-slide-up space-y-6">
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-tcl-red rounded-full blur-[200px] opacity-[0.08] animate-glow pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-64 h-64 bg-arsenal-gold rounded-full blur-[120px] opacity-[0.06] pointer-events-none" />

      {/* Branding */}
      <div className="text-center space-y-4 pt-4">
        <Badge className="bg-tcl-red/20 text-tcl-red border border-tcl-red/30 px-4 py-1 text-xs font-bold tracking-widest uppercase">
          TCL &times; Arsenal
        </Badge>
        <div>
          <Badge className="bg-bg-elevated text-text-secondary border border-border-default px-3 py-1 text-[10px] tracking-[0.2em] uppercase mb-3">
            TCL CUP 2025
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-glow leading-none">
            Road to Greatness
          </h1>
          <p className="text-arsenal-gold font-display text-xl tracking-[0.3em] uppercase mt-2">
            UAE Qualifiers
          </p>
        </div>
        <Badge className="bg-bg-elevated/80 text-text-primary border border-border-strong px-4 py-1.5 text-xs font-semibold uppercase tracking-wider">
          Team Registration
        </Badge>
      </div>

      {/* Welcome Text */}
      <Card className="glass border-border-default">
        <CardContent className="pt-4 pb-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            Welcome to the official registration for the TCL Cup 2025 &ndash; Road to Greatness, the most exciting 5-a-side football tournament in the UAE!
          </p>
          <p className="text-sm text-text-secondary leading-relaxed mt-3">
            This form is for team registration only. Each team can register up to 7 players (5 main players + 2 substitutes). The tournament will be held on April 26&ndash;27, 2025 at Precision Football, Ibn Battuta Mall, Dubai.
          </p>
        </CardContent>
      </Card>

      {/* THE ULTIMATE PRIZE */}
      <div className="gradient-border rounded-xl">
        <div className="card-cinematic bg-bg-surface rounded-xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <TrophyIcon className="w-6 h-6 text-arsenal-gold" />
            <h2 className="font-display font-bold text-lg uppercase text-glow-gold tracking-wide">
              The Ultimate Prize
            </h2>
          </div>
          <div className="stagger-children space-y-3">
            {[
              { icon: <StadiumIcon className="w-5 h-5 text-arsenal-gold flex-shrink-0" />, text: "Play on the pitch at Emirates Stadium" },
              { icon: <WhistleIcon className="w-5 h-5 text-arsenal-gold flex-shrink-0" />, text: "Train with Arsenal coaches" },
              { icon: <StarIcon className="w-5 h-5 text-arsenal-gold flex-shrink-0" />, text: "Meet Arsenal FC legends" },
              { icon: <MapIcon className="w-5 h-5 text-arsenal-gold flex-shrink-0" />, text: "Exclusive stadium and museum tour" },
              { icon: <PlaneIcon className="w-5 h-5 text-arsenal-gold flex-shrink-0" />, text: "3-day trip to London, fully hosted" },
            ].map((item, i) => (
              <div key={i} className="glass flex items-center gap-3 px-4 py-3 rounded-lg">
                {item.icon}
                <span className="text-sm text-text-primary font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spots limited */}
      <Card className="glass border-tcl-red/30 bg-tcl-red/5">
        <CardContent className="pt-3 pb-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-tcl-red animate-pulse-live flex-shrink-0" />
          <p className="text-sm font-semibold text-tcl-red">
            Spots are limited. First come, first served.
          </p>
        </CardContent>
      </Card>

      {/* Important */}
      <Card className="glass-strong border-warning/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertIcon className="w-5 h-5 text-warning" />
            <h3 className="font-display font-bold text-base uppercase text-warning">Important</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2.5 text-sm text-text-secondary">
            <li className="flex gap-2">
              <span className="text-warning mt-0.5 flex-shrink-0">&#8226;</span>
              <span>All players must be 18 years or older</span>
            </li>
            <li className="flex gap-2">
              <span className="text-warning mt-0.5 flex-shrink-0">&#8226;</span>
              <span>Valid Emirates ID, Medical Insurance and Submission of Waiver Form is mandatory</span>
            </li>
            <li className="flex gap-2">
              <span className="text-warning mt-0.5 flex-shrink-0">&#8226;</span>
              <span>Participants are required to indicate whether they hold a valid UK visa</span>
            </li>
            <li className="flex gap-2">
              <span className="text-warning mt-0.5 flex-shrink-0">&#8226;</span>
              <span>
                In case a player cannot secure a UK visa, TCL reserves the right to replace the individual with the next eligible player who holds a valid visa, ensuring UAE representation at Emirates Stadium
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Accuracy note */}
      <p className="text-xs text-text-muted text-center leading-relaxed px-2">
        Please fill out all fields accurately. Once submitted, your entry will be reviewed and confirmed by the organizing team.
      </p>

      {/* Email */}
      <Input
        label="Record your email to be included with your response"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
    </div>
  );

  /* ──────────────────────────────────────────
     PAGE 2: TEAM DETAILS
     ────────────────────────────────────────── */

  const renderPage2 = () => (
    <div className="animate-slide-up space-y-6">
      <div className="flex items-center gap-3">
        <ShieldIcon className="w-6 h-6 text-tcl-red" />
        <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-text-primary">
          Team Details
        </h2>
      </div>

      <div className="gradient-border rounded-xl">
        <Card className="border-0 bg-bg-surface">
          <CardContent className="pt-5 space-y-4">
            <Input
              label="Team Name *"
              placeholder="Enter your team name"
              value={team.teamName}
              onChange={(e) => setTeam((t) => ({ ...t, teamName: e.target.value }))}
              error={errors.teamName}
              required
            />
            <Input
              label="Team Captain Full Name *"
              placeholder="Full name of the captain"
              value={team.captainName}
              onChange={(e) => setTeam((t) => ({ ...t, captainName: e.target.value }))}
              error={errors.captainName}
              required
            />
            <Input
              label="Team Captain Email ID *"
              type="email"
              placeholder="captain@email.com"
              value={team.captainEmail}
              onChange={(e) => setTeam((t) => ({ ...t, captainEmail: e.target.value }))}
              error={errors.captainEmail}
              required
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                Team Captain Mobile Number <span className="text-tcl-red">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 h-10 rounded-lg bg-bg-elevated border border-border-default text-sm text-text-muted whitespace-nowrap">
                  +971
                </div>
                <input
                  type="tel"
                  placeholder="50 123 4567"
                  value={team.captainMobile}
                  onChange={(e) => setTeam((t) => ({ ...t, captainMobile: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-bg-elevated border border-border-default text-text-primary placeholder:text-text-muted text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-tcl-red focus:border-transparent"
                />
              </div>
              {errors.captainMobile && <p className="text-xs text-error">{errors.captainMobile}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">
                City/Emirate <span className="text-tcl-red">*</span>
              </label>
              <div className="relative">
                <select
                  value={team.cityEmirate}
                  onChange={(e) => setTeam((t) => ({ ...t, cityEmirate: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg bg-bg-elevated border border-border-default text-text-primary text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-tcl-red focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select your city/emirate</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
              </div>
              {errors.cityEmirate && <p className="text-xs text-error">{errors.cityEmirate}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  /* ──────────────────────────────────────────
     PAGE 3: PLAYER DETAILS
     ────────────────────────────────────────── */

  const renderPage3 = () => (
    <div className="animate-slide-up space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <UsersIcon className="w-6 h-6 text-tcl-red" />
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-text-primary">
            Player Details
          </h2>
        </div>
        <p className="text-sm text-text-secondary mt-1 ml-9">
          Up to 7 Players &ndash; 5 main + 2 Substitutes
        </p>
      </div>

      {/* Progress */}
      <div className="glass rounded-lg px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary font-medium">
            {registeredCount} of 7 players registered
          </span>
          <span className="text-xs text-text-muted">{Math.round((registeredCount / 7) * 100)}%</span>
        </div>
        <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-tcl-red rounded-full transition-all duration-500"
            style={{ width: `${(registeredCount / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Player cards */}
      <div className="stagger-children space-y-3">
        {players.map((player, i) => {
          const isSub = i >= 5;
          const isExpanded = expandedPlayer === i;
          const complete = isPlayerComplete(i);
          const playerLabel = isSub ? `Substitute Player No. ${i + 1}` : `Player No. ${i + 1}`;
          const hasErrors = Object.keys(errors).some((k) => k.startsWith(`p${i}_`));

          return (
            <div
              key={i}
              className={`gradient-border rounded-xl overflow-hidden ${isExpanded ? "" : "card-cinematic"}`}
            >
              <div
                className={`bg-bg-surface rounded-xl border-l-4 ${
                  isSub ? "border-l-arsenal-gold" : "border-l-tcl-red"
                }`}
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => setExpandedPlayer(isExpanded ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isSub
                          ? "bg-arsenal-gold/20 text-arsenal-gold"
                          : "bg-tcl-red/20 text-tcl-red"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-text-primary">
                          {player.fullName || (isExpanded ? playerLabel : "Tap to add")}
                        </span>
                        <Badge
                          variant={isSub ? "warning" : "error"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {isSub ? "Substitute" : "Main"}
                        </Badge>
                      </div>
                      {!isExpanded && player.fullName && (
                        <span className="text-xs text-text-muted">{playerLabel}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {complete && (
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                    {hasErrors && !complete && (
                      <div className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center">
                        <span className="text-error text-xs font-bold">!</span>
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronUpIcon className="w-4 h-4 text-text-muted" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-text-muted" />
                    )}
                  </div>
                </button>

                {/* Expanded fields */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-border-default pt-4">
                    <Input
                      label={`${playerLabel} \u2013 Full Name *`}
                      placeholder="Enter full name"
                      value={player.fullName}
                      onChange={(e) => updatePlayer(i, "fullName", e.target.value)}
                      error={errors[`p${i}_fullName`]}
                    />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-secondary">
                        {playerLabel} &ndash; Date of Birth <span className="text-tcl-red">*</span>
                      </label>
                      <input
                        type="date"
                        value={player.dob}
                        onChange={(e) => updatePlayer(i, "dob", e.target.value)}
                        className={`w-full h-10 px-3 rounded-lg bg-bg-elevated border text-text-primary text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-tcl-red focus:border-transparent ${
                          errors[`p${i}_dob`] ? "border-error" : "border-border-default"
                        }`}
                      />
                      {errors[`p${i}_dob`] && <p className="text-xs text-error">{errors[`p${i}_dob`]}</p>}
                    </div>
                    <Input
                      label={`${playerLabel} \u2013 Emirates ID No. *`}
                      placeholder="784-XXXX-XXXXXXX-X"
                      value={player.emiratesId}
                      onChange={(e) => updatePlayer(i, "emiratesId", e.target.value)}
                      error={errors[`p${i}_emiratesId`]}
                    />
                    <Input
                      label={`${playerLabel} \u2013 Passport No.`}
                      placeholder="Enter passport number (optional)"
                      value={player.passportNo}
                      onChange={(e) => updatePlayer(i, "passportNo", e.target.value)}
                    />
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-secondary">
                        Do you have a Valid UK visa? <span className="text-tcl-red">*</span>
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => updatePlayer(i, "ukVisa", "yes")}
                          className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-all ${
                            player.ukVisa === "yes"
                              ? "bg-success/20 text-success border-2 border-success"
                              : "bg-bg-elevated border border-border-default text-text-secondary hover:bg-bg-surface"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updatePlayer(i, "ukVisa", "no")}
                          className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-all ${
                            player.ukVisa === "no"
                              ? "bg-error/20 text-error border-2 border-error"
                              : "bg-bg-elevated border border-border-default text-text-secondary hover:bg-bg-surface"
                          }`}
                        >
                          No
                        </button>
                      </div>
                      {errors[`p${i}_ukVisa`] && <p className="text-xs text-error">{errors[`p${i}_ukVisa`]}</p>}
                    </div>

                    {player.ukVisa === "no" && (
                      <div className="glass rounded-lg px-4 py-3 border border-info/20">
                        <p className="text-xs text-info leading-relaxed">
                          If selected as a winner, TCL reserves the right to replace players without valid UK visas to ensure UAE representation at Emirates Stadium.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ──────────────────────────────────────────
     PAGE 4: TERMS & CONDITIONS
     ────────────────────────────────────────── */

  const renderPage4 = () => (
    <div className="animate-slide-up space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <ScrollIcon className="w-6 h-6 text-tcl-red" />
          <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-text-primary">
            Terms &amp; Conditions
          </h2>
        </div>
        <p className="text-sm text-text-secondary mt-1 ml-9">Must be accepted to submit</p>
      </div>

      <Card className="glass-strong border-border-default">
        <CardContent className="pt-4 pb-4">
          <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4 text-sm text-text-secondary leading-relaxed">
            <p className="text-text-primary font-medium">Please read and acknowledge the following:</p>

            <div className="space-y-3">
              <div>
                <p className="font-semibold text-text-primary">&#8226; Eligibility:</p>
                <p className="ml-3">All players must be 18+ years old and physically fit to participate in competitive football.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; Tournament Format:</p>
                <p className="ml-3">12 teams will compete in the UAE Qualifiers, divided into 4 groups. Matches will be 5-a-side (20 mins each). The UAE Finals will be held at the same venue, leading to international qualification.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; Fair Play:</p>
                <p className="ml-3">All teams must follow fair play guidelines and respect the decisions of referees and organizers.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; Visa Clause &amp; UK Travel Eligibility:</p>
                <ul className="ml-3 space-y-1.5 list-disc list-inside">
                  <li>The winning team of the UAE Finals will travel to London to play at Emirates Stadium and meet an Arsenal legend.</li>
                  <li>All participants must confirm if they have a valid UK visa at the time of registration.</li>
                  <li>In case a player cannot secure a UK visa, TCL reserves the right to replace the individual with the next eligible player (from the same team or runner-up team or others participating in the TCL CUP UAE Qualifiers) who holds a valid visa, ensuring UAE representation at Emirates Stadium.</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; No Show Clause:</p>
                <p className="ml-3">Teams or players failing to report for scheduled matches will be disqualified, and opposing teams will automatically advance.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; Waiver of Liability:</p>
                <p className="ml-3">By registering, you release TCL, sponsors, event staff, venue officials, and organizing partners from any liability for injury, illness, or loss sustained during the event.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; Insurance:</p>
                <p className="ml-3">Participants are responsible for their own medical, travel, and personal insurance.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; ID &amp; Verification:</p>
                <p className="ml-3">All players must carry valid Emirates ID or Passport during the tournament for verification.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; Code of Conduct:</p>
                <p className="ml-3">Aggressive, abusive, or unsportsmanlike behavior may result in disqualification without refund or appeal.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; Media Release:</p>
                <p className="ml-3">By participating, you agree to allow TCL and its partners to use your photos or video recordings for promotional purposes.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary">&#8226; Final Decision:</p>
                <p className="ml-3">All decisions by referees or tournament organizers are final and binding.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkbox */}
      <button
        type="button"
        onClick={() => setTermsAccepted((v) => !v)}
        className={`w-full glass rounded-xl px-4 py-4 flex items-start gap-3 text-left transition-all border ${
          termsAccepted
            ? "border-success/40 bg-success/5"
            : errors.terms
            ? "border-error/40"
            : "border-border-default"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            termsAccepted
              ? "bg-success text-white"
              : "border-2 border-border-strong bg-bg-elevated"
          }`}
        >
          {termsAccepted && (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span className="text-sm text-text-secondary leading-relaxed">
          I confirm that the above information is accurate and that all players on our team have agreed to the Terms &amp; Conditions listed above.
        </span>
      </button>
      {errors.terms && <p className="text-xs text-error -mt-3">{errors.terms}</p>}
    </div>
  );

  /* ──────────────────────────────────────────
     PAGE 5: SUCCESS
     ────────────────────────────────────────── */

  const renderPage5 = () => (
    <div className="animate-fade-in relative min-h-[80vh] flex flex-col items-center justify-center text-center space-y-6 py-8">
      <Confetti />

      <AnimatedCheckmark />

      <div className="space-y-2">
        <h1 className="font-display text-3xl font-black text-glow shimmer-text uppercase tracking-tight">
          You&apos;re In The Game!
        </h1>
        <p className="text-text-secondary text-sm">
          Your registration has been submitted successfully
        </p>
      </div>

      {/* Reference number */}
      <Card className="glass border-border-default w-full max-w-xs mx-auto">
        <CardContent className="pt-4 pb-4 text-center">
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1">Reference Number</p>
          <p className="font-score text-lg text-text-primary font-bold tracking-wider">{refCode}</p>
        </CardContent>
      </Card>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-xs mx-auto">
        <div className="flex-1 h-px bg-border-default" />
        <span className="text-[10px] text-text-muted uppercase tracking-widest">TCL &times; Arsenal</span>
        <div className="flex-1 h-px bg-border-default" />
      </div>

      {/* What happens next */}
      <div className="w-full text-left space-y-0">
        <h3 className="font-display font-bold text-base uppercase text-text-primary mb-4 text-center">
          What Happens Next
        </h3>
        <div className="stagger-children space-y-0">
          {[
            { icon: <ClipboardIcon className="w-5 h-5" />, title: "Application Review", desc: "Our team will review your registration within 48 hours" },
            { icon: <CheckCircleIcon className="w-5 h-5" />, title: "Team Confirmation", desc: "Selected teams will receive confirmation via email" },
            { icon: <ShirtIcon className="w-5 h-5" />, title: "Match Day Prep", desc: "Receive your schedule, rules, and check-in details" },
            { icon: <TrophyIcon className="w-5 h-5" />, title: "Road to Greatness", desc: "Compete for the ultimate prize \u2014 London & Emirates Stadium" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-tcl-red flex-shrink-0">
                  {item.icon}
                </div>
                {i < 3 && <div className="w-0.5 h-8 bg-border-default" />}
              </div>
              <div className="pb-6">
                <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 glass border-border-default"
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1 bg-tcl-red glow-red"
          onClick={handleShare}
        >
          Share Your Registration
        </Button>
      </div>

      {/* Bottom banner */}
      <Card className="glass border-border-default w-full mt-4">
        <CardContent className="pt-3 pb-3 text-center">
          <p className="text-xs text-text-muted font-display uppercase tracking-widest">
            TCL Cup 2025 &mdash; Road to Greatness
          </p>
        </CardContent>
      </Card>
    </div>
  );

  /* ──────────────────────────────────────────
     RENDER
     ────────────────────────────────────────── */

  return (
    <PageContainer className="relative pt-2" padBottom={step < 5}>
      {/* Progress stepper (pages 1-4) */}
      {step < 5 && <ProgressStepper current={step} />}

      {/* Page content */}
      {step === 1 && renderPage1()}
      {step === 2 && renderPage2()}
      {step === 3 && renderPage3()}
      {step === 4 && renderPage4()}
      {step === 5 && renderPage5()}

      {/* Fixed bottom navigation (pages 1-4) */}
      {step < 5 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border-default">
          <div className="max-w-lg mx-auto px-4 py-3 flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1 glass border-border-default"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              className={`${step === 1 ? "w-full" : "flex-1"} bg-tcl-red glow-red-strong font-bold ${
                step === 4 ? "text-lg" : ""
              }`}
              onClick={handleNext}
            >
              {step === 4 ? "SUBMIT REGISTRATION" : "NEXT"}
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
