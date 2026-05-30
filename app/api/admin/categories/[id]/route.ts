import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Get admin categories error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể lấy danh sách danh mục.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      categories: data,
    });
  } catch (error) {
    console.error("Admin categories GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi lấy danh mục.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const slugInput = String(body.slug || "").trim();
    const description = String(body.description || "").trim();
    const is_active = Boolean(body.is_active);
    const sort_order = Number(body.sort_order || 0);

    const slug = slugInput ? createSlug(slugInput) : createSlug(name);

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
      .insert({
        name,
        slug,
        description,
        is_active,
        sort_order,
      })
      .select()
      .single();

    if (error) {
      console.error("Create category error:", error);

      return NextResponse.json(
        {
          success: false,
          message:
            error.code === "23505"
              ? "Slug danh mục đã tồn tại."
              : "Không thể tạo danh mục.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tạo danh mục thành công.",
      category: data,
    });
  } catch (error) {
    console.error("Admin categories POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi tạo danh mục.",
      },
      { status: 500 }
    );
  }
}