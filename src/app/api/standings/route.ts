import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const groups = await prisma.group.findMany({
    orderBy: { order: "asc" },
    include: {
      teams: true,
      standings: {
        include: { team: true },
        orderBy: { position: "asc" },
      },
    },
  });

  return NextResponse.json({ groups });
}
