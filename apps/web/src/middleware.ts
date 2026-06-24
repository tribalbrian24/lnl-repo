import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Just stamp the cookie if it doesn't exist — no Redis here
  if (!request.cookies.get('session_id')) {
    response.cookies.set('session_id', uuidv4(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  }

  return response;
}


// Only run middleware on relevant routes (API and App routes)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
