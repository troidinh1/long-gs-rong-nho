"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatDateTime, formatVND } from "@/lib/format";

type TrackingOrderStatus =
  | "pending"
  | "preparing"
  | "shipping"
  | "completed"
  | "cancelled";

type TrackingOrderItem = {
  id: string;
  product_name: string;
  product_weight: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

type TrackingOrder = {
  id: string;
  order_code: string;
  name: string;
  phone: string;
  product: string;
  status: TrackingOrderStatus;
  quantity: number;
  address: string | null;
  customer_type: "retail" | "dealer";
  total_price: number;
  note: string | null;
  created_at: string;
  order_items?: TrackingOrderItem[];
};

const statusText: Record<TrackingOrderStatus, string> = {
  pending: "Chờ xác nhận",
  preparing: "Chờ lấy hàng",
  shipping: "Chờ giao hàng",
  completed: "Đánh giá",
  cancelled: "Đã hủy",
};

const statusDescription: Record<TrackingOrderStatus, string> = {
  pending:
    "LONG GS đã nhận đơn hàng và đang kiểm tra thông tin trước khi xác nhận.",
  preparing:
    "Đơn hàng đã được xác nhận. LONG GS đang chuẩn bị sản phẩm để giao.",
  shipping:
    "Đơn hàng đang trong quá trình giao đến khách. Vui lòng chú ý điện thoại.",
  completed:
    "Đơn hàng đã hoàn tất. Cảm ơn bạn đã tin tưởng và mua hàng tại LONG GS.",
  cancelled:
    "Đơn hàng đã bị hủy. Nếu cần hỗ trợ đặt lại, vui lòng liên hệ LONG GS.",
};

const trackingSteps: {
  key: Exclude<TrackingOrderStatus, "cancelled">;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    key: "pending",
    label: "Chờ xác nhận",
    description: "LONG GS đã tiếp nhận đơn hàng của bạn.",
    icon: "📝",
  },
  {
    key: "preparing",
    label: "Chờ lấy hàng",
    description: "Đơn đã được xác nhận và đang chuẩn bị.",
    icon: "📦",
  },
  {
    key: "shipping",
    label: "Chờ giao hàng",
    description: "Đơn đang được giao đến địa chỉ của bạn.",
    icon: "🚚",
  },
  {
    key: "completed",
    label: "Đánh giá",
    description: "Đơn đã hoàn tất. Bạn có thể đánh giá sản phẩm.",
    icon: "⭐",
  },
];

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();

  const [phone, setPhone] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const phoneFromUrl = searchParams.get("phone") || "";
    const orderCodeFromUrl = searchParams.get("order_code") || "";

    if (phoneFromUrl) setPhone(phoneFromUrl);
    if (orderCodeFromUrl) setOrderCode(orderCodeFromUrl.toUpperCase());

    if (phoneFromUrl && orderCodeFromUrl) {
      trackOrder(phoneFromUrl, orderCodeFromUrl.toUpperCase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function trackOrder(inputPhone = phone, inputOrderCode = orderCode) {
    setIsLoading(true);
    setMessage("");
    setOrder(null);

    try {
      const response = await fetch("/api/order-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: inputPhone,
          order_code: inputOrderCode,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Không tìm thấy đơn hàng.");
        return;
      }

      setOrder(result.order);
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi tra cứu đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleTrackOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await trackOrder(phone, orderCode);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f0fdf4_100%)] px-4 py-10 text-slate-950 md:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <a href="/" className="inline-flex items-center gap-3 font-black">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
              GS
            </span>
            <span>
              LONG <span className="text-emerald-700">GS</span>
            </span>
          </a>

          <a
            href="/"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
          >
            Quay lại trang chủ
          </a>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="rounded-[2.5rem] border border-emerald-100 bg-white p-6 shadow-2xl shadow-emerald-950/10 md:p-8">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
              Tra cứu đơn hàng
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Theo dõi đơn hàng LONG GS
            </h1>

            <p className="mt-4 leading-8 text-slate-600">
              Nhập số điện thoại và mã đơn hàng để xem trạng thái xử lý đơn. Mã
              đơn được hiển thị sau khi đặt hàng thành công.
            </p>

            <form onSubmit={handleTrackOrder} className="mt-8 grid gap-4">
              <div>
                <label className="mb-2 block font-black">
                  Số điện thoại đặt hàng
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Ví dụ: 0896456068"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-black">Mã đơn hàng</label>
                <input
                  value={orderCode}
                  onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
                  required
                  placeholder="Ví dụ: LGS1234ABCD"
                  className="w-full rounded-2xl border border-slate-200 px-5 py-4 font-semibold uppercase outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer rounded-2xl bg-emerald-700 px-6 py-4 font-black text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Đang tra cứu..." : "Tra cứu đơn hàng"}
              </button>
            </form>

            {message && (
              <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-black text-red-700">
                {message}
              </div>
            )}

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-500">
              <p className="font-black text-slate-700">Lưu ý:</p>
              <p className="mt-1">
                Nếu bạn quên mã đơn, hãy nhắn Zalo LONG GS và cung cấp số điện
                thoại đặt hàng để được hỗ trợ.
              </p>
            </div>
          </div>

          <div>
            {!order ? (
              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-4xl">
                  📦
                </div>

                <h2 className="mt-5 text-2xl font-black">
                  Thông tin đơn hàng sẽ hiển thị tại đây
                </h2>

                <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
                  Sau khi tra cứu thành công, bạn sẽ thấy trạng thái, tiến trình
                  xử lý, sản phẩm và tổng tiền của đơn hàng.
                </p>
              </div>
            ) : (
              <OrderTrackingResult order={order} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function OrderTrackingResult({ order }: { order: TrackingOrder }) {
  return (
    <div className="grid gap-5">
      <section className="rounded-[2.5rem] border border-emerald-100 bg-white p-6 shadow-xl shadow-slate-950/5 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Mã đơn: {order.order_code}
            </p>

            <h2 className="mt-3 text-3xl font-black">
              {statusText[order.status]}
            </h2>

            <p className="mt-2 leading-7 text-slate-500">
              {statusDescription[order.status]}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-right">
            <p className="text-xs font-black uppercase text-emerald-700">
              Tổng tiền
            </p>
            <p className="mt-1 text-2xl font-black text-emerald-700">
              {formatVND(order.total_price || 0)}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-500">
          <p>👤 Khách hàng: {order.name}</p>
          <p>📞 Số điện thoại: {order.phone}</p>
          <p>🕒 Ngày đặt: {formatDateTime(order.created_at)}</p>
          {order.address && <p>📍 Địa chỉ: {order.address}</p>}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Tiến trình đơn hàng</h3>
            <p className="mt-1 text-sm text-slate-500">
              Cập nhật theo trạng thái xử lý của LONG GS.
            </p>
          </div>

          <span
            className={`inline-flex rounded-full px-4 py-2 text-sm font-black ${
              order.status === "cancelled"
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {statusText[order.status]}
          </span>
        </div>

        {order.status === "cancelled" ? (
          <div className="mt-6 rounded-2xl bg-red-50 p-5 font-bold text-red-700">
            Đơn hàng này đã bị hủy. Vui lòng liên hệ LONG GS nếu bạn cần đặt lại
            hoặc cần hỗ trợ thêm.
          </div>
        ) : (
          <ShopeeTimeline status={order.status} />
        )}
      </section>

      <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <h3 className="text-2xl font-black">Sản phẩm trong đơn</h3>

        <div className="mt-5 grid gap-3">
          {order.order_items && order.order_items.length > 0 ? (
            order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-black text-slate-950">
                    {item.product_name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {item.product_weight || "Sản phẩm"} ·{" "}
                    {formatVND(item.unit_price)} x {item.quantity}
                  </p>
                </div>

                <p className="font-black text-emerald-700">
                  {formatVND(item.line_total)}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 font-semibold text-slate-600">
              {order.product}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-emerald-100 bg-emerald-50 p-6 md:p-8">
        <h3 className="text-xl font-black text-slate-950">
          Cần hỗ trợ đơn hàng?
        </h3>

        <p className="mt-2 leading-7 text-slate-600">
          Nếu bạn muốn thay đổi thông tin giao hàng hoặc cần tư vấn thêm, hãy
          liên hệ LONG GS qua Zalo để được hỗ trợ nhanh.
        </p>

        <a
          href="https://zalo.me/0896456068"
          target="_blank"
          className="mt-5 inline-flex rounded-2xl bg-emerald-700 px-6 py-3 font-black text-white transition hover:bg-emerald-800"
        >
          Nhắn Zalo LONG GS
        </a>
      </section>
    </div>
  );
}

function ShopeeTimeline({ status }: { status: TrackingOrderStatus }) {
  const currentIndex = getStepIndex(status);

  return (
    <div className="mt-8">
      <div className="hidden md:block">
        <div className="relative grid grid-cols-4 gap-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-8 h-1 rounded-full bg-slate-100" />

          <div
            className="absolute left-[12.5%] top-8 h-1 rounded-full bg-emerald-600 transition-all"
            style={{
              width: `${getProgressWidth(currentIndex)}%`,
            }}
          />

          {trackingSteps.map((step, index) => {
            const isDone = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.key} className="relative z-10 text-center">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 text-2xl shadow-sm ${
                    isDone
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-100 bg-white text-slate-400"
                  }`}
                >
                  {isDone ? "✓" : step.icon}
                </div>

                <h4
                  className={`mt-4 font-black ${
                    isCurrent || isDone ? "text-slate-950" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </h4>

                <p
                  className={`mx-auto mt-2 max-w-[180px] text-sm leading-6 ${
                    isCurrent || isDone ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {step.description}
                </p>

                {isCurrent && (
                  <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    Đang xử lý
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {trackingSteps.map((step, index) => {
          const isDone = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.key}
              className={`rounded-2xl border p-5 ${
                isDone
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl font-black ${
                    isDone
                      ? "bg-emerald-700 text-white"
                      : "bg-white text-slate-400"
                  }`}
                >
                  {isDone ? "✓" : index + 1}
                </div>

                <div>
                  <p className="font-black text-slate-950">{step.label}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {step.description}
                  </p>

                  {isCurrent && (
                    <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700">
                      Đang xử lý
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getStepIndex(status: TrackingOrderStatus) {
  if (status === "pending") return 0;
  if (status === "preparing") return 1;
  if (status === "shipping") return 2;
  if (status === "completed") return 3;

  return 0;
}

function getProgressWidth(index: number) {
  if (index <= 0) return 0;
  if (index === 1) return 25;
  if (index === 2) return 50;
  return 75;
}
