import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken");

    // If there is no access token, do not allow access to protected pages
    if (
        request.nextUrl.pathname.startsWith("/file") ||
        request.nextUrl.pathname.startsWith("/folder") ||
        request.nextUrl.pathname.startsWith("/home") ||
        request.nextUrl.pathname.startsWith("/profile")
    ) {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.nextUrl));
        }
    }
}
