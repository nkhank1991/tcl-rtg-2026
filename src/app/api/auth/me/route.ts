import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch real user from database
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        avatarUrl: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
