import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body.password || "");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu ADMIN_PASSWORD trong biến môi trường.",
        },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Mật khẩu admin không đúng.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Đăng nhập admin thành công.",
    });

    response.cookies.set("long_gs_admin", "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi đăng nhập.",
      },
      { status: 500 }
    );
  }
}