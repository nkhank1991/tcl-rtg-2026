import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const createHighlightSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  mediaUrl: z.string().url("Valid media URL is required"),
  mediaType: z.enum(["video", "image"]).optional(),
  thumbnailUrl: z.string().url().optional(),
  matchId: z.string().optional(),
  category: z.string().optional(),
  order: z.number().optional(),
  publishedAt: z.coerce.date().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.highlight.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch highlights:", error);
    return NextResponse.json(
      { error: "Failed to fetch highlights" },
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
    const data = createHighlightSchema.parse(body);

    const maxOrder = await prisma.highlight.aggregate({
      _max: { order: true },
    });

    const item = await prisma.highlight.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType ?? "video",
        thumbnailUrl: data.thumbnailUrl ?? null,
        matchId: data.matchId ?? null,
        category: data.category ?? null,
        order: data.order ?? (maxOrder._max.order ?? -1) + 1,
        publishedAt: data.publishedAt ?? new Date(),
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
    console.error("Failed to create highlight:", error);
    return NextResponse.json(
      { error: "Failed to create highlight" },
      { status: 500 }
    );
  }
}
