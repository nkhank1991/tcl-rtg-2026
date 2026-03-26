import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { z } from "zod/v4";

const createPlayerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().nullable().optional(),
  number: z.number().int().min(1).max(99).nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  isCaptain: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { teamId } = await params;

    const players = await prisma.player.findMany({
      where: { teamId },
      orderBy: [{ number: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(players);
  } catch (error) {
    console.error("Failed to fetch players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { teamId } = await params;
    const body = await request.json();
    const parsed = createPlayerSchema.parse(body);

    const player = await prisma.player.create({
      data: {
        teamId,
        name: parsed.name,
        position: parsed.position ?? null,
        number: parsed.number ?? null,
        photoUrl: parsed.photoUrl ?? null,
        isCaptain: parsed.isCaptain ?? false,
      },
    });

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to create player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 }
    );
  }
}
