import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all completed group-stage matches with scores
    const matches = await prisma.match.findMany({
      where: {
        status: "COMPLETED",
        stage: "GROUP",
        groupId: { not: null },
        homeTeamId: { not: null },
        awayTeamId: { not: null },
      },
      include: {
        score: true,
      },
    });

    // Build stats per group per team
    const groupTeamStats = new Map<string, Map<string, TeamStats>>();

    for (const match of matches) {
      if (!match.groupId || !match.homeTeamId || !match.awayTeamId || !match.score) {
        continue;
      }

      const { groupId, homeTeamId, awayTeamId } = match;
      const { homeGoals, awayGoals } = match.score;

      if (!groupTeamStats.has(groupId)) {
        groupTeamStats.set(groupId, new Map());
      }
      const teamMap = groupTeamStats.get(groupId)!;

      // Initialize if needed
      for (const teamId of [homeTeamId, awayTeamId]) {
        if (!teamMap.has(teamId)) {
          teamMap.set(teamId, {
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
          });
        }
      }

      const homeStats = teamMap.get(homeTeamId)!;
      const awayStats = teamMap.get(awayTeamId)!;

      // Update played
      homeStats.played += 1;
      awayStats.played += 1;

      // Update goals
      homeStats.goalsFor += homeGoals;
      homeStats.goalsAgainst += awayGoals;
      awayStats.goalsFor += awayGoals;
      awayStats.goalsAgainst += homeGoals;

      // Update W/D/L and points
      if (homeGoals > awayGoals) {
        homeStats.won += 1;
        homeStats.points += 3;
        awayStats.lost += 1;
      } else if (homeGoals < awayGoals) {
        awayStats.won += 1;
        awayStats.points += 3;
        homeStats.lost += 1;
      } else {
        homeStats.drawn += 1;
        homeStats.points += 1;
        awayStats.drawn += 1;
        awayStats.points += 1;
      }
    }

    // Also include teams that are in groups but have no completed matches yet
    const groups = await prisma.group.findMany({
      include: { teams: { select: { id: true } } },
    });

    for (const group of groups) {
      if (!groupTeamStats.has(group.id)) {
        groupTeamStats.set(group.id, new Map());
      }
      const teamMap = groupTeamStats.get(group.id)!;
      for (const team of group.teams) {
        if (!teamMap.has(team.id)) {
          teamMap.set(team.id, {
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
          });
        }
      }
    }

    // Compute goal difference and positions, then upsert
    const now = new Date();
    const upserts: Promise<unknown>[] = [];

    for (const [groupId, teamMap] of groupTeamStats) {
      // Calculate goal difference
      for (const stats of teamMap.values()) {
        stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
      }

      // Sort teams: points desc, then GD desc, then GF desc
      const sorted = [...teamMap.entries()].sort((a, b) => {
        if (b[1].points !== a[1].points) return b[1].points - a[1].points;
        if (b[1].goalDifference !== a[1].goalDifference)
          return b[1].goalDifference - a[1].goalDifference;
        return b[1].goalsFor - a[1].goalsFor;
      });

      for (let i = 0; i < sorted.length; i++) {
        const [teamId, stats] = sorted[i];
        upserts.push(
          prisma.standing.upsert({
            where: { groupId_teamId: { groupId, teamId } },
            create: {
              groupId,
              teamId,
              ...stats,
              position: i + 1,
              lastUpdated: now,
            },
            update: {
              ...stats,
              position: i + 1,
              lastUpdated: now,
            },
          })
        );
      }
    }

    await Promise.all(upserts);

    return NextResponse.json({
      success: true,
      matchesProcessed: matches.length,
      groupsUpdated: groupTeamStats.size,
      lastUpdated: now.toISOString(),
    });
  } catch (error) {
    console.error("Failed to recalculate standings:", error);
    return NextResponse.json(
      { error: "Failed to recalculate standings" },
      { status: 500 }
    );
  }
}
