import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Get products error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể lấy danh sách sản phẩm.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: data,
    });
  } catch (error) {
    console.error("Products API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi lấy sản phẩm.",
      },
      { status: 500 }
    );
  }
}