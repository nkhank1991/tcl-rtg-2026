import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { z } from "zod/v4";

const createEventSchema = z.object({
  type: z.enum(["GOAL", "YELLOW_CARD", "RED_CARD", "SUBSTITUTION", "PENALTY"]),
  minute: z.number().int().min(0),
  teamSide: z.enum(["HOME", "AWAY"]),
  playerName: z.string().nullable().optional(),
  detail: z.string().nullable().optional(),
});

export async function GET(
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

    const events = await prisma.matchEvent.findMany({
      where: { matchId },
      orderBy: { minute: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch match events:", error);
    return NextResponse.json(
      { error: "Failed to fetch match events" },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const parsed = createEventSchema.parse(body);

    const event = await prisma.matchEvent.create({
      data: {
        matchId,
        type: parsed.type,
        minute: parsed.minute,
        teamSide: parsed.teamSide,
        playerName: parsed.playerName ?? null,
        detail: parsed.detail ?? null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to create match event:", error);
    return NextResponse.json(
      { error: "Failed to create match event" },
      { status: 500 }
    );
  }
}
