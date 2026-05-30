import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const bucketName = "product-images";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng chọn file ảnh.",
        },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "File tải lên phải là ảnh.",
        },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Ảnh không được vượt quá 5MB.",
        },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split(".").pop() || "png";
    const safeFileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `products/${safeFileName}`;

    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload product image error:", uploadError);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể upload ảnh sản phẩm.",
        },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      message: "Upload ảnh thành công.",
      imageUrl: data.publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error("Upload product image API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi upload ảnh.",
      },
      { status: 500 }
    );
  }
}