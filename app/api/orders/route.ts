import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendOrderEmail } from "@/lib/sendOrderEmail";

type OrderItemInput = {
  product_id?: string | null;
  product_name?: string;
  product_weight?: string;
  unit_price?: number;
  quantity?: number;
  line_total?: number;
};

function isUuid(value: string | null | undefined) {
  if (!value) return false;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const product = String(body.product || "").trim();
    const note = String(body.note || "").trim();
    const status = String(body.status || "new").trim();
    const quantity = Number(body.quantity || 1);
    const address = String(body.address || "").trim();
    const customer_type = String(body.customer_type || "retail").trim();
    const total_price = Number(body.total_price || 0);
    const items: OrderItemInput[] = Array.isArray(body.items) ? body.items : [];

    if (!name || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng nhập tên và số điện thoại.",
        },
        { status: 400 }
      );
    }

    if (!product && items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng chọn sản phẩm.",
        },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
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
      })
      .select()
      .single();

    if (orderError) {
      console.error("Create order error:", orderError);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể tạo đơn hàng.",
        },
        { status: 500 }
      );
    }

    if (items.length > 0) {
      const orderItems = items.map((item) => {
        const unitPrice = Number(item.unit_price || 0);
        const itemQuantity = Number(item.quantity || 1);
        const lineTotal = Number(item.line_total || unitPrice * itemQuantity);
        const productId = String(item.product_id || "");

        return {
          order_id: order.id,
          product_id: isUuid(productId) ? productId : null,
          product_name: String(item.product_name || "Sản phẩm").trim(),
          product_weight: String(item.product_weight || "").trim(),
          unit_price: unitPrice,
          quantity: itemQuantity,
          line_total: lineTotal,
        };
      });

      const { error: orderItemsError } = await supabaseAdmin
        .from("order_items")
        .insert(orderItems);

      if (orderItemsError) {
        console.error("Create order items error:", orderItemsError);

        return NextResponse.json(
          {
            success: false,
            message:
              "Đơn hàng đã tạo nhưng không thể lưu chi tiết sản phẩm. Vui lòng kiểm tra bảng order_items.",
          },
          { status: 500 }
        );
      }
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
      console.error("Send order email error:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Đặt hàng thành công.",
      order,
    });
  } catch (error) {
    console.error("Orders API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi gửi đơn hàng.",
      },
      { status: 500 }
    );
  }
}