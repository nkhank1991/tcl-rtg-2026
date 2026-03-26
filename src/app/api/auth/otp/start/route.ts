import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || phone.length < 8) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Find existing user (optional — user may not exist yet)
    const existingUser = await prisma.user.findUnique({
      where: { phone },
      select: { id: true },
    });

    // Store OTP in database
    await prisma.otpCode.create({
      data: {
        phone,
        code,
        expiresAt,
        userId: existingUser?.id ?? null,
      },
    });

    // In production, send SMS via Twilio/etc.
    // For development, return the code in the response
    return NextResponse.json({
      success: true,
      message: "OTP sent",
      devCode: code,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
