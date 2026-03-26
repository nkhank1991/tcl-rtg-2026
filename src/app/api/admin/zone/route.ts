import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const createZoneSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  location: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.enum(["UPCOMING", "ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  category: z.string().optional(),
  capacity: z.number().int().positive().optional(),
  order: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.zoneSchedule.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch zone schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch zone schedules" },
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
    const data = createZoneSchema.parse(body);

    const maxOrder = await prisma.zoneSchedule.aggregate({
      _max: { order: true },
    });

    const item = await prisma.zoneSchedule.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        location: data.location ?? null,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status ?? "UPCOMING",
        category: data.category ?? null,
        capacity: data.capacity ?? null,
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
    console.error("Failed to create zone schedule:", error);
    return NextResponse.json(
      { error: "Failed to create zone schedule" },
      { status: 500 }
    );
  }
}
