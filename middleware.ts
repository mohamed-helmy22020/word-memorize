import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
    matcher: [
        // Match root
        "/",

        // Match locale-prefixed paths (e.g., /en/dashboard)
        "/(de|en)/:path*",

        // Match non-API, non-static-asset paths to redirect to a locale
        // Excludes:
        //   - /api/... (API routes)
        //   - /_next/... (Next.js internals)
        //   - /_vercel/... (Vercel internals)
        //   - files with extensions (e.g., .png, .js, etc.)
        "/((?!api|_next|_vercel|.*\\..*).*)",
    ],
};
