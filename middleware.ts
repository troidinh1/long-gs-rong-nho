import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    const { response } = await updateSession(request);
    return response;
  }

  if (isAdminPage || isAdminApi) {
    const { response, user } = await updateSession(request);

    const adminEmail = process.env.ADMIN_EMAIL;

    if (user && adminEmail && user.email === adminEmail) {
      return response;
    }

    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          message: "Bạn không có quyền truy cập admin.",
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