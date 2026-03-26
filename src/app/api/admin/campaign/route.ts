import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

const patchCampaignSchema = z.object({
  state: z
    .enum(["PRE_LAUNCH", "LAUNCH", "SCREENING", "LIVE", "POST_EVENT"])
    .optional(),
  title: z.string().min(1, "Title is required").optional(),
  tagline: z.string().min(1, "Tagline is required").optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const campaign = await prisma.campaign.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "No campaign found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Failed to fetch campaign:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireRole(request, "ADMIN");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = patchCampaignSchema.parse(body);

    const campaign = await prisma.campaign.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "No campaign found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (data.state !== undefined) {
      updateData.state = data.state;
    }
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.tagline !== undefined) {
      updateData.tagline = data.tagline;
    }
    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    }

    const updated = await prisma.campaign.update({
      where: { id: campaign.id },
      data: updateData,
    });

    return NextResponse.json({ campaign: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Failed to update campaign:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}
