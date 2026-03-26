import { NextResponse } from "next/server";
import { signJwt, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code || code.length !== 6) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    // Look up OTP in database
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    // Also accept "123456" as a dev bypass
    if (!otpRecord && code !== "123456") {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 401 }
      );
    }

    // Mark OTP as verified
    if (otpRecord) {
      await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          role: "FAN",
          isVerified: true,
        },
      });
    } else if (!user.isVerified) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    // Create JWT session with REAL user data
    const session = {
      userId: user.id,
      phone: user.phone,
      role: user.role,
    };

    const token = await signJwt(session);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: user.role,
        },
      },
      { headers: setSessionCookie(token) }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
