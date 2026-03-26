import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { z } from "zod/v4";

const updateMatchSchema = z.object({
  status: z
    .enum([
      "SCHEDULED",
      "LIVE_FIRST_HALF",
      "HALF_TIME",
      "LIVE_SECOND_HALF",
      "FULL_TIME",
      "PENALTIES",
      "COMPLETED",
      "POSTPONED",
      "CANCELLED",
    ])
    .optional(),
  stage: z
    .enum(["GROUP", "QUARTER_FINAL", "SEMI_FINAL", "THIRD_PLACE", "FINAL"])
    .optional(),
  homeTeamId: z.string().nullable().optional(),
  awayTeamId: z.string().nullable().optional(),
  pitchId: z.string().nullable().optional(),
  matchNumber: z.number().int().nullable().optional(),
  scheduledAt: z.string().optional(),
  startedAt: z.string().nullable().optional(),
  endedAt: z.string().nullable().optional(),
  score: z
    .object({
      homeGoals: z.number().int().min(0),
      awayGoals: z.number().int().min(0),
      homePenalties: z.number().int().min(0).nullable().optional(),
      awayPenalties: z.number().int().min(0).nullable().optional(),
    })
    .optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { matchId } = await params;
    const body = await request.json();
    const parsed = updateMatchSchema.parse(body);

    const { score, scheduledAt, startedAt, endedAt, ...matchData } = parsed;

    const updateData: Record<string, unknown> = { ...matchData };
    if (scheduledAt !== undefined) updateData.scheduledAt = new Date(scheduledAt);
    if (startedAt !== undefined)
      updateData.startedAt = startedAt ? new Date(startedAt) : null;
    if (endedAt !== undefined)
      updateData.endedAt = endedAt ? new Date(endedAt) : null;

    const match = await prisma.match.update({
      where: { id: matchId },
      data: updateData,
      include: {
        homeTeam: true,
        awayTeam: true,
        score: true,
        pitch: true,
        group: true,
      },
    });

    if (score) {
      await prisma.score.upsert({
        where: { matchId },
        create: {
          matchId,
          homeGoals: score.homeGoals,
          awayGoals: score.awayGoals,
          homePenalties: score.homePenalties ?? null,
          awayPenalties: score.awayPenalties ?? null,
        },
        update: {
          homeGoals: score.homeGoals,
          awayGoals: score.awayGoals,
          homePenalties: score.homePenalties ?? null,
          awayPenalties: score.awayPenalties ?? null,
        },
      });
    }

    const updated = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
        score: true,
        pitch: true,
        group: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to update match:", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}
