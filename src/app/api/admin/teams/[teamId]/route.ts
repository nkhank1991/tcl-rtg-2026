import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { z } from "zod/v4";

const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  shortName: z.string().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: z.string().nullable().optional(),
  groupId: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
});

export async function PATCH(
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
    const parsed = updateTeamSchema.parse(body);

    const team = await prisma.team.update({
      where: { id: teamId },
      data: parsed,
      include: {
        group: true,
        _count: { select: { players: true } },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to update team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.team.delete({ where: { id: teamId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
