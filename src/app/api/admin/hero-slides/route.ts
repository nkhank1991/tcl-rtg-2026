import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const createSchema = z.object({
  backgroundUrl: z.string().url(),
  tag: z.string().optional(),
  title1: z.string().min(1),
  title2: z.string().min(1),
  description: z.string().min(1),
  ctaText: z.string().optional(),
  ctaHref: z.string().optional(),
  cta2Text: z.string().optional(),
  cta2Href: z.string().optional(),
  accent: z.string().default("tcl-red"),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json(slides);
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createSchema.parse(body);

    const slide = await prisma.heroSlide.create({ data });

    return NextResponse.json(slide, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
