import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SessionCheckPayload, validateSessionToken } from "./lib/session-token-validator";


export async function middleware(request: NextRequest) {
  const session: SessionCheckPayload = await validateSessionToken(request);
  const currentPath: string = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-pathname", currentPath);

  if (currentPath === "/logout") {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (session.status === "authenticated") {
    if (currentPath === "/login") {
      const status = request.nextUrl.searchParams.get("status");
      if (status == '401') {
        return NextResponse.redirect(new URL(`/dashboard?restricted=true`, request.url));
      } else {
        return NextResponse.redirect(new URL(`/dashboard`, request.url));
      }
    } else {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  } else if (session.status === "expired") {
    return NextResponse.redirect(new URL(`/logout`, request.url));
  } else {
    if (currentPath === "/login") {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } else {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|images|sounds|_next/image|favicon.ico).*)',
  ],
};