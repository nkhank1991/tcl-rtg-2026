import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const sendSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  category: z.string().min(1),
  target: z.enum(["ALL", "FAN", "CAPTAIN"]),
  data: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, body: notifBody, category, target, data } =
      sendSchema.parse(body);

    const whereClause =
      target === "ALL" ? {} : { role: target as "FAN" | "CAPTAIN" };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No users found for the selected audience" },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.createMany({
      data: users.map((user) => ({
        userId: user.id,
        title,
        body: notifBody,
        category,
        data: data ? JSON.parse(JSON.stringify(data)) : undefined,
      })),
    });

    return NextResponse.json({
      success: true,
      count: notifications.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
