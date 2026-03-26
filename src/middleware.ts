import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (not /api/admin — those have their own guards)
  if (pathname.startsWith("/admin")) {
    const token =
      request.cookies.get("tcl-session")?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await verifyJwt(token);
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
