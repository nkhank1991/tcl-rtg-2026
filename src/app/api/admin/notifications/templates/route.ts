import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const templateSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  category: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const templates = await prisma.notificationTemplate.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch templates" },
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
    const data = templateSchema.parse(body);

    const template = await prisma.notificationTemplate.upsert({
      where: { key: data.key },
      update: { title: data.title, body: data.body, category: data.category },
      create: data,
    });

    return NextResponse.json(template);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 }
    );
  }
}
