import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const createPrizeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  value: z.string().optional(),
  tier: z.enum(["GRAND", "RUNNER_UP", "MVP"]),
  order: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.prizePackage.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch prizes:", error);
    return NextResponse.json(
      { error: "Failed to fetch prizes" },
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
    const data = createPrizeSchema.parse(body);

    const maxOrder = await prisma.prizePackage.aggregate({
      _max: { order: true },
    });

    const item = await prisma.prizePackage.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        value: data.value ?? null,
        tier: data.tier,
        order: data.order ?? (maxOrder._max.order ?? -1) + 1,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to create prize:", error);
    return NextResponse.json(
      { error: "Failed to create prize" },
      { status: 500 }
    );
  }
}
