"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Calendar, Trophy } from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Team } from "@/types";

export default function TeamProfilePage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);

  const {
    data: team,
    isLoading,
    error,
  } = useQuery<Team>({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${teamId}`);
      if (res.status === 404) throw new Error("NOT_FOUND");
      if (!res.ok) throw new Error("Failed to fetch team");
      const json = await res.json();
      return json.team;
    },
  });

  if (isLoading) {
    return (
      <PageContainer>
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mt-4 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          All Teams
        </Link>
        <div className="mb-6 space-y-2">
          <Skeleton className="h-7 w-48" />
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <Card className="mb-4">
          <CardHeader>
            <Skeleton className="h-5 w-16" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardHeader>
            <Skeleton className="h-5 w-20" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (error || !team) {
    const isNotFound =
      error instanceof Error && error.message === "NOT_FOUND";
    return (
      <PageContainer>
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mt-4 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          All Teams
        </Link>
        <div className="pt-12 text-center">
          <h1 className="text-xl font-display font-bold text-text-primary mb-2">
            {isNotFound ? "Team Not Found" : "Something went wrong"}
          </h1>
          <p className="text-sm text-text-muted">
            {isNotFound
              ? "The team you're looking for doesn't exist."
              : "We couldn't load this team. Please try again later."}
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Back link */}
      <Link
        href="/teams"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mt-4 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        All Teams
      </Link>

      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-text-primary">
          {team.name}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          {team.group && <Badge>Group {team.group.name}</Badge>}
          {team.source && <Badge variant="outline">{team.source}</Badge>}
        </div>
      </div>

      {/* Squad */}
      {team.players.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-tcl-red" />
              <h2 className="font-display font-semibold text-text-primary">
                Squad
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {team.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between py-2 border-b border-border-default last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-score font-bold text-text-secondary">
                      {player.number ?? "-"}
                    </span>
                    <span className="text-sm text-text-primary">
                      {player.name}
                    </span>
                  </div>
                  {player.position && (
                    <Badge variant="outline">{player.position}</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Standings */}
      {team.standings.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-tcl-red" />
              <h2 className="font-display font-semibold text-text-primary">
                Standings
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {team.standings.map((standing) => (
                <div
                  key={standing.id}
                  className="flex items-center justify-between py-2 border-b border-border-default last:border-0"
                >
                  <div>
                    <p className="text-text-primary">
                      Position {standing.position}
                    </p>
                    <p className="text-xs text-text-muted">
                      P{standing.played} W{standing.won} D{standing.drawn} L
                      {standing.lost} GD{standing.goalDifference > 0 ? "+" : ""}
                      {standing.goalDifference}
                    </p>
                  </div>
                  <span className="font-score font-bold text-sm text-text-primary">
                    {standing.points} pts
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Follow Button */}
      <Button className="w-full bg-tcl-red text-white" size="lg">
        Follow Team
      </Button>
    </PageContainer>
  );
}
