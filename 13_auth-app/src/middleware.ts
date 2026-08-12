import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicAuthPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail" ||
    path === "/forgotpassword" ||
    path === "/resetpassword";

  const isProtectedPath = path === "/profile" || path.startsWith("/profile/");

  const token = request.cookies.get("token")?.value || "";

  if (isPublicAuthPath && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/profile",
    "/profile/:path*",
    "/login",
    "/signup",
    "/verifyemail",
    "/forgotpassword",
    "/resetpassword",
  ],
};