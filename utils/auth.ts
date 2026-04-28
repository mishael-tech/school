import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "@/utils/auth-constants";

export { ADMIN_COOKIE_NAME };
const WEEK_SECONDS = 60 * 60 * 24 * 7;

export function requireJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret?.length) {
    throw new Error("JWT_SECRET is missing or empty.");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminJwt(payload: { sub: string; email: string }) {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(requireJwtSecret());
}

export async function verifyAdminJwt(token: string) {
  const { payload } = await jwtVerify(token, requireJwtSecret());
  const sub = payload.sub;
  if (!sub || typeof sub !== "string") return null;
  const email =
    typeof payload.email === "string" ? payload.email : undefined;
  return { id: sub, email };
}

export async function setAdminSessionCookie(token: string) {
  const store = await cookies();
  store.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: WEEK_SECONDS,
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

export async function getOptionalAuthFromCookies() {
  const store = await cookies();
  const tok = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!tok) return null;
  try {
    return await verifyAdminJwt(tok);
  } catch {
    return null;
  }
}
