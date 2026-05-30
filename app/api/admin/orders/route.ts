import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get admin orders error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể lấy danh sách đơn hàng.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: data,
    });
  } catch (error) {
    console.error("Admin orders GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi lấy đơn hàng.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const product = String(body.product || "").trim();
    const note = String(body.note || "").trim();
    const status = String(body.status || "new").trim();

    if (!name || !phone || !product) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng nhập đầy đủ tên, số điện thoại và sản phẩm.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        name,
        phone,
        product,
        note,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error("Create admin order error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể tạo đơn hàng.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tạo đơn hàng thành công.",
      order: data,
    });
  } catch (error) {
    console.error("Admin orders POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi tạo đơn hàng.",
      },
      { status: 500 }
    );
  }
}