import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  // Note: Since we're using localStorage, we can't check it in middleware
  // Client-side protection in ProtectedLayout handles authentication
  // This middleware only handles cookie-based redirects if token exists in cookies
  const token = request.cookies.get('token')?.value;

  // Auth routes (login, register)
  const authRoutes = ['/auth/login', '/auth/register'];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If accessing auth route with token in cookies, redirect to dashboard
  // Note: This only works if token is in cookies. For localStorage, client-side handles it.
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Let protected routes be handled by client-side ProtectedLayout
  // Middleware can't access localStorage, so we skip server-side protection here
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

