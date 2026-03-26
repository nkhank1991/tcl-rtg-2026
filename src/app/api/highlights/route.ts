import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const highlights = await prisma.highlight.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ highlights });
}
