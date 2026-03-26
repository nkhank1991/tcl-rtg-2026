"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Trophy, HelpCircle, ChevronRight, Users, Zap, MapPin,
  Calendar, ArrowRight, Clock, ChevronDown, Play, Shield, Plane,
  Target, Timer, Award, Tv, Star,
} from "lucide-react";
import { MatchCard } from "@/components/matches/match-card";
import { PageContainer } from "@/components/layout/page-container";
import { useQuery } from "@tanstack/react-query";
import type { Match, Group, FaqItem, Team } from "@/types";
import { useEffect, useState } from "react";

/* ── Real TCL Cup 2025 photos + Arsenal ── */
const TCL = {
  pitchWide: "/images/tcl-2025/asf02488.jpg",
  pitchSunset: "/images/tcl-2025/asf01722.jpg",
  matchAction1: "/images/tcl-2025/asf02556.jpg",
  matchAction2: "/images/tcl-2025/asf01835.jpg",
  matchAction3: "/images/tcl-2025/asf01964.jpg",
  matchNight: "/images/tcl-2025/asf02916.jpg",
  matchOverhead: "/images/tcl-2025/asf02572.jpg",
  playerBall: "/images/tcl-2025/asf02290.jpg",
  teamYellow: "/images/tcl-2025/asf01783.jpg",
  teamBlue: "/images/tcl-2025/asf02533.jpg",
  teamDark: "/images/tcl-2025/asf02129.jpg",
  huddle: "/images/tcl-2025/asf01933.jpg",
  zoneShowroom: "/images/tcl-2025/asf01729.jpg",
  zoneSkills: "/images/tcl-2025/asf01872.jpg",
  zonePrecision: "/images/tcl-2025/asf01877.jpg",
  zoneReaction: "/images/tcl-2025/asf02013.jpg",
  zoneTVs: "/images/tcl-2025/asf02411.jpg",
  champsTrophy: "/images/tcl-2025/asf02706.jpg",
  champsAward: "/images/tcl-2025/asf03021.jpg",
  champsCelebrate: "/images/tcl-2025/asf03048.jpg",
  champsHandshake: "/images/tcl-2025/asf03029.jpg",
  registration: "/images/tcl-2025/asf01723.jpg",
  walkTogether: "/images/tcl-2025/asf01958.jpg",
  pitchMatch: "/images/tcl-2025/asf02490.jpg",
};

const ARSENAL = {
  emirates: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
  londonBridge: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
};

/* ── Arsenal Player Headshots (arsenal.com) ── */
const PLAYERS = {
  saka: "https://www.arsenal.com/sites/default/files/styles/player_card_extra_large/public/images/SAKA_Headshot_web_mxqw4vma.png?auto=webp&itok=mXHp-ntj",
  saliba: "https://www.arsenal.com/sites/default/files/styles/player_card_extra_large/public/images/SALIBA_Headshot_web_khl9z1vw.png?auto=webp&itok=BrlQAG-l",
  odegaard: "https://www.arsenal.com/sites/default/files/styles/player_card_extra_large/public/images/ODEGAARD_Headshot_web_z0tram3m.png?auto=webp&itok=_dEP6AGf",
  rice: "https://www.arsenal.com/sites/default/files/styles/player_card_extra_large/public/images/RICE_Headshot_web_ml5vq29g.png?auto=webp&itok=QKbJCB4M",
  havertz: "https://www.arsenal.com/sites/default/files/styles/player_card_extra_large/public/images/HAVERTZ_Headshot_web_frc1f8l3.png?auto=webp&itok=9nJcF-Og",
  raya: "https://www.arsenal.com/sites/default/files/styles/player_card_extra_large/public/images/RAYA_Headshot_web_njztl3wr.png?auto=webp&itok=Ip6nOvxe",
  squad: "https://www.arsenal.com/sites/default/files/styles/gallery_extra_large/public/images/Arsenal%20Mens%20Squad%202025_26%20%281%29_jrfy84n7.jpg?auto=webp&itok=Qj_mGv6F",
};

/* ── TCL × Arsenal Campaign & Partnership imagery ── */
const CAMPAIGN = {
  inspireGreatness: "https://aws-obg-image-lb-4.tcl.com/content/dam/brandsite/region/il/meabg/new/20261-27/pc.jpg",
  arsenalPlayers: "https://aws-obg-image-lb-4.tcl.com/content/dam/brandsite/region/saudi-arabia/news/pc/detail/2024/12-4/arsenal-news.jpg",
  partnership: "https://aws-obg-image-lb-1.tcl.com/content/dam/brandsite/region/gulf/news/5-30/2.jpg",
  poster1: "https://res.cloudinary.com/dxb0ptf6a/image/upload/c_fill,dpr_auto,g_auto,w_600,h_1080/q_60/f_auto/prod/assets/02_success_stories/arsenal-tcl/tclxarsenal9.jpg",
  poster2: "https://res.cloudinary.com/dxb0ptf6a/image/upload/c_fill,dpr_auto,g_xy_center,x_1620,y_1080,z_1,ar_16:9,w_605/q_auto/f_auto/prod/assets/02_success_stories/arsenal-tcl/tclxarsenal10.jpg",
  poster3: "https://res.cloudinary.com/dxb0ptf6a/image/upload/c_fill,dpr_auto,g_xy_center,x_1619,y_1080,z_1,ar_16:9,w_605/q_auto/f_auto/prod/assets/02_success_stories/arsenal-tcl/tclxarsenal.jpg",
  poster4: "https://res.cloudinary.com/dxb0ptf6a/image/upload/prod/assets/02_success_stories/arsenal-tcl/tclxarsenal12.jpg",
  poster5: "https://res.cloudinary.com/dxb0ptf6a/image/upload/prod/assets/02_success_stories/arsenal-tcl/tclxarsenal7.jpg",
  poster6: "https://res.cloudinary.com/dxb0ptf6a/image/upload/prod/assets/02_success_stories/arsenal-tcl/tclxarsenal14.jpg",
  sakaBrand: "https://biz-file.com/c/2601/800936-1200x624.jpg",
  arsenalRenewal: "https://www.arsenal.com/sites/default/files/styles/desktop_16x9/public/images/TCL-renewal_yuogkdps.png",
  gallery2: "https://res.cloudinary.com/dxb0ptf6a/image/upload/prod/galleries/arsenal-tcl/tclxarsenal2.jpg",
  gallery3: "https://res.cloudinary.com/dxb0ptf6a/image/upload/prod/galleries/arsenal-tcl/tclxarsenal3.jpg",
  gallery4: "https://res.cloudinary.com/dxb0ptf6a/image/upload/prod/galleries/arsenal-tcl/tclxarsenal4.jpg",
  gallery6: "https://res.cloudinary.com/dxb0ptf6a/image/upload/prod/galleries/arsenal-tcl/tclxarsenal6.jpg",
  gallery8: "https://res.cloudinary.com/dxb0ptf6a/image/upload/prod/galleries/arsenal-tcl/tclxarsenal8.jpg",
  gallery13: "https://res.cloudinary.com/dxb0ptf6a/image/upload/prod/galleries/arsenal-tcl/tclxarsenal13.jpg",
};

/* ── TCL Product & UAE imagery ── */
const TCL_BRAND = {
  miniLedHero: "https://aws-obg-image-lb-4.tcl.com/content/dam/brandsite/region/europe/products/tv/c-series/c955/id-image/tcl-98-c955-hero-front-new.png",
  miniLedBanner: "https://aws-obg-image-lb-1.tcl.com/content/dam/brandsite/global/images-for-blog/qd-mini-led-tv-pc.jpg",
  inspireGreatnessBanner: "https://aws-obg-image-lb-1.tcl.com/content/dam/brandsite/global/homepage/pc/PC_Inspire_Greatness_2.jpg",
  dubaiLaunch: "https://aws-obg-image-lb-1.tcl.com/content/dam/brandsite/region/gulf/news/3-12.jpg",
  arsenalCampaignWide: "https://aws-obg-image-lb-1.tcl.com/content/dam/brandsite/region/north-america/ema/1.jpg",
  ces2025: "https://aws-obg-image-lb-1.tcl.com/content/dam/brandsite/region/north-america/ema/1.jpg",
  ifa2025: "https://aws-obg-image-lb-1.tcl.com/content/dam/brandsite/region/meaf/ifa-new-2025/hero-banner.jpg",
};

/* ── Countdown hook ── */
function useCountdown() {
  const eventDate = new Date("2026-04-26T10:00:00+04:00");
  const [t, setT] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = eventDate.getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ── Section Label ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-1 h-4 bg-tcl-red rounded-full" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">{children}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                        */
/* ══════════════════════════════════════════════════════════════════ */

/* ── Hero slides data ── */
const HERO_SLIDES = [
    {
      bg: TCL.pitchWide,
      tag: "TCL × Arsenal Football Club presents",
      title1: "ROAD TO",
      title2: "GREATNESS",
      desc: "The UAE\u2019s premier grassroots 5-a-side tournament. Compete for your chance to fly to London and train at Emirates Stadium.",
      cta: { text: "Register Your Team", href: "/register" },
      cta2: { text: "View Schedule", href: "/matches" },
      accent: "tcl-red",
    },
    {
      bg: CAMPAIGN.inspireGreatness,
      tag: "Official Global Partnership",
      title1: "TCL ×",
      title2: "ARSENAL",
      desc: "TCL, the world\u2019s No.2 TV brand, and Arsenal FC unite to inspire greatness on and off the pitch across the Middle East.",
      cta: { text: "Explore Partnership", href: "/prize" },
      cta2: { text: "Meet the Stars", href: "/teams" },
      accent: "arsenal-gold",
    },
    {
      bg: CAMPAIGN.sakaBrand,
      tag: "Brand Ambassador",
      title1: "BUKAYO",
      title2: "SAKA",
      desc: "Arsenal\u2019s #7 joins TCL as brand ambassador. Inspiring the next generation of grassroots talent through the Road to Greatness.",
      cta: { text: "Register Now", href: "/register" },
      cta2: { text: "View Highlights", href: "/highlights" },
      accent: "tcl-red",
    },
    {
      bg: TCL_BRAND.miniLedBanner,
      tag: "TCL Technology",
      title1: "MINI LED",
      title2: "BRILLIANCE",
      desc: "Experience the tournament on TCL\u2019s flagship C955 QD-Mini LED. 5,000+ dimming zones, 115\" of pure cinema. The official screen of Road to Greatness.",
      cta: { text: "Register Your Team", href: "/register" },
      cta2: { text: "Explore TCL", href: "/zone" },
      accent: "tcl-red",
    },
    {
      bg: TCL_BRAND.inspireGreatnessBanner,
      tag: "TCL × UAE",
      title1: "INSPIRE",
      title2: "GREATNESS",
      desc: "From Dubai to London \u2014 TCL brings world-class entertainment and grassroots football together. The No.2 TV brand globally, proudly powering the UAE\u2019s biggest 5-a-side tournament.",
      cta: { text: "Register Now", href: "/register" },
      cta2: { text: "The Zone", href: "/zone" },
      accent: "arsenal-gold",
    },
    {
      bg: TCL.champsTrophy,
      tag: "The Ultimate Prize",
      title1: "ROAD TO",
      title2: "LONDON",
      desc: "Win an all-expenses-paid trip to London. Train at Emirates Stadium with Arsenal coaches. The dream starts here.",
      cta: { text: "Register Your Team", href: "/register" },
      cta2: { text: "Learn More", href: "/prize" },
      accent: "arsenal-gold",
    },
];

export default function HomePage() {
  const countdown = useCountdown();
  const [heroSlide, setHeroSlide] = useState(0);

  const { data: matchesData } = useQuery<{ matches: Match[] }>({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await fetch("/api/matches");
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
    },
  });

  const { data: standingsData } = useQuery<{ groups: Group[] }>({
    queryKey: ["standings"],
    queryFn: async () => {
      const res = await fetch("/api/standings");
      if (!res.ok) throw new Error("Failed to fetch standings");
      return res.json();
    },
  });

  const { data: faqData } = useQuery<{ items: FaqItem[] }>({
    queryKey: ["faq"],
    queryFn: async () => {
      const res = await fetch("/api/faq");
      if (!res.ok) throw new Error("Failed to fetch FAQ");
      return res.json();
    },
  });

  const { data: teamsData } = useQuery<{ teams: Team[] }>({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json();
    },
  });

  const allMatches = matchesData?.matches ?? [];
  const allGroups = standingsData?.groups ?? [];
  const allFaq = faqData?.items ?? [];
  const allTeams = teamsData?.teams ?? [];

  const groupA = allGroups[0];
  const topFaq = allFaq.slice(0, 3);

  const slide = HERO_SLIDES[heroSlide];

  /* Auto-rotate hero slides — resets on manual click */
  useEffect(() => {
    const id = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(id);
  }, [heroSlide]);

  return (
    <div className="min-h-screen bg-bg-primary">

      {/* ─────────────────────────────────────────────────────────── */}
      {/*  HERO — Multi-slide cinematic carousel                      */}
      {/* ─────────────────────────────────────────────────────────── */}

      <section className="relative min-h-[100dvh] flex flex-col overflow-hidden">
        {/* Layer 1: Background images — all slides stacked, opacity transition */}
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: heroSlide === i ? 1 : 0, zIndex: heroSlide === i ? 1 : 0 }}
          >
            <Image src={s.bg} alt={s.tag} fill sizes="100vw" className="object-cover scale-105" priority={i === 0} />
          </div>
        ))}

        {/* Layer 2: Gradient overlays (always visible) */}
        <div className="absolute inset-0 z-[2]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary from-[20%] via-bg-primary/95 via-[40%] to-transparent to-[65%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/50 via-transparent to-bg-primary/30" />
        </div>

        {/* Layer 3: Cinematic light effects */}
        <div className="absolute inset-0 pointer-events-none z-[3]">
          <div className={`absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full blur-[120px] transition-colors duration-[1200ms] ${slide.accent === "arsenal-gold" ? "bg-arsenal-gold/10" : "bg-tcl-red/10"}`} />
          <div className={`absolute top-[25%] right-[-5%] w-[200px] h-[200px] rounded-full blur-[100px] transition-colors duration-[1200ms] ${slide.accent === "arsenal-gold" ? "bg-tcl-red/8" : "bg-arsenal-gold/8"}`} />
          <div className="absolute bottom-[20%] left-[30%] w-[250px] h-[250px] bg-tcl-red/5 rounded-full blur-[100px]" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-tcl-red/40 to-transparent" />
        </div>

        {/* Layer 4: Top bar */}
        <div className="relative z-30 px-6 pt-14 pb-4">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-tcl-red/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-tcl-red/20">
                <span className="text-white text-[7px] font-black font-display">TCL</span>
              </div>
              <div className="w-[1px] h-5 bg-white/10" />
              <div className="w-9 h-9 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center">
                <Shield className="w-4 h-4 text-white/80" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-tcl-red animate-pulse" />
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Season 2026</span>
            </div>
          </div>
        </div>

        {/* Layer 5: Slide indicator dots */}
        <div className="relative z-30 px-6 mt-2">
          <div className="max-w-lg mx-auto flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className="relative h-[3px] rounded-full overflow-hidden transition-all duration-300"
                style={{ width: heroSlide === i ? 32 : 12, backgroundColor: heroSlide === i ? "transparent" : "rgba(255,255,255,0.15)" }}
              >
                {heroSlide === i && (
                  <>
                    <div className="absolute inset-0 bg-white/15 rounded-full" />
                    <div className="absolute inset-y-0 left-0 bg-tcl-red rounded-full animate-[heroProgress_6s_linear]" style={{ width: "100%" }} />
                  </>
                )}
              </button>
            ))}
            <span className="ml-auto text-[9px] font-score text-white/20">
              {String(heroSlide + 1).padStart(2, "0")}/{String(HERO_SLIDES.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 relative z-10" />

        {/* Layer 6: Bottom content — slides with crossfade */}
        <div className="relative z-20 px-6 pb-6">
          <div className="max-w-lg mx-auto w-full">
            {/* Title block — animated per slide */}
            <div className="mb-5" key={heroSlide}>
              <p className={`text-[9px] font-bold uppercase tracking-[0.5em] mb-2 transition-colors duration-700 ${slide.accent === "arsenal-gold" ? "text-arsenal-gold/80" : "text-tcl-red/80"}`}>
                {slide.tag}
              </p>
              <h1 className="font-display font-black text-[46px] leading-[0.9] tracking-[-0.02em] text-white mb-0.5">
                {slide.title1}
              </h1>
              <div className="flex items-end gap-3">
                <h1 className={`font-display font-black text-[46px] leading-[0.9] tracking-[-0.02em] text-transparent bg-clip-text bg-gradient-to-r ${slide.accent === "arsenal-gold" ? "from-arsenal-gold via-arsenal-gold to-tcl-red" : "from-tcl-red via-tcl-red to-arsenal-gold"}`}>
                  {slide.title2}
                </h1>
                <div className={`w-2 h-2 rounded-full mb-2.5 ${slide.accent === "arsenal-gold" ? "bg-arsenal-gold" : "bg-tcl-red"}`} />
              </div>
              <p className="text-[12px] text-white/40 leading-[1.7] max-w-[320px] mt-3">
                {slide.desc}
              </p>
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-3 mb-4">
              <Link href={slide.cta.href} className="group relative px-7 py-3.5 rounded-xl bg-tcl-red text-[12px] font-display font-bold text-white overflow-hidden transition-all hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-r from-tcl-red via-[#ff1a3d] to-tcl-red opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  {slide.cta.text}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
              <Link href={slide.cta2.href} className="px-5 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[12px] font-bold text-white/50 hover:bg-white/[0.06] hover:text-white/70 transition-all backdrop-blur-sm">
                {slide.cta2.text}
              </Link>
            </div>

            {/* Countdown inline */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-tcl-red/60" />
                <span className="text-[9px] font-bold text-white/25 uppercase tracking-wider">Kickoff in</span>
              </div>
              <div className="flex items-center gap-1">
                {[
                  { val: countdown.days, lbl: "d" },
                  { val: countdown.hours, lbl: "h" },
                  { val: countdown.mins, lbl: "m" },
                  { val: countdown.secs, lbl: "s" },
                ].map(({ val, lbl }, i) => (
                  <div key={lbl} className="flex items-center">
                    {i > 0 && <span className="text-[10px] text-white/15 mx-0.5">:</span>}
                    <span className="font-score text-[13px] font-bold text-white/70">{String(val).padStart(2, "0")}</span>
                    <span className="text-[8px] text-white/25 ml-0.5">{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent z-20" />
      </section>


      <PageContainer className="pt-10">


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  TEAM SPOTLIGHT — SWISH-style player/team cards             */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>Team Spotlight</SectionLabel>
          <h2 className="font-display font-black text-[26px] text-white leading-none tracking-tight mt-1 mb-5">
            FEATURED SQUADS
          </h2>

          {/* Horizontal scroll of cinematic team cards */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
            {[
              { team: allTeams[0], img: TCL.playerBall, stat1: "3W", stat2: "9 GF", accent: "#E4002B" },
              { team: allTeams[4], img: TCL.huddle, stat1: "3W", stat2: "5 GF", accent: "#8B5CF6" },
              { team: allTeams[8], img: TCL.matchAction3, stat1: "2W", stat2: "7 GF", accent: "#06B6D4" },
              { team: allTeams[12], img: TCL.teamDark, stat1: "2W", stat2: "3 GF", accent: "#16A34A" },
            ].filter(({ team }) => team != null).map(({ team, img, stat1, stat2, accent }) => (
              <Link key={team.id} href={`/teams/${team.id}`} className="block group shrink-0">
                <div className="w-[200px] rounded-2xl overflow-hidden border border-white/[0.06] bg-bg-surface relative">
                  {/* Team photo */}
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image src={img} alt={team.name} fill sizes="200px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
                    {/* Warm glow accent */}
                    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-[40px] opacity-20" style={{ backgroundColor: accent }} />

                    {/* Overlay content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md text-white" style={{ backgroundColor: `${accent}40` }}>
                          {team.group?.name}
                        </span>
                      </div>
                      <p className="text-[16px] font-display font-black text-white leading-tight">{team.name}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{team.bio}</p>

                      {/* Stats overlay — SWISH-style */}
                      <div className="flex gap-3 mt-3">
                        <div>
                          <span className="font-score text-[18px] font-black text-white block leading-none">{stat1}</span>
                          <span className="text-[8px] text-white/30 uppercase">Record</span>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                          <span className="font-score text-[18px] font-black text-white block leading-none">{stat2}</span>
                          <span className="text-[8px] text-white/30 uppercase">Goals</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View all teams */}
          <Link href="/teams" className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-text-muted hover:text-text-secondary transition-colors uppercase tracking-wider py-2">
            View All 16 Teams <ChevronRight className="w-3 h-3" />
          </Link>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  ARSENAL STARS — Player profile cards                      */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>Inspire Greatness</SectionLabel>
          <h2 className="font-display font-black text-[26px] text-white leading-none tracking-tight mt-1 mb-2">
            ARSENAL <span className="text-tcl-red">STARS</span>
          </h2>
          <p className="text-[11px] text-text-muted mb-5">The faces behind the partnership</p>

          {/* Player cards horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5">
            {[
              { name: "Bukayo Saka", number: "7", pos: "Winger", img: PLAYERS.saka, accent: "#E4002B" },
              { name: "Martin Ødegaard", number: "8", pos: "Captain · CAM", img: PLAYERS.odegaard, accent: "#EDBB4A" },
              { name: "William Saliba", number: "2", pos: "Centre-Back", img: PLAYERS.saliba, accent: "#06B6D4" },
              { name: "Declan Rice", number: "41", pos: "Midfielder", img: PLAYERS.rice, accent: "#8B5CF6" },
              { name: "Kai Havertz", number: "29", pos: "Forward", img: PLAYERS.havertz, accent: "#16A34A" },
              { name: "David Raya", number: "1", pos: "Goalkeeper", img: PLAYERS.raya, accent: "#F97316" },
            ].map((player) => (
              <div key={player.name} className="shrink-0 w-[170px] group">
                <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-bg-surface relative">
                  {/* Player photo */}
                  <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-b from-bg-elevated to-bg-surface">
                    <Image src={player.img} alt={player.name} fill sizes="170px" className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
                    {/* Colored glow */}
                    <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full blur-[40px] opacity-25" style={{ backgroundColor: player.accent }} />
                    {/* Number watermark */}
                    <span className="absolute top-3 right-3 font-display font-black text-[48px] leading-none text-white/[0.06]">{player.number}</span>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: player.accent }} />
                        <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">{player.pos}</span>
                      </div>
                      <p className="text-[14px] font-display font-black text-white leading-tight">{player.name}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="font-score text-[20px] font-black text-white/80 leading-none">#{player.number}</span>
                        <div className="w-5 h-5 rounded-md bg-tcl-red/20 flex items-center justify-center ml-auto">
                          <Shield className="w-3 h-3 text-tcl-red/80" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Campaign banner — "Inspire Greatness Together" with Saka */}
          <div className="mt-5 rounded-2xl overflow-hidden border border-tcl-red/15 relative group cursor-pointer">
            <div className="aspect-[2/1] relative">
              <Image src={CAMPAIGN.sakaBrand} alt="TCL × Bukayo Saka — Inspire Greatness Together" fill sizes="(max-width: 512px) 100vw, 512px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/80 via-bg-primary/40 to-transparent" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-tcl-red/10 rounded-full blur-[80px]" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tcl-red/60 via-transparent to-arsenal-gold/40" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-tcl-red/90 flex items-center justify-center">
                    <span className="text-white text-[6px] font-black font-display">TCL</span>
                  </div>
                  <span className="text-[8px] text-white/30">×</span>
                  <span className="text-[10px] font-bold text-white/60">Bukayo Saka</span>
                </div>
                <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-tcl-red mb-1">Brand Ambassador</p>
                <p className="font-display font-black text-[18px] text-white leading-tight">Inspire Greatness, Together</p>
              </div>
            </div>
          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  HIGHLIGHTS REEL — Cinematic video carousel                 */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>Highlights</SectionLabel>
          <h2 className="font-display font-black text-[26px] text-white leading-none tracking-tight mt-1 mb-2">
            SEASON<br />DOCUMENTARY
          </h2>
          <p className="text-[11px] text-text-muted mb-5">Relive every moment of the 2025 campaign</p>

          {/* Featured highlight — full cinematic card */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.05] relative group cursor-pointer">
            <div className="aspect-[16/9] relative">
              <Image src={TCL.matchAction2} alt="Season Highlights" fill sizes="(max-width: 512px) 100vw, 512px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-bg-primary/10" />
              {/* Warm glow */}
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-tcl-red/10 rounded-full blur-[60px]" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/[0.06] backdrop-blur-sm group-hover:border-white/40 group-hover:scale-110 transition-all duration-300">
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-tcl-red mb-1">Featured</p>
                <p className="text-[16px] font-display font-bold text-white">Road to Greatness 2025 — Full Highlights</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-white/30">2:34</span>
                  <span className="text-[10px] text-white/20">·</span>
                  <span className="text-[10px] text-white/30">Match Day Recap</span>
                </div>
              </div>
            </div>
          </div>

          {/* Highlight reel — horizontal scroll with cinematic cards */}
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 mt-3 -mx-5 px-5">
            {[
              { img: TCL.champsTrophy, title: "Champions Crowned", time: "1:45", tag: "Ceremony" },
              { img: TCL.matchNight, title: "Night Match Drama", time: "3:12", tag: "Match Day" },
              { img: TCL.zoneSkills, title: "Skills Challenge", time: "1:58", tag: "Zone" },
              { img: TCL.champsHandshake, title: "Award Ceremony", time: "0:48", tag: "Event" },
            ].map((vid) => (
              <div key={vid.title} className="shrink-0 w-[160px] rounded-xl overflow-hidden border border-white/[0.04] cursor-pointer group/v bg-bg-surface">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image src={vid.img} alt={vid.title} fill sizes="160px" className="object-cover group-hover/v:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/v:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-tcl-red/80 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-white/70 font-mono">{vid.time}</span>
                  <span className="absolute top-1.5 left-1.5 rounded-md bg-tcl-red/20 backdrop-blur-sm px-1.5 py-0.5 text-[8px] text-tcl-red font-bold">{vid.tag}</span>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] text-text-primary font-medium truncate">{vid.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  TCL × ARSENAL PARTNERSHIP — Premium cinematic              */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>Global Partnership</SectionLabel>
          <h2 className="font-display font-black text-[26px] text-white leading-none tracking-tight mt-1 mb-5">
            TCL × ARSENAL
          </h2>

          {/* Official campaign poster — "Inspire Greatness" */}
          <div className="rounded-2xl overflow-hidden border border-tcl-red/10 relative">
            <div className="aspect-[16/9] relative">
              <Image src={CAMPAIGN.inspireGreatness} alt="TCL × Arsenal — Inspire Greatness" fill sizes="(max-width: 512px) 100vw, 512px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-bg-primary/10" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-tcl-red/50 via-arsenal-gold/40 to-tcl-red/50" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-tcl-red/10 rounded-full blur-[60px]" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-tcl-red flex items-center justify-center">
                    <span className="text-white text-[7px] font-black font-display">TCL</span>
                  </div>
                  <div className="w-px h-5 bg-white/10" />
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white/80" />
                  </div>
                </div>
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-tcl-red/80 mb-1">Official Regional Partner</p>
                <h3 className="font-display font-black text-[18px] text-white leading-tight">Inspire Greatness, Together</h3>
              </div>
            </div>
          </div>

          {/* Campaign poster scroll — Real TCL × Arsenal imagery */}
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 mt-3 -mx-5 px-5">
            {[
              { img: CAMPAIGN.arsenalPlayers, title: "Arsenal Players Campaign", sub: "Rice · Merino · White" },
              { img: CAMPAIGN.partnership, title: "Global Partnership", sub: "Multi-year expansion deal" },
              { img: CAMPAIGN.arsenalRenewal, title: "Partnership Renewal", sub: "Official announcement" },
              { img: CAMPAIGN.gallery2, title: "Stadium Activation", sub: "Emirates Stadium" },
              { img: CAMPAIGN.gallery3, title: "LED Board Branding", sub: "Match-day presence" },
              { img: CAMPAIGN.gallery4, title: "Pitch-side Boards", sub: "TCL × Arsenal" },
              { img: CAMPAIGN.gallery6, title: "Fan Engagement", sub: "Event activations" },
              { img: CAMPAIGN.gallery8, title: "Player Meet & Greet", sub: "Exclusive events" },
              { img: CAMPAIGN.gallery13, title: "Campaign Shoot", sub: "Behind the scenes" },
            ].map((poster) => (
              <div key={poster.title} className="shrink-0 w-[200px] rounded-xl overflow-hidden border border-white/[0.05] bg-bg-surface group cursor-pointer">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image src={poster.img} alt={poster.title} fill sizes="200px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-bold text-text-primary truncate">{poster.title}</p>
                  <p className="text-[9px] text-text-muted mt-0.5">{poster.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Partnership feature cards */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {[
              { icon: Shield, title: "Emirates Stadium", sub: "60,704 capacity home of Arsenal FC" },
              { icon: Plane, title: "Fly to London", sub: "All-expenses-paid trip for winners" },
              { icon: Trophy, title: "Arsenal Coaches", sub: "Professional coaching sessions" },
              { icon: Tv, title: "TCL Mini LED", sub: "Premium live match screening" },
            ].map((c) => (
              <div key={c.title} className="rounded-xl bg-bg-surface border border-white/[0.05] p-4">
                <c.icon className="w-4 h-4 text-tcl-red mb-2" />
                <p className="text-[11px] font-bold text-text-primary">{c.title}</p>
                <p className="text-[9px] text-text-muted mt-0.5 leading-relaxed">{c.sub}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  TCL MINI LED — Product showcase                           */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>TCL Technology</SectionLabel>
          <h2 className="font-display font-black text-[26px] text-white leading-none tracking-tight mt-1 mb-2">
            MINI LED <span className="text-tcl-red">TV</span>
          </h2>
          <p className="text-[11px] text-text-muted mb-5">The official screen of Road to Greatness</p>

          {/* Hero product card */}
          <div className="rounded-2xl overflow-hidden border border-tcl-red/10 bg-gradient-to-b from-bg-elevated to-bg-surface relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-tcl-red/40 to-transparent" />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-tcl-red/6 rounded-full blur-[80px]" />
            <div className="relative p-6 pb-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2.5 py-1 rounded-md bg-tcl-red/15 border border-tcl-red/20">
                  <span className="text-[8px] font-bold text-tcl-red uppercase tracking-wider">Flagship 2026</span>
                </div>
                <span className="text-[9px] text-text-muted">C955 QD-Mini LED</span>
              </div>
              <h3 className="font-display font-black text-[22px] text-white leading-tight mb-2">
                See Every Detail.<br />
                <span className="text-tcl-red">Feel Every Moment.</span>
              </h3>
              <p className="text-[11px] text-text-muted leading-relaxed max-w-[300px] mb-4">
                5,000+ local dimming zones. 98&quot; of pure cinema. Experience the Road to Greatness on the screen it deserves.
              </p>
            </div>
            {/* TV product image */}
            <div className="relative aspect-[16/8] mx-4 mb-4">
              <Image src={TCL_BRAND.miniLedBanner} alt="TCL QD-Mini LED TV" fill sizes="(max-width: 512px) 100vw, 512px" className="object-contain" />
            </div>

            {/* Spec chips */}
            <div className="px-6 pb-5">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {[
                  { label: "5,000+", sub: "Dimming Zones" },
                  { label: "144Hz", sub: "Refresh Rate" },
                  { label: "98\"", sub: "Screen Size" },
                  { label: "4K", sub: "Resolution" },
                  { label: "HDR", sub: "10+ Premium" },
                ].map((spec) => (
                  <div key={spec.label} className="shrink-0 text-center px-3 py-2.5 rounded-xl bg-bg-primary/60 border border-white/[0.04]">
                    <span className="font-score text-[14px] font-black text-white block leading-none">{spec.label}</span>
                    <span className="text-[7px] text-text-muted uppercase tracking-wider mt-1 block">{spec.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TCL at events — CES & IFA */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div className="rounded-xl overflow-hidden border border-white/[0.05] bg-bg-surface group cursor-pointer">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src={TCL_BRAND.ces2025} alt="TCL Arsenal Campaign" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="p-3">
                <p className="text-[11px] font-bold text-text-primary">TCL × Arsenal</p>
                <p className="text-[9px] text-text-muted mt-0.5">Global campaign</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/[0.05] bg-bg-surface group cursor-pointer">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src={TCL_BRAND.dubaiLaunch} alt="TCL Dubai Launch" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="p-3">
                <p className="text-[11px] font-bold text-text-primary">TCL Dubai</p>
                <p className="text-[9px] text-text-muted mt-0.5">UAE launch event</p>
              </div>
            </div>
          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  THE ZONE — Cinematic experience cards                     */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>Experience</SectionLabel>
          <h2 className="font-display font-black text-[26px] text-white leading-none tracking-tight mt-1 mb-2">
            THE ZONE
          </h2>
          <p className="text-[11px] text-text-muted mb-5">More than matches. An immersive indoor activation.</p>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { img: TCL.zoneShowroom, title: "TCL Lounge", sub: "Mini LED Showcase", icon: Tv },
              { img: TCL.zoneSkills, title: "Skills Zone", sub: "Test Your Game", icon: Target },
              { img: TCL.zonePrecision, title: "Precision", sub: "Shooting Drill", icon: Zap },
              { img: TCL.zoneReaction, title: "Reaction", sub: "Agility Test", icon: Timer },
            ].map((z) => (
              <Link key={z.title} href="/zone" className="block group">
                <div className="rounded-xl overflow-hidden border border-white/[0.05] bg-bg-surface">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image src={z.img} alt={z.title} fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/30 to-transparent" />
                    {/* Icon badge */}
                    <div className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/[0.06] backdrop-blur-sm flex items-center justify-center border border-white/[0.08]">
                      <z.icon className="w-3.5 h-3.5 text-white/60" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[12px] font-bold text-text-primary">{z.title}</p>
                    <p className="text-[9px] text-text-muted mt-0.5">{z.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  MATCH DAY — Standings + upcoming                          */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>Match Day</SectionLabel>
          <h2 className="font-display font-black text-[26px] text-white leading-none tracking-tight mt-1 mb-5">
            PERFORMANCE GRID
          </h2>

          {/* Group A standings */}
          {groupA ? (
            <div className="rounded-2xl border border-white/[0.05] bg-bg-surface overflow-hidden">
              <div className="px-5 py-3 border-b border-white/[0.04] flex items-center justify-between">
                <span className="text-[10px] font-bold text-tcl-red uppercase tracking-wider">{groupA.name}</span>
                <Link href="/standings" className="text-[9px] text-text-muted hover:text-text-secondary transition-colors flex items-center gap-1">
                  All Groups <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-[9px] text-text-muted uppercase tracking-wider">
                    <th className="text-left pl-5 py-2 font-medium">Team</th>
                    <th className="text-center py-2 font-medium w-8">P</th>
                    <th className="text-center py-2 font-medium w-8">W</th>
                    <th className="text-center py-2 font-medium w-9">GD</th>
                    <th className="text-center pr-5 py-2 font-medium w-9">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {groupA.standings.slice(0, 4).map((s, i) => (
                    <tr key={s.id} className="border-t border-white/[0.03]">
                      <td className="pl-5 py-2.5 text-[12px] font-medium text-text-primary">{s.team.shortName || s.team.name}</td>
                      <td className="text-center py-2.5 text-[11px] font-score text-text-muted">{s.played}</td>
                      <td className="text-center py-2.5 text-[11px] font-score text-text-muted">{s.won}</td>
                      <td className={`text-center py-2.5 text-[11px] font-score ${s.goalDifference > 0 ? "text-success" : s.goalDifference < 0 ? "text-error" : "text-text-muted"}`}>
                        {s.goalDifference > 0 ? "+" : ""}{s.goalDifference}
                      </td>
                      <td className={`text-center pr-5 py-2.5 text-[11px] font-score font-bold ${i < 2 ? "text-tcl-red" : "text-text-primary"}`}>{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {/* Match cards */}
          <div className="mt-3 space-y-2">
            {allMatches.slice(0, 2).map((match) => (
              <div key={match.id} className="rounded-xl border border-white/[0.04] bg-bg-surface overflow-hidden">
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  GRAND PRIZE — London destination card                     */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>Destination</SectionLabel>
          <h2 className="font-display font-black text-[26px] text-white leading-none tracking-tight mt-1 mb-5">
            GRAND PRIZE
          </h2>

          <div className="rounded-2xl overflow-hidden border border-arsenal-gold/15 relative">
            <div className="aspect-[16/10] relative">
              <Image src={ARSENAL.londonBridge} alt="London" fill sizes="(max-width: 512px) 100vw, 512px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-bg-primary/20" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-arsenal-gold/60 to-transparent" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-arsenal-gold/10 rounded-full blur-[60px]" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-arsenal-gold mb-2">Win a Trip to London</p>
                <h3 className="font-display font-black text-[20px] text-white leading-tight tracking-tight mb-3">
                  Emirates Stadium.<br />Arsenal Coaches.
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { icon: Plane, text: "Flights" },
                    { icon: Shield, text: "Stadium Tour" },
                    { icon: Trophy, text: "VIP Coaching" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.06] border border-white/[0.06]">
                      <Icon className="w-3 h-3 text-arsenal-gold/60" />
                      <span className="text-[9px] text-white/50">{text}</span>
                    </div>
                  ))}
                </div>
                <Link href="/prize" className="inline-flex items-center gap-2 text-[10px] font-bold text-arsenal-gold uppercase tracking-wider hover:text-arsenal-gold/80 transition-colors">
                  Learn More <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Arsenal squad photo */}
          <div className="mt-4 rounded-2xl overflow-hidden border border-arsenal-gold/10 relative">
            <div className="aspect-[16/8] relative">
              <Image src={PLAYERS.squad} alt="Arsenal Squad 2025/26" fill sizes="(max-width: 512px) 100vw, 512px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/30" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-arsenal-gold/70">Train with the best</p>
                <p className="text-[14px] font-display font-bold text-white mt-0.5">Arsenal FC — 2025/26 Squad</p>
              </div>
            </div>
          </div>

          {/* 2025 Champions photos */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[TCL.champsAward, TCL.champsHandshake, TCL.champsCelebrate].map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden relative border border-white/[0.04]">
                <Image src={img} alt="Champions" fill sizes="33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            ))}
          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  NAVIGATE — Quick links grid                               */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>Navigate</SectionLabel>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { href: "/matches", icon: Calendar, title: "Schedule", sub: "31 matches across 2 days" },
              { href: "/standings", icon: Award, title: "Standings", sub: "Groups & knockout bracket" },
              { href: "/highlights", icon: Play, title: "Highlights", sub: "Videos & recaps" },
              { href: "/faq", icon: HelpCircle, title: "FAQ", sub: "Quick answers" },
            ].map((nav) => (
              <Link key={nav.href} href={nav.href} className="block group">
                <div className="rounded-xl bg-bg-surface border border-white/[0.05] p-4 hover:border-white/[0.1] transition-colors">
                  <nav.icon className="w-4 h-4 text-tcl-red mb-2" />
                  <p className="text-[12px] font-bold text-text-primary">{nav.title}</p>
                  <p className="text-[9px] text-text-muted mt-0.5">{nav.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  FAQ                                                       */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14">
          <SectionLabel>Support</SectionLabel>
          <h2 className="font-display font-black text-[22px] text-white leading-none tracking-tight mt-1 mb-4">
            INTELLIGENCE BRIEF
          </h2>
          <div className="space-y-2">
            {topFaq.map((faq) => (
              <Link key={faq.id} href="/faq" className="block group">
                <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-white/[0.05] bg-bg-surface hover:border-white/[0.08] transition-colors">
                  <HelpCircle className="w-4 h-4 text-text-muted shrink-0" />
                  <p className="text-[11px] text-text-primary flex-1">{faq.question}</p>
                  <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* ─────────────────────────────────────────────────────────── */}
        {/*  REGISTRATION CTA                                          */}
        {/* ─────────────────────────────────────────────────────────── */}

        <section className="mt-14 mb-8">
          <div className="rounded-2xl border border-tcl-red/20 bg-bg-surface relative overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-40 bg-tcl-red/8 rounded-full blur-3xl" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-tcl-red/60 to-transparent" />
            <div className="relative z-10 px-6 py-10 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-tcl-red mb-3">Season 26</p>
              <h3 className="font-display font-black text-[32px] text-white leading-[0.92] tracking-tight mb-3">
                REGISTRATION<br />OPEN
              </h3>
              <p className="text-[11px] text-text-muted mb-6 max-w-[260px] mx-auto">
                Join the biggest grassroots 5-a-side tournament in the UAE
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-tcl-red font-display font-bold text-white text-[13px] shadow-lg shadow-tcl-red/20 hover:shadow-tcl-red/40 hover:scale-[1.02] transition-all">
                Join the Grid <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </PageContainer>
    </div>
  );
}
