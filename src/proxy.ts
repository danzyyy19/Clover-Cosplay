import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16+ uses proxy instead of middleware
export const proxy = createMiddleware(routing);

export const config = {
    matcher: [
        '/',
        '/(en|th)/:path*',
        '/((?!api|_next|_vercel|.*\\..*).*)'
    ]
};
