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
      weight: String(body.weight || "").trim(),
      price: Number(body.price || 0),
      description: String(body.description || "").trim(),
      image_url: String(
        body.image_url || "/images/product-rong-nho.png"
      ).trim(),
      badge: String(body.badge || "").trim(),
      is_active: Boolean(body.is_active),
      sort_order: Number(body.sort_order || 0),
      category_id: body.category_id ? String(body.category_id) : null,
    };

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu ID sản phẩm.",
        },
        { status: 400 }
      );
    }

    if (!updateData.name || !updateData.weight || !updateData.price) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng nhập tên sản phẩm, khối lượng và giá.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update product error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể cập nhật sản phẩm.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật sản phẩm thành công.",
      product: data,
    });
  } catch (error) {
    console.error("Admin product PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi cập nhật sản phẩm.",
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
          message: "Thiếu ID sản phẩm.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

    if (error) {
      console.error("Delete product error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể xóa sản phẩm.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Xóa sản phẩm thành công.",
    });
  } catch (error) {
    console.error("Admin product DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi xóa sản phẩm.",
      },
      { status: 500 }
    );
  }
}