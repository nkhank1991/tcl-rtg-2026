import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "At least one ID is required"),
});

export async function PATCH(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ids } = reorderSchema.parse(body);

    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.faqItem.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to reorder FAQ items:", error);
    return NextResponse.json(
      { error: "Failed to reorder FAQ items" },
      { status: 500 }
    );
  }
}
