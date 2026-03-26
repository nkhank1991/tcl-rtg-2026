import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const patchSchema = z.object({
  status: z
    .enum([
      "SUBMITTED",
      "UNDER_REVIEW",
      "SHORTLISTED",
      "RESERVE",
      "CONFIRMED",
      "NOT_SELECTED",
    ])
    .optional(),
  notes: z.string().optional(),
  reason: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let session: { userId: string };
  try {
    session = await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const data = patchSchema.parse(body);

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status !== undefined) updateData.status = data.status;

    const updated = await prisma.$transaction(async (tx) => {
      if (data.status && data.status !== application.status) {
        await tx.applicationStatusLog.create({
          data: {
            applicationId: id,
            fromStatus: application.status,
            toStatus: data.status,
            changedBy: session.userId,
            reason: data.reason ?? null,
          },
        });
      }

      return tx.application.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: { id: true, name: true, phone: true, email: true },
          },
          statusLogs: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
