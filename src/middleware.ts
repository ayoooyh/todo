import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TokenTypes } from "@/types/token";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(TokenTypes.ACCESS_TOKEN);
  const refreshToken = request.cookies.get(TokenTypes.REFRESH_TOKEN);

  const protectedRoutes = ["/"];
  const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);

  if (!accessToken && !refreshToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (
    (accessToken || refreshToken) &&
    request.nextUrl.pathname === "/auth/signin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/signin"],
};
