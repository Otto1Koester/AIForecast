import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "aiforecast_session";

export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sku/:path*", "/methodology"],
};
