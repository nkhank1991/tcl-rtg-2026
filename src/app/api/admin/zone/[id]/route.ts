import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const updateZoneSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  location: z.string().optional().nullable(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  status: z.enum(["UPCOMING", "ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  category: z.string().optional().nullable(),
  capacity: z.number().int().positive().optional().nullable(),
  order: z.number().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateZoneSchema.parse(body);

    const item = await prisma.zoneSchedule.update({
      where: { id },
      data,
    });

    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to update zone schedule:", error);
    return NextResponse.json(
      { error: "Failed to update zone schedule" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.zoneSchedule.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete zone schedule:", error);
    return NextResponse.json(
      { error: "Failed to delete zone schedule" },
      { status: 500 }
    );
  }
}
