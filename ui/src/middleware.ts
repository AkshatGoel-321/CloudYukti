/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request,secret: process.env.AUTH_SECRET });
    const url = request.nextUrl;
    const publicRoutes = ['/', '/aboutus','/privacy-compliance',''];
    const authRoutes = ['/admin/cctv-monitor', '/admin/dashboard','/image-analysis'];

    // Routes that should redirect to home if user is already authenticated
    const guestOnlyRoutes = ['/sign-in', '/sign-up'];

    // If the user is not authenticated and trying to access an auth route
    if (!token && authRoutes.some(route => url.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // If the user is authenticated and trying to access guest-only routes
    if (token && guestOnlyRoutes.some(route => url.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // For all other routes, allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/admin/cctv-monitor',
        '/admin/dashboard',
        '/admin/image-analysis',
        '/aboutus',
        '/privacy-compliance',
        '/workforce-safety',
        '/case-studies'
    ],
};