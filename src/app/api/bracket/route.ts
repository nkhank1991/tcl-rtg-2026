import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bracket = await prisma.bracketNode.findMany({
    include: { team: true, winner: true },
    orderBy: [{ stage: "asc" }, { position: "asc" }],
  });

  return NextResponse.json({ bracket });
}
