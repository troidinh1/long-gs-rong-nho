import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const name = String(body.name || "").trim();
    const slugInput = String(body.slug || "").trim();
    const description = String(body.description || "").trim();
    const is_active = Boolean(body.is_active);
    const sort_order = Number(body.sort_order || 0);

    const slug = slugInput ? createSlug(slugInput) : createSlug(name);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu ID danh mục.",
        },
        { status: 400 }
      );
    }

    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng nhập tên danh mục.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update({
        name,
        slug,
        description,
        is_active,
        sort_order,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update category error:", error);

      return NextResponse.json(
        {
          success: false,
          message:
            error.code === "23505"
              ? "Slug danh mục đã tồn tại."
              : "Không thể cập nhật danh mục.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật danh mục thành công.",
      category: data,
    });
  } catch (error) {
    console.error("Admin category PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi cập nhật danh mục.",
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
          message: "Thiếu ID danh mục.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete category error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể xóa danh mục.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Xóa danh mục thành công.",
    });
  } catch (error) {
    console.error("Admin category DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi xóa danh mục.",
      },
      { status: 500 }
    );
  }
}