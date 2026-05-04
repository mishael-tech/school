import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/utils/auth-constants";

function encodedSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret?.length) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const secretBuf = encodedSecret();
  if (!secretBuf) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("config", "missing_jwt");
    return NextResponse.redirect(login);
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, secretBuf);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.set(ADMIN_COOKIE_NAME, "", {
      path: "/",
      maxAge: 0,
    });
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
