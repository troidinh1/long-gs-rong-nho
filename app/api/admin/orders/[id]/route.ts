import { NextResponse } from "next/server";
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

    const updateData = {
      name: String(body.name || "").trim(),
      phone: String(body.phone || "").trim(),
      product: String(body.product || "").trim(),
      note: String(body.note || "").trim(),
      status: String(body.status || "new").trim(),

      quantity: Math.max(1, Number(body.quantity || 1)),
      address: String(body.address || "").trim(),
      customer_type: String(body.customer_type || "retail").trim(),
      total_price: Math.max(0, Number(body.total_price || 0)),
    };

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu ID đơn hàng.",
        },
        { status: 400 }
      );
    }

    if (!updateData.name || !updateData.phone || !updateData.product) {
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
      .update(updateData)
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