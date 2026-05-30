import { NextResponse } from "next/server";
import { normalizePhone, syncCustomerFromOrder } from "@/lib/customerSync";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          order_id,
          product_id,
          product_name,
          product_weight,
          unit_price,
          quantity,
          line_total,
          created_at
        )
      `
      )
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

    const orders = (data || []).map((order) => ({
      ...order,
      order_items: (order.order_items || []).sort(
        (a: { created_at: string }, b: { created_at: string }) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    }));

    return NextResponse.json({
      success: true,
      orders,
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
    const status = String(body.status || "pending").trim();
    const quantity = Number(body.quantity || 1);
    const address = String(body.address || "").trim();
    const customer_type = String(body.customer_type || "retail").trim();
    const total_price = Number(body.total_price || 0);
    const normalized_phone = normalizePhone(phone);

    if (!name || !phone || !product) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng nhập tên, số điện thoại và sản phẩm.",
        },
        { status: 400 }
      );
    }

    const customer = await syncCustomerFromOrder({
      name,
      phone,
      address,
      customer_type,
    });

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        name,
        phone,
        product,
        note,
        status,
        quantity,
        address,
        customer_type,
        total_price,
        customer_id: customer?.id || null,
        normalized_phone,
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

    await syncCustomerFromOrder({
      name,
      phone,
      address,
      customer_type,
    });

    return NextResponse.json({
      success: true,
      message: "Tạo đơn hàng thành công.",
      order,
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