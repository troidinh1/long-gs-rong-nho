import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  if (isAdminPage || isAdminApi) {
    const adminCookie = request.cookies.get("long_gs_admin")?.value;

    if (adminCookie === "authenticated") {
      return NextResponse.next();
    }

    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          message: "Bạn chưa đăng nhập admin.",
        },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};