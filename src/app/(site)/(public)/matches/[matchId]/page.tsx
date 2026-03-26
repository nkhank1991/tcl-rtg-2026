"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/page-container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatTime } from "@/lib/utils";
import type { Match } from "@/types";

export default function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);

  const {
    data: match,
    isLoading,
    error,
  } = useQuery<Match>({
    queryKey: ["match", matchId],
    queryFn: async () => {
      const res = await fetch(`/api/matches/${matchId}`);
      if (res.status === 404) throw new Error("NOT_FOUND");
      if (!res.ok) throw new Error("Failed to fetch match");
      const json = await res.json();
      return json.match;
    },
  });

  if (isLoading) {
    return (
      <PageContainer>
        <div className="pt-6 pb-4 text-center">
          <Skeleton className="h-5 w-24 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto mt-2" />
        </div>
        <Card className="mb-4">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-center space-y-2">
                <Skeleton className="h-3 w-10 mx-auto" />
                <Skeleton className="h-4 w-28 mx-auto" />
              </div>
              <div className="px-6 min-w-[100px] flex justify-center">
                <Skeleton className="h-10 w-20" />
              </div>
              <div className="flex-1 text-center space-y-2">
                <Skeleton className="h-3 w-10 mx-auto" />
                <Skeleton className="h-4 w-28 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="mb-4">
          <CardContent className="py-4 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  if (error || !match) {
    const isNotFound =
      error instanceof Error && error.message === "NOT_FOUND";
    return (
      <PageContainer>
        <div className="pt-12 text-center">
          <h1 className="text-xl font-display font-bold text-text-primary mb-2">
            {isNotFound ? "Match Not Found" : "Something went wrong"}
          </h1>
          <p className="text-sm text-text-muted">
            {isNotFound
              ? "The match you're looking for doesn't exist."
              : "We couldn't load this match. Please try again later."}
          </p>
        </div>
      </PageContainer>
    );
  }

  const isLive = match.status.includes("LIVE");
  const isCompleted = match.status === "COMPLETED";

  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `${match!.homeTeam?.shortName ?? "TBD"} vs ${match!.awayTeam?.shortName ?? "TBD"}`,
        text: match!.score
          ? `${match!.homeTeam?.shortName ?? "TBD"} ${match!.score.homeGoals} - ${match!.score.awayGoals} ${match!.awayTeam?.shortName ?? "TBD"}`
          : `${match!.homeTeam?.shortName ?? "TBD"} vs ${match!.awayTeam?.shortName ?? "TBD"}`,
        url: window.location.href,
      });
    }
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="pt-6 pb-4 text-center">
        <Badge variant="outline">{match.group?.name ?? match.stage}</Badge>
        <p className="text-xs text-text-muted mt-1">
          Match {match.matchNumber}
        </p>
      </div>

      {/* Scoreboard */}
      <Card className="mb-4">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {/* Home */}
            <div className="flex-1 text-center">
              <p className="text-xs text-text-muted mb-1">
                {match.homeTeam?.shortName ?? "TBD"}
              </p>
              <p className="text-text-primary font-medium text-sm">
                {match.homeTeam?.name ?? "TBD"}
              </p>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center px-6 min-w-[100px]">
              {match.score ? (
                <span className="font-score text-4xl font-bold text-text-primary">
                  {match.score.homeGoals} - {match.score.awayGoals}
                </span>
              ) : (
                <span className="font-score text-2xl font-bold text-text-secondary">
                  vs
                </span>
              )}
              {isLive && (
                <Badge variant="live" className="mt-2">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-live" />
                  </span>
                  LIVE
                </Badge>
              )}
              {isCompleted && (
                <span className="text-xs text-text-muted font-medium mt-1">
                  Full Time
                </span>
              )}
            </div>

            {/* Away */}
            <div className="flex-1 text-center">
              <p className="text-xs text-text-muted mb-1">
                {match.awayTeam?.shortName ?? "TBD"}
              </p>
              <p className="text-text-primary font-medium text-sm">
                {match.awayTeam?.name ?? "TBD"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Info */}
      <Card className="mb-4">
        <CardContent className="py-4">
          <h3 className="text-sm font-medium text-text-primary mb-3">
            Match Info
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Kick-off</span>
              <span className="text-text-secondary">
                {formatTime(match.scheduledAt)},{" "}
                {formatDate(match.scheduledAt)}
              </span>
            </div>
            {match.pitch && (
              <div className="flex justify-between">
                <span className="text-text-muted">Pitch</span>
                <span className="text-text-secondary">{match.pitch.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-muted">Status</span>
              <span className="text-text-secondary">
                {match.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Events */}
      {match.events.length > 0 && (
        <Card className="mb-4">
          <CardContent className="py-4">
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Match Events
            </h3>
            <div className="space-y-3">
              {match.events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="text-text-muted font-score w-8 text-right">
                    {event.minute}&apos;
                  </span>
                  <span className="text-base">
                    {event.type === "GOAL" ? "\u26BD" : "\uD83D\uDFE8"}
                  </span>
                  <div>
                    <span className="text-text-primary">{event.playerName}</span>
                    <span className="text-text-muted ml-1.5 text-xs">
                      ({event.teamSide})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Button */}
      <Button
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={handleShare}
      >
        Share Result
      </Button>
    </PageContainer>
  );
}
