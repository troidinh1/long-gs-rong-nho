import Image from "next/image";
import { products } from "./data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#d8fff3_0%,#f5fffc_35%,#ffffff_70%)]">
      <div className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-sky-100 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-emerald-100 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-2 md:items-center md:px-8 md:py-20">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-300 bg-white/80 px-5 py-3 text-sm font-black text-emerald-700 shadow-sm md:text-base">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              🌿
            </span>
            Thực phẩm sạch từ biển Nha Trang - Khánh Hòa
          </div>

          <h1 className="mt-8 max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-[#071027] md:text-7xl">
            Rong nho LONG GS{" "}
            <span className="text-emerald-700">xanh giòn</span>, dễ ăn, dễ bán.
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-9 text-slate-600">
            LONG GS cung cấp rong nho cho khách dùng gia đình, quán ăn và đại lý
            nhỏ. Giao diện đặt hàng nhanh, tư vấn trực tiếp qua Zalo, phù hợp để
            quảng cáo và chốt đơn.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#dat-hang"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-8 py-4 text-base font-black text-white shadow-2xl shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-800"
            >
              🛒 Đặt hàng ngay
            </a>

            <a
              href="#bang-gia"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-400 bg-white/80 px-8 py-4 text-base font-black text-emerald-700 shadow-sm transition hover:-translate-y-1 hover:bg-emerald-50"
            >
              🏷️ Xem bảng giá
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {products.map((item) => (
              <div
                key={item.weight}
                className="rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1"
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
                  {item.icon}
                </div>
                <p className="text-2xl font-black text-emerald-700">
                  {item.weight}
                </p>
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-[2.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-sky-50 p-4 shadow-2xl shadow-emerald-900/10 md:p-6">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white">
              <Image
                src="/images/product-rong-nho.png"
                alt="Rong nho LONG GS"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="absolute bottom-7 left-1/2 w-[88%] -translate-x-1/2 rounded-[1.7rem] border border-emerald-100 bg-white/95 p-4 shadow-2xl shadow-emerald-900/20 backdrop-blur md:w-[380px]">
            <div className="flex items-center justify-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                🛍️
              </div>

              <div>
                <p className="text-lg font-black leading-tight text-[#071027]">
                  Combo bán chạy hôm nay
                </p>
                <p className="mt-1 text-base font-medium text-slate-500">
                  Rong nho 500g chỉ{" "}
                  <span className="font-black text-emerald-700">150.000đ</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}