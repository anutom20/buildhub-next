// @/middleware.ts

import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { auth as userAuth } from "./auth";

import { authConfig } from "@/lib/auth.config";
import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  LANDING_PAGE_ROUTE,
} from "@/routes";

export const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;

  // manage route protection
  const isAuth = req.auth;

  const isAccessingApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
  const isAccessingAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAccessingProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAccessingLandingPageRoute = pathname === "/";

  if (isAccessingApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAccessingAuthRoute) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  if (isAuth && isAccessingLandingPageRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuth && isAccessingProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAuth && isAccessingProtectedRoute) {
    const session = await userAuth();
    const headers = new Headers(req.headers);
    headers.set("userId", session?.user?.id!);
    return NextResponse.next({ headers });
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
