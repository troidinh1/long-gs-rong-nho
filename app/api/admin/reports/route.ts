import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type ReportRange = "today" | "7days" | "30days" | "all";

type OrderStatus =
  | "pending"
  | "preparing"
  | "shipping"
  | "completed"
  | "cancelled";

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
  status: OrderStatus;
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

function normalizeRange(value: string | null): ReportRange {
  if (
    value === "today" ||
    value === "7days" ||
    value === "30days" ||
    value === "all"
  ) {
    return value;
  }

  return "7days";
}

function getEmptySummary() {
  return {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    shippingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = normalizeRange(searchParams.get("range"));
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
          message: error.message || "Không thể lấy dữ liệu báo cáo.",
          summary: getEmptySummary(),
          dailyRevenue: [],
          topProducts: [],
          recentOrders: [],
        },
        { status: 500 }
      );
    }

    const orders = (data || []) as OrderWithItems[];

    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    );

    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + Number(order.total_price || 0),
      0
    );

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.status === "pending"
    ).length;

    const preparingOrders = orders.filter(
      (order) => order.status === "preparing"
    ).length;

    const shippingOrders = orders.filter(
      (order) => order.status === "shipping"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.status === "cancelled"
    ).length;

    const averageOrderValue =
      completedOrders.length > 0
        ? Math.round(totalRevenue / completedOrders.length)
        : 0;

    const dailyMap = new Map<
      string,
      {
        date: string;
        revenue: number;
        completedOrders: number;
        totalOrders: number;
      }
    >();

    orders.forEach((order) => {
      const key = formatDateKey(order.created_at);

      if (!dailyMap.has(key)) {
        dailyMap.set(key, {
          date: key,
          revenue: 0,
          completedOrders: 0,
          totalOrders: 0,
        });
      }

      const current = dailyMap.get(key);

      if (!current) return;

      current.totalOrders += 1;

      if (order.status === "completed") {
        current.revenue += Number(order.total_price || 0);
        current.completedOrders += 1;
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

    completedOrders.forEach((order) => {
      const items = order.order_items || [];

      items.forEach((item) => {
        const key = item.product_name || "Sản phẩm";

        if (!productMap.has(key)) {
          productMap.set(key, {
            product_name: key,
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
        pendingOrders,
        preparingOrders,
        shippingOrders,
        completedOrders: completedOrders.length,
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
        summary: getEmptySummary(),
        dailyRevenue: [],
        topProducts: [],
        recentOrders: [],
      },
      { status: 500 }
    );
  }
}