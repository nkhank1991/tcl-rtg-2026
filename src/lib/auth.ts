import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import type { Session, UserRole } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "tcl-arsenal-rtg-2026-dev-secret"
);

const COOKIE_NAME = "tcl-session";

export async function signJwt(payload: Session): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

export async function getSession(request?: NextRequest): Promise<Session | null> {
  let token: string | undefined;

  if (request) {
    token =
      request.cookies.get(COOKIE_NAME)?.value ||
      request.headers.get("Authorization")?.replace("Bearer ", "");
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifyJwt(token);
}

export async function requireAuth(request: NextRequest): Promise<Session> {
  const session = await getSession(request);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireRole(
  request: NextRequest,
  role: UserRole
): Promise<Session> {
  const session = await requireAuth(request);
  const roleHierarchy: Record<UserRole, number> = {
    FAN: 0,
    CAPTAIN: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3,
  };
  if (roleHierarchy[session.role] < roleHierarchy[role]) {
    throw new Error("Forbidden");
  }
  return session;
}

export function setSessionCookie(token: string) {
  return {
    "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
  };
}

export function clearSessionCookie() {
  return {
    "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  };
}
