"use client";

import Image from "next/image";
import { useCart } from "./CartProvider";
import { zaloLink } from "./data";

export default function Header() {
  const { cartCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <a href="#" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-emerald-100">
            <Image
              src="/images/logo-long-gs.png"
              alt="Logo LONG GS"
              fill
              sizes="48px"
              priority
              className="object-contain p-1.5"
            />
          </div>

          <div>
            <p className="text-xl font-black leading-none tracking-tight text-slate-950">
              LONG <span className="text-emerald-700">GS</span>
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Rong nho Nha Trang
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-black text-slate-700 md:flex">
          <a href="#bang-gia" className="transition hover:text-emerald-700">
            Sản phẩm
          </a>
          <a href="#loi-ich" className="transition hover:text-emerald-700">
            Lợi ích
          </a>
          <a href="#dai-ly" className="transition hover:text-emerald-700">
            Đại lý
          </a>
          <a href="#dat-hang" className="transition hover:text-emerald-700">
            Đặt hàng
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50"
            aria-label="Mở giỏ hàng"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-black text-white">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href={zaloLink}
            target="_blank"
            className="hidden rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 md:inline-flex"
          >
            Tư vấn Zalo
          </a>
        </div>
      </div>

      <div className="overflow-hidden border-t border-emerald-100 bg-emerald-950 py-2.5 text-white">
        <div className="marquee flex min-w-max items-center gap-4 whitespace-nowrap text-sm font-bold">
          <span>🌿</span>
          <span>
            LONG GS - Rong nho sạch, xanh giòn, đặc sản biển Nha Trang • Nhận
            khách lẻ, quán ăn và đại lý nhỏ • Giao hàng toàn quốc
          </span>
        </div>
      </div>
    </header>
  );
}
