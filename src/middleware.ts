import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/tracking
  if (pathname.startsWith('/admin/tracking')) {
    const session = request.cookies.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect GET /api/analytics
  if (pathname.startsWith('/api/analytics') && request.method === 'GET') {
    const session = request.cookies.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/tracking/:path*', '/api/analytics'],
};
