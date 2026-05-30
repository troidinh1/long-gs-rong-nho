import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Get categories error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể lấy danh mục.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      categories: data,
    });
  } catch (error) {
    console.error("Categories API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi lấy danh mục.",
      },
      { status: 500 }
    );
  }
}