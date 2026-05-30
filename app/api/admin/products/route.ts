import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Get admin products error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể lấy danh sách sản phẩm.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: data,
    });
  } catch (error) {
    console.error("Admin products GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi lấy sản phẩm.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const weight = String(body.weight || "").trim();
    const price = Number(body.price || 0);
    const description = String(body.description || "").trim();
    const image_url = String(body.image_url || "/images/product-rong-nho.png").trim();
    const badge = String(body.badge || "").trim();
    const is_active = Boolean(body.is_active);
    const sort_order = Number(body.sort_order || 0);

    if (!name || !weight || !price) {
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
      .insert({
        name,
        weight,
        price,
        description,
        image_url,
        badge,
        is_active,
        sort_order,
      })
      .select()
      .single();

    if (error) {
      console.error("Create product error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể tạo sản phẩm.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tạo sản phẩm thành công.",
      product: data,
    });
  } catch (error) {
    console.error("Admin products POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi tạo sản phẩm.",
      },
      { status: 500 }
    );
  }
}