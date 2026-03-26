import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const stage = searchParams.get("stage");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (stage) where.stage = stage;
    if (status) where.status = status;

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        score: true,
        pitch: true,
        group: true,
      },
      orderBy: [{ scheduledAt: "asc" }, { matchNumber: "asc" }],
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
