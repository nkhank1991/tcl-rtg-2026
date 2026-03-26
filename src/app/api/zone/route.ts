import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.zoneSchedule.findMany({ orderBy: { order: "asc" } });

  return NextResponse.json({
    status: "UPCOMING",
    screeningTime: "2026-03-26T19:30:00Z",
    items,
  });
}
