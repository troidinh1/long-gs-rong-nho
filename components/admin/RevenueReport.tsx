"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateTime, formatVND } from "@/lib/format";
import OrderStatusBadge from "./OrderStatusBadge";

type ReportRange = "today" | "7days" | "30days" | "all";

type OrderStatus =
  | "pending"
  | "preparing"
  | "shipping"
  | "completed"
  | "cancelled";

type ReportSummary = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  shippingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
};

type DailyRevenue = {
  date: string;
  revenue: number;
  completedOrders: number;
  totalOrders: number;
};

type TopProduct = {
  product_name: string;
  quantity: number;
  revenue: number;
};

type RecentOrder = {
  id: string;
  name: string;
  phone: string;
  product: string;
  status: OrderStatus;
  quantity: number;
  total_price: number;
  created_at: string;
};

type ReportData = {
  summary: ReportSummary;
  dailyRevenue: DailyRevenue[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
};

const rangeOptions: { value: ReportRange; label: string }[] = [
  {
    value: "today",
    label: "Hôm nay",
  },
  {
    value: "7days",
    label: "7 ngày",
  },
  {
    value: "30days",
    label: "30 ngày",
  },
  {
    value: "all",
    label: "Tất cả",
  },
];

const emptyReport: ReportData = {
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    shippingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    averageOrderValue: 0,
  },
  dailyRevenue: [],
  topProducts: [],
  recentOrders: [],
};

export default function RevenueReport() {
  const [range, setRange] = useState<ReportRange>("7days");
  const [report, setReport] = useState<ReportData>(emptyReport);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchReport(selectedRange = range) {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch(
        `/api/admin/reports?range=${selectedRange}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const text = await response.text();

      let result;

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        result = {
          success: false,
          message: "API báo cáo không trả về JSON hợp lệ.",
        };
      }

      if (!response.ok || !result.success) {
        setMessage(result.message || "Không lấy được báo cáo.");
        setReport(emptyReport);
        return;
      }

      setReport({
        summary: result.summary || emptyReport.summary,
        dailyRevenue: result.dailyRevenue || [],
        topProducts: result.topProducts || [],
        recentOrders: result.recentOrders || [],
      });
    } catch {
      setMessage(
        "Không kết nối được API báo cáo. Hãy kiểm tra route /api/admin/reports và terminal.",
      );
      setReport(emptyReport);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchReport(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const maxDailyRevenue = useMemo(() => {
    return Math.max(...report.dailyRevenue.map((item) => item.revenue), 1);
  }, [report.dailyRevenue]);

  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Reports
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Báo cáo doanh thu
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Theo dõi doanh thu đơn hoàn tất, số đơn theo từng trạng thái, sản
              phẩm bán chạy và hiệu quả bán hàng cơ bản.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as ReportRange)}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              {rangeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => fetchReport(range)}
              className="cursor-pointer rounded-2xl bg-slate-950 px-6 py-3 font-black text-white transition hover:bg-emerald-700"
            >
              Tải lại
            </button>
          </div>
        </div>
      </section>

      {message && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-700">
          {message}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-3xl bg-slate-100"
            />
          ))}
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ReportCard
              label="Doanh thu hoàn tất"
              value={formatVND(report.summary.totalRevenue)}
              note="Chỉ tính đơn ở bước Đánh giá"
              tone="green"
            />
            <ReportCard
              label="Tổng đơn"
              value={report.summary.totalOrders}
              note="Tất cả trạng thái"
              tone="dark"
            />
            <ReportCard
              label="Đơn hoàn tất"
              value={report.summary.completedOrders}
              note="Đơn ở bước Đánh giá"
              tone="blue"
            />
            <ReportCard
              label="Giá trị TB / đơn"
              value={formatVND(report.summary.averageOrderValue)}
              note="Trung bình đơn hoàn tất"
              tone="amber"
            />
          </section>

          <section className="grid gap-4 md:grid-cols-5">
            <MiniCard
              label="Chờ xác nhận"
              value={report.summary.pendingOrders}
              color="text-blue-700 bg-blue-50"
            />
            <MiniCard
              label="Chờ lấy hàng"
              value={report.summary.preparingOrders}
              color="text-amber-700 bg-amber-50"
            />
            <MiniCard
              label="Chờ giao hàng"
              value={report.summary.shippingOrders}
              color="text-purple-700 bg-purple-50"
            />
            <MiniCard
              label="Đánh giá"
              value={report.summary.completedOrders}
              color="text-emerald-700 bg-emerald-50"
            />
            <MiniCard
              label="Đã hủy"
              value={report.summary.cancelledOrders}
              color="text-red-700 bg-red-50"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Doanh thu theo ngày
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Chỉ tính doanh thu từ đơn đã hoàn tất ở bước Đánh giá.
                  </p>
                </div>
              </div>

              {report.dailyRevenue.length === 0 ? (
                <EmptyState text="Chưa có dữ liệu doanh thu trong khoảng này." />
              ) : (
                <div className="grid gap-4">
                  {report.dailyRevenue.map((item) => {
                    const width = Math.max(
                      8,
                      Math.round((item.revenue / maxDailyRevenue) * 100),
                    );

                    return (
                      <div key={item.date} className="grid gap-2">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-black text-slate-700">
                            {item.date}
                          </span>
                          <span className="font-black text-emerald-700">
                            {formatVND(item.revenue)}
                          </span>
                        </div>

                        <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-600"
                            style={{ width: `${width}%` }}
                          />
                        </div>

                        <p className="text-xs font-bold text-slate-400">
                          {item.completedOrders} đơn hoàn tất /{" "}
                          {item.totalOrders} tổng đơn
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Sản phẩm bán chạy
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Tính theo đơn đã hoàn tất và bảng order_items.
              </p>

              <div className="mt-6 grid gap-3">
                {report.topProducts.length === 0 ? (
                  <EmptyState text="Chưa có sản phẩm bán chạy." />
                ) : (
                  report.topProducts.map((item, index) => (
                    <div
                      key={item.product_name}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase text-emerald-700">
                            Top {index + 1}
                          </p>
                          <h3 className="mt-1 font-black text-slate-950">
                            {item.product_name}
                          </h3>
                          <p className="mt-1 text-sm font-bold text-slate-500">
                            Đã bán: {item.quantity} sản phẩm
                          </p>
                        </div>

                        <p className="text-right font-black text-emerald-700">
                          {formatVND(item.revenue)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Đơn gần đây
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Danh sách 8 đơn mới nhất trong khoảng đang lọc.
                </p>
              </div>
            </div>

            {report.recentOrders.length === 0 ? (
              <EmptyState text="Chưa có đơn hàng nào." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Khách</th>
                      <th className="px-4 py-3">Ngày đặt</th>
                      <th className="px-4 py-3">Sản phẩm</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="px-4 py-3 text-right">Tổng tiền</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <p className="font-black text-slate-950">
                            {order.name}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {order.phone}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-sm font-bold text-slate-600">
                          {formatDateTime(order.created_at)}
                        </td>

                        <td className="max-w-[360px] truncate px-4 py-4 text-sm font-bold text-slate-600">
                          {order.product}
                        </td>

                        <td className="px-4 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>

                        <td className="px-4 py-4 text-right font-black text-emerald-700">
                          {formatVND(order.total_price || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ReportCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string | number;
  note: string;
  tone: "green" | "dark" | "blue" | "amber";
}) {
  const toneClass = {
    green: "bg-emerald-50 text-emerald-700",
    dark: "bg-slate-950 text-white",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
  }[tone];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-black text-slate-500">{label}</p>

      <div
        className={`mt-4 inline-flex min-h-12 items-center rounded-2xl px-4 text-2xl font-black ${toneClass}`}
      >
        {value}
      </div>

      <p className="mt-3 text-sm font-bold text-slate-500">{note}</p>
    </div>
  );
}

function MiniCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-sm">
      <p className="font-black text-slate-700">{label}</p>

      <div
        className={`flex h-12 min-w-12 items-center justify-center rounded-2xl px-4 text-xl font-black ${color}`}
      >
        {value}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-8 text-center font-bold text-slate-500">
      {text}
    </div>
  );
}
