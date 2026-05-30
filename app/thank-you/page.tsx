"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouLoading />}>
      <ThankYouContent />
    </Suspense>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const orderCode = searchParams.get("order_code") || "";
  const phone = searchParams.get("phone") || "";

  async function copyOrderCode() {
    if (!orderCode) return;

    try {
      await navigator.clipboard.writeText(orderCode);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  const trackingUrl =
    orderCode && phone
      ? `/tra-cuu-don-hang?order_code=${orderCode}&phone=${phone}`
      : "/tra-cuu-don-hang";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f0fdf4_100%)] px-4 py-10 text-slate-950 md:px-8">
      <section className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <div className="w-full rounded-[2.5rem] border border-emerald-100 bg-white p-6 text-center shadow-2xl shadow-emerald-950/10 md:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-700 text-4xl text-white shadow-xl shadow-emerald-900/20">
            ✓
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
            Đặt hàng thành công
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Cảm ơn bạn đã đặt hàng tại LONG GS
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
            LONG GS đã nhận được thông tin đơn hàng. Chúng tôi sẽ liên hệ lại để
            xác nhận và tư vấn trước khi giao hàng.
          </p>

          {orderCode ? (
            <div className="mx-auto mt-8 max-w-xl rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5 text-left">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
                Mã đơn hàng của bạn
              </p>

              <div className="mt-3 flex flex-col gap-3 rounded-2xl bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-950">
                    {orderCode}
                  </p>

                  {phone && (
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      Số điện thoại: {phone}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={copyOrderCode}
                  className="cursor-pointer rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                >
                  {copied ? "Đã copy" : "Copy mã"}
                </button>
              </div>

              <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
                Bạn hãy lưu lại mã đơn này để tra cứu trạng thái đơn hàng sau.
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-xl rounded-[2rem] bg-amber-50 p-5 text-left text-sm font-bold text-amber-800">
              Không tìm thấy mã đơn trong đường dẫn. Bạn vẫn có thể liên hệ Zalo
              LONG GS để được hỗ trợ tra cứu đơn.
            </div>
          )}

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <a
              href="/"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-700 transition hover:bg-slate-50"
            >
              Về trang chủ
            </a>

            <a
              href={trackingUrl}
              className="rounded-2xl bg-emerald-700 px-6 py-4 font-black text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-800"
            >
              Theo dõi đơn hàng
            </a>

            <a
              href="https://zalo.me/0896456068"
              target="_blank"
              className="rounded-2xl bg-slate-950 px-6 py-4 font-black text-white transition hover:bg-emerald-700"
            >
              Nhắn Zalo
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ThankYouLoading() {
  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto mt-20 max-w-xl rounded-3xl bg-slate-100 p-10 text-center font-bold text-slate-500">
        Đang tải thông tin đơn hàng...
      </div>
    </main>
  );
}
