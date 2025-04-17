import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which routes require authentication
const protectedRoutes = ["/dashboard/dashboard-home"]
// Define which routes should be accessible only to non-authenticated users
const authRoutes = ["/signin"]

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname

  // Get auth token from cookies
  const authToken = request.cookies.get("token")?.value

  const isAuthenticated = !!authToken
  const isProtectedRoute = protectedRoutes.some((route) => currentPath === route || currentPath.startsWith(`${route}/`))
  const isAuthRoute = authRoutes.some((route) => currentPath === route || currentPath.startsWith(`${route}/`))

  // Redirect authenticated users away from login page
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard/dashboard-home", request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const redirectUrl = new URL("/signin", request.url)
    // Add the original URL as a query parameter to redirect after login
    redirectUrl.searchParams.set("from", encodeURIComponent(request.nextUrl.pathname))
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

