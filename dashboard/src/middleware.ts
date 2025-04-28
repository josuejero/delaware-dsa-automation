import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Define paths that don't require authentication
  const publicPaths = ['/auth/signin'];
  const isPublicPath = publicPaths.includes(path);
  
  // Get the token
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Redirect unauthenticated users to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  
  // Redirect authenticated users away from login page
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/members/:path*', 
    '/events/:path*', 
    '/settings/:path*',
    '/auth/signin',
  ],
};
