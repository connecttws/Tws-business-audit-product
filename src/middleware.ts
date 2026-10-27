import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "tws_default_fallback_secret_key_2026";
const key = new TextEncoder().encode(JWT_SECRET);
const SESSION_COOKIE_NAME = "tws_audit_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(sessionCookie, key, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      // Invalid/expired token
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users from login/register to /dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (sessionCookie) {
      try {
        await jwtVerify(sessionCookie, key, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // Continue to login/register if token invalid
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
