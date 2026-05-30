import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type OrderRow = {
  id: string;
  name: string;
  phone: string;
  product: string;
  status: "new" | "contacted" | "confirmed" | "cancelled";
  total_price: number;
  quantity: number;
  address: string | null;
  customer_type: "retail" | "dealer";
  created_at: string;
};

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
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
      `
      )
      .order("created_at", { ascending: false });

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

    const orders = (data || []) as OrderRow[];

    const customerMap = new Map<
      string,
      {
        phone: string;
        name: string;
        address: string | null;
        customer_type: "retail" | "dealer";
        total_orders: number;
        confirmed_orders: number;
        cancelled_orders: number;
        total_spent: number;
        last_order_at: string;
        orders: OrderRow[];
      }
    >();

    orders.forEach((order) => {
      const phoneKey = normalizePhone(order.phone);

      if (!phoneKey) return;

      if (!customerMap.has(phoneKey)) {
        customerMap.set(phoneKey, {
          phone: order.phone,
          name: order.name,
          address: order.address,
          customer_type: order.customer_type || "retail",
          total_orders: 0,
          confirmed_orders: 0,
          cancelled_orders: 0,
          total_spent: 0,
          last_order_at: order.created_at,
          orders: [],
        });
      }

      const customer = customerMap.get(phoneKey);

      if (!customer) return;

      customer.orders.push(order);
      customer.total_orders += 1;

      if (order.status === "confirmed") {
        customer.confirmed_orders += 1;
        customer.total_spent += Number(order.total_price || 0);
      }

      if (order.status === "cancelled") {
        customer.cancelled_orders += 1;
      }

      if (new Date(order.created_at) > new Date(customer.last_order_at)) {
        customer.last_order_at = order.created_at;
        customer.name = order.name;
        customer.address = order.address;
        customer.customer_type = order.customer_type || customer.customer_type;
      }
    });

    const customers = Array.from(customerMap.values()).sort(
      (a, b) =>
        new Date(b.last_order_at).getTime() -
        new Date(a.last_order_at).getTime()
    );

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

function normalizePhone(phone: string) {
  return String(phone || "").replace(/\D/g, "");
}