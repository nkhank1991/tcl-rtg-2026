import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status");
  const stage = searchParams.get("stage");

  const where: Record<string, unknown> = {};

  if (status === "LIVE") {
    where.status = { in: ["LIVE_FIRST_HALF", "HALF_TIME", "LIVE_SECOND_HALF"] };
  } else if (status === "UPCOMING") {
    where.status = "SCHEDULED";
  } else if (status === "COMPLETED") {
    where.status = { in: ["COMPLETED", "FULL_TIME"] };
  }

  if (stage) {
    where.stage = stage;
  }

  const matches = await prisma.match.findMany({
    where,
    include: {
      homeTeam: true,
      awayTeam: true,
      score: true,
      pitch: true,
      group: true,
      events: true,
    },
  });

  return NextResponse.json({ matches });
}
