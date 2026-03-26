import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const createFaqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  order: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.faqItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch FAQ items:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ items" },
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
    const data = createFaqSchema.parse(body);

    const maxOrder = await prisma.faqItem.aggregate({
      _max: { order: true },
    });

    const item = await prisma.faqItem.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category ?? null,
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
    console.error("Failed to create FAQ item:", error);
    return NextResponse.json(
      { error: "Failed to create FAQ item" },
      { status: 500 }
    );
  }
}
