import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Optimistic redirect only. Data access is still checked in the API routes.
export async function proxy(req: NextRequest) {
  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = req.nextUrl;

  if (!session && pathname !== ROUTES.login) {
    return NextResponse.redirect(new URL(ROUTES.login, req.nextUrl));
  }
  if (pathname === ROUTES.login && session) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/employees/:path*", "/attendance/:path*", "/salary/:path*", "/login"],
};
