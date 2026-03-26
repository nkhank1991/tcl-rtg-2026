"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Team } from "@/types";

export default function TeamsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<{ teams: Team[] }>({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json();
    },
  });

  const teams = data?.teams ?? [];

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.shortName?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <PageContainer className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-lg font-display font-bold text-text-primary flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
            Teams
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-bg-elevated animate-pulse" />
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-6">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-lg font-display font-bold text-text-primary flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-tcl-red inline-block mr-2 mb-0.5" />
          Teams
        </h1>
        <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">16</Badge>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-8 pr-3 rounded-lg bg-bg-elevated border border-border-default text-text-primary placeholder:text-text-muted text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-tcl-red focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 stagger-children">
        {filtered.map((team) => (
          <Link key={team.id} href={`/teams/${team.id}`} className="block">
            <div className="rounded-xl bg-bg-surface border border-border-default p-3 transition-all active:scale-[0.98] hover:border-border-strong">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                  style={{
                    backgroundColor: `${team.primaryColor}20`,
                    color: team.primaryColor || undefined,
                  }}
                >
                  {team.shortName?.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-text-primary truncate">{team.name}</p>
                  <p className="text-[10px] text-text-muted">{team.group?.name}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[13px] text-text-muted py-8">No teams match your search</p>
      )}
    </PageContainer>
  );
}
