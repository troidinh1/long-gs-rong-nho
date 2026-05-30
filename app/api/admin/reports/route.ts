import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type ReportRange = "today" | "7days" | "30days" | "all";

type OrderItem = {
  id: string;
  product_name: string;
  product_weight: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

type OrderWithItems = {
  id: string;
  name: string;
  phone: string;
  product: string;
  status: "new" | "contacted" | "confirmed" | "cancelled";
  quantity: number;
  total_price: number;
  created_at: string;
  order_items?: OrderItem[];
};

function getStartDate(range: ReportRange) {
  const now = new Date();

  if (range === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (range === "7days") {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (range === "30days") {
    const start = new Date(now);
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  return null;
}

function formatDateKey(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") || "7days") as ReportRange;
    const startDate = getStartDate(range);

    let query = supabaseAdmin
      .from("orders")
      .select(
        `
        id,
        name,
        phone,
        product,
        status,
        quantity,
        total_price,
        created_at,
        order_items (
          id,
          product_name,
          product_weight,
          unit_price,
          quantity,
          line_total
        )
      `
      )
      .order("created_at", { ascending: false });

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get reports error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Không thể lấy dữ liệu báo cáo.",
        },
        { status: 500 }
      );
    }

    const orders = (data || []) as OrderWithItems[];

    const confirmedOrders = orders.filter(
      (order) => order.status === "confirmed"
    );

    const totalRevenue = confirmedOrders.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0
    );

    const totalOrders = orders.length;
    const newOrders = orders.filter((order) => order.status === "new").length;
    const contactedOrders = orders.filter(
      (order) => order.status === "contacted"
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.status === "cancelled"
    ).length;

    const averageOrderValue =
      confirmedOrders.length > 0
        ? Math.round(totalRevenue / confirmedOrders.length)
        : 0;

    const dailyMap = new Map<
      string,
      {
        date: string;
        revenue: number;
        confirmedOrders: number;
        totalOrders: number;
      }
    >();

    orders.forEach((order) => {
      const key = formatDateKey(order.created_at);

      if (!dailyMap.has(key)) {
        dailyMap.set(key, {
          date: key,
          revenue: 0,
          confirmedOrders: 0,
          totalOrders: 0,
        });
      }

      const current = dailyMap.get(key);

      if (!current) return;

      current.totalOrders += 1;

      if (order.status === "confirmed") {
        current.revenue += Number(order.total_price || 0);
        current.confirmedOrders += 1;
      }
    });

    const dailyRevenue = Array.from(dailyMap.values()).reverse();

    const productMap = new Map<
      string,
      {
        product_name: string;
        quantity: number;
        revenue: number;
      }
    >();

    confirmedOrders.forEach((order) => {
      const items = order.order_items || [];

      items.forEach((item) => {
        const key = item.product_name;

        if (!productMap.has(key)) {
          productMap.set(key, {
            product_name: item.product_name,
            quantity: 0,
            revenue: 0,
          });
        }

        const current = productMap.get(key);

        if (!current) return;

        current.quantity += Number(item.quantity || 0);
        current.revenue += Number(item.line_total || 0);
      });
    });

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    return NextResponse.json({
      success: true,
      range,
      summary: {
        totalRevenue,
        totalOrders,
        newOrders,
        contactedOrders,
        confirmedOrders: confirmedOrders.length,
        cancelledOrders,
        averageOrderValue,
      },
      dailyRevenue,
      topProducts,
      recentOrders: orders.slice(0, 8),
    });
  } catch (error) {
    console.error("Reports API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Có lỗi xảy ra khi tạo báo cáo.",
      },
      { status: 500 }
    );
  }
}