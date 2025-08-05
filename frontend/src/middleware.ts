import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import apiEndPoints from "./services/apiEndpoint";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthRoute = pathname.startsWith("/auth");
  const isUserPage = pathname.startsWith("/users");

  if (!token) {
    if (isAuthRoute) {
      return NextResponse.next();
    }

    const signInUrl = new URL(apiEndPoints.SIGN_IN, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isUserPage && token.user?.role !== "super_admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
