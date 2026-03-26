"use client";

import { Trophy, Plane, Users, Star, MapPin } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";


const PRIZE_LIST = [
  { icon: <MapPin className="h-4 w-4 text-arsenal-gold shrink-0" />, title: "Emirates Stadium", desc: "Exclusive behind-the-scenes access" },
  { icon: <Users className="h-4 w-4 text-arsenal-gold shrink-0" />, title: "Arsenal Coaches", desc: "Training sessions with the pros" },
  { icon: <Star className="h-4 w-4 text-arsenal-gold shrink-0" />, title: "Arsenal Legends", desc: "Meet and greet with club icons" },
  { icon: <MapPin className="h-4 w-4 text-arsenal-gold shrink-0" />, title: "Stadium Tour", desc: "Full VIP stadium experience" },
  { icon: <Plane className="h-4 w-4 text-arsenal-gold shrink-0" />, title: "3-Day London Trip", desc: "All-expenses-paid for the squad" },
];

const JOURNEY_STEPS = [
  { title: "Group Stage", desc: "16 teams, 4 groups" },
  { title: "Quarterfinals", desc: "Top 8 battle it out" },
  { title: "Semifinals & Final", desc: "The road narrows" },
  { title: "London Bound", desc: "Champions fly to Arsenal" },
];

export default function PrizePage() {
  return (
    <PageContainer className="pt-6">
      <h1 className="text-lg font-display font-bold text-text-primary flex items-center mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
        Road to London
        <Trophy className="h-4 w-4 text-arsenal-gold ml-2" />
      </h1>

      <p className="text-xl font-display font-bold text-text-primary mt-4 mb-6">
        The winning team flies to{" "}
        <span className="text-arsenal-gold">London</span>
      </p>

      <div className="space-y-0">
        {PRIZE_LIST.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-border-default/50 last:border-b-0">
            {item.icon}
            <span className="text-[13px] font-semibold text-text-primary">{item.title}</span>
            <span className="text-[11px] text-text-muted ml-auto">{item.desc}</span>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-[13px] font-display font-semibold text-text-primary mb-3 flex items-center">
          <span className="w-1 h-1 rounded-full bg-tcl-red inline-block mr-2" />
          The Journey
        </h2>

        <div className="relative pl-5">
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border-default" />

          <div className="space-y-4">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={i} className="relative flex items-start gap-3">
                <div className="absolute left-[-13px] top-1.5 w-2 h-2 rounded-full bg-tcl-red ring-2 ring-bg-primary" />
                <div>
                  <p className="text-[13px] font-semibold text-text-primary">{step.title}</p>
                  <p className="text-[11px] text-text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
