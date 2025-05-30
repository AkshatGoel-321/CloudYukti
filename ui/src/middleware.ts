import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// List of public routes that don't require authentication
const PUBLIC_PATHS = ["/", "/api/auth", "/api/auth/", "/api/auth/register"];

export async function middleware(req : NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow requests to public paths and static files
  if (
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // Check for valid session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("TOKEN:", token);

  
  // If no token, redirect to home (or login page)
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Match all routes except for static and API routes
export const config = {
  matcher: ["/((?!_next|static|favicon.ico|api/auth).*)"],
};