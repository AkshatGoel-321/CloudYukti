import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl;
    // const publicRoutes = ['/'];
    const authRoutes = ['/yukti-bot', '/gpurecommender','/requests'];
    const guestOnlyRoutes = ['/sign-in', '/sign-up'];

    if (!token && authRoutes.some(route => url.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    if (token && guestOnlyRoutes.some(route => url.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/yukti-bot',
        '/gpurecommender',
        '/requests',
    ],
};