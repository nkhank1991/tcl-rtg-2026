import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [teams, matches, applications, campaign] = await Promise.all([
    prisma.team.count(),
    prisma.match.count(),
    prisma.application.count(),
    prisma.campaign.findFirst({ select: { state: true } }),
  ]);

  return NextResponse.json({
    teams,
    matches,
    applications,
    campaignState: campaign?.state ?? "PRE_LAUNCH",
  });
}
