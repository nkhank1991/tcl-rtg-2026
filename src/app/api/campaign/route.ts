import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const campaign = await prisma.campaign.findFirst();

  return NextResponse.json({ campaign });
}
