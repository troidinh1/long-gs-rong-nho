import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendOrderEmail } from "@/lib/sendOrderEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const product = String(body.product || "").trim();
    const note = String(body.note || "").trim();
    const address = String(body.address || "").trim();
    const customer_type = String(body.customer_type || "retail").trim();

    const quantity = Math.max(1, Number(body.quantity || 1));
    const total_price = Math.max(0, Number(body.total_price || 0));

    if (!name || !phone || !product) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng nhập đầy đủ họ tên, số điện thoại và sản phẩm.",
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
        status: "new",
        quantity,
        address,
        customer_type,
        total_price,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message || "Không thể lưu đơn hàng.",
        },
        { status: 500 }
      );
    }

    try {
      await sendOrderEmail({
        name,
        phone,
        product,
        note,
        quantity,
        address,
        customer_type,
        total_price,
      });
    } catch (emailError) {
      console.error("Order saved but email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Đặt hàng thành công. LONG GS sẽ liên hệ lại sớm.",
      order: data,
    });
  } catch (error) {
    console.error("API orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra trong API đặt hàng.",
      },
      { status: 500 }
    );
  }
}