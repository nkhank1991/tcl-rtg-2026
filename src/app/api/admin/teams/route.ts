import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { z } from "zod/v4";

const createTeamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  shortName: z.string().nullable().optional(),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: z.string().nullable().optional(),
  groupId: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const teams = await prisma.team.findMany({
      include: {
        group: true,
        _count: { select: { players: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createTeamSchema.parse(body);

    const team = await prisma.team.create({
      data: {
        name: parsed.name,
        shortName: parsed.shortName ?? null,
        logoUrl: parsed.logoUrl ?? null,
        primaryColor: parsed.primaryColor ?? null,
        groupId: parsed.groupId ?? null,
        bio: parsed.bio ?? null,
        source: parsed.source ?? null,
      },
      include: {
        group: true,
        _count: { select: { players: true } },
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to create team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
