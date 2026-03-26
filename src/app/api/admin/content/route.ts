import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const contentSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.string().default("text"),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const content = await prisma.siteContent.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch content" },
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
    const data = contentSchema.parse(body);

    const content = await prisma.siteContent.upsert({
      where: { key: data.key },
      update: { value: data.value, type: data.type },
      create: data,
    });

    return NextResponse.json(content);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 }
    );
  }
}
