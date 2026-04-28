import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/utils/auth-constants";

function encodedSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret?.length) {
    throw new Error("JWT_SECRET is not set");
  }
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

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, encodedSecret());
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
