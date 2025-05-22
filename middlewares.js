import { NextResponse } from 'next/server';

export function middleware(request) {
  const authToken = request.cookies.getItem('authToken')?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/register', '/'];

  if (!authToken && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authToken && publicPaths.includes(pathname) && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)',
  ],
};