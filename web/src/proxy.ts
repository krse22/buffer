import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/error'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has('buffer_token');
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

  if (!hasToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
