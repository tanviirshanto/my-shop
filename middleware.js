import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = ["/signin"].includes(path);

  // Get the token from cookies (Handles both development and production)
  const token =
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  // If user is authenticated and trying to access a public path, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // If user is not authenticated and trying to access a private path, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }

  return NextResponse.next();
}

// Apply middleware to all paths except Next.js internal files and API routes
export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
