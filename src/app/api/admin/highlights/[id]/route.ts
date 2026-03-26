import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const updateHighlightSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional().nullable(),
  mediaUrl: z.string().url().optional(),
  mediaType: z.enum(["video", "image"]).optional(),
  thumbnailUrl: z.string().url().optional().nullable(),
  matchId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  order: z.number().optional(),
  publishedAt: z.coerce.date().optional(),
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
    const data = updateHighlightSchema.parse(body);

    const item = await prisma.highlight.update({
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
    console.error("Failed to update highlight:", error);
    return NextResponse.json(
      { error: "Failed to update highlight" },
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

    await prisma.highlight.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete highlight:", error);
    return NextResponse.json(
      { error: "Failed to delete highlight" },
      { status: 500 }
    );
  }
}
