import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const updatePrizeSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  value: z.string().optional().nullable(),
  tier: z.enum(["GRAND", "RUNNER_UP", "MVP"]).optional(),
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
    const data = updatePrizeSchema.parse(body);

    const item = await prisma.prizePackage.update({
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
    console.error("Failed to update prize:", error);
    return NextResponse.json(
      { error: "Failed to update prize" },
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

    await prisma.prizePackage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete prize:", error);
    return NextResponse.json(
      { error: "Failed to delete prize" },
      { status: 500 }
    );
  }
}
