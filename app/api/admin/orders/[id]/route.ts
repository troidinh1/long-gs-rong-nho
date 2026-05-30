import { NextResponse } from "next/server";
import {
  normalizePhone,
  recalculateCustomerStats,
  syncCustomerFromOrder,
} from "@/lib/customerSync";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu ID đơn hàng.",
        },
        { status: 400 }
      );
    }

    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("normalized_phone")
      .eq("id", id)
      .maybeSingle();

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const product = String(body.product || "").trim();
    const note = String(body.note || "").trim();
    const status = String(body.status || "new").trim();
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

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
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
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update order error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể cập nhật đơn hàng.",
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

    const oldNormalizedPhone = existingOrder?.normalized_phone;

    if (oldNormalizedPhone && oldNormalizedPhone !== normalized_phone) {
      await recalculateCustomerStats(oldNormalizedPhone);
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật đơn hàng thành công.",
      order: data,
    });
  } catch (error) {
    console.error("Admin order PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi cập nhật đơn hàng.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu ID đơn hàng.",
        },
        { status: 400 }
      );
    }

    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("normalized_phone")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabaseAdmin.from("orders").delete().eq("id", id);

    if (error) {
      console.error("Delete order error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể xóa đơn hàng.",
        },
        { status: 500 }
      );
    }

    if (existingOrder?.normalized_phone) {
      await recalculateCustomerStats(existingOrder.normalized_phone);
    }

    return NextResponse.json({
      success: true,
      message: "Xóa đơn hàng thành công.",
    });
  } catch (error) {
    console.error("Admin order DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi xóa đơn hàng.",
      },
      { status: 500 }
    );
  }
}