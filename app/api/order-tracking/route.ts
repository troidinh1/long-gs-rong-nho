import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/customerSync";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const phone = String(body.phone || "").trim();
    const orderCode = String(body.order_code || "").trim().toUpperCase();
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone || !orderCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng nhập số điện thoại và mã đơn hàng.",
        },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        order_code,
        name,
        phone,
        product,
        status,
        quantity,
        address,
        customer_type,
        total_price,
        note,
        created_at,
        order_items (
          id,
          product_name,
          product_weight,
          unit_price,
          quantity,
          line_total
        )
      `
      )
      .eq("order_code", orderCode)
      .eq("normalized_phone", normalizedPhone)
      .maybeSingle();

    if (error) {
      console.error("Track order error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể tra cứu đơn hàng.",
        },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại số điện thoại hoặc mã đơn.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order tracking API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi tra cứu đơn hàng.",
      },
      { status: 500 }
    );
  }
}