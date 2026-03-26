import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { z } from "zod/v4";

const updatePlayerSchema = z.object({
  name: z.string().min(1).optional(),
  position: z.string().nullable().optional(),
  number: z.number().int().min(1).max(99).nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  isCaptain: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string; playerId: string }> }
) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { teamId, playerId } = await params;
    const body = await request.json();
    const parsed = updatePlayerSchema.parse(body);

    const player = await prisma.player.update({
      where: { id: playerId, teamId },
      data: parsed,
    });

    return NextResponse.json(player);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to update player:", error);
    return NextResponse.json(
      { error: "Failed to update player" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string; playerId: string }> }
) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { teamId, playerId } = await params;

    await prisma.player.delete({
      where: { id: playerId, teamId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete player:", error);
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    );
  }
}
