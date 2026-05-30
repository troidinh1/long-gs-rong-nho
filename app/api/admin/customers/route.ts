import { NextResponse } from "next/server";
import {
  syncAllCustomersFromOrders,
  syncCustomerFromOrder,
} from "@/lib/customerSync";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .select(
        `
        *,
        orders (
          id,
          name,
          phone,
          product,
          status,
          total_price,
          quantity,
          address,
          customer_type,
          created_at
        )
      `
      )
      .order("last_order_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Get customers error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể lấy danh sách khách hàng.",
        },
        { status: 500 }
      );
    }

    const customers = (data || []).map((customer) => ({
      ...customer,
      orders: (customer.orders || []).sort(
        (a: { created_at: string }, b: { created_at: string }) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    }));

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Customers API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi lấy khách hàng.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "sync-all") {
      const result = await syncAllCustomersFromOrders();

      return NextResponse.json({
        success: true,
        message: `Đã đồng bộ ${result.synced} khách hàng từ đơn hàng.`,
        synced: result.synced,
      });
    }

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();
    const customer_type = String(body.customer_type || "retail").trim();

    if (!name || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng nhập tên và số điện thoại.",
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

    return NextResponse.json({
      success: true,
      message: "Đồng bộ khách hàng thành công.",
      customer,
    });
  } catch (error) {
    console.error("Customers POST API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi đồng bộ khách hàng.",
      },
      { status: 500 }
    );
  }
}