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
    const groups = await prisma.group.findMany({
      orderBy: { order: "asc" },
      include: {
        standings: {
          orderBy: { position: "asc" },
          include: {
            team: {
              select: {
                id: true,
                name: true,
                shortName: true,
                logoUrl: true,
                primaryColor: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Failed to fetch standings:", error);
    return NextResponse.json(
      { error: "Failed to fetch standings" },
      { status: 500 }
    );
  }
}
