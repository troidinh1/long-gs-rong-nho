import Image from "next/image";
import { zaloLink } from "./data";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <a href="#" className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow-md ring-1 ring-emerald-100">
            <Image
              src="/images/logo-long-gs.png"
              alt="Logo LONG GS"
              fill
              sizes="48px"
              priority
              className="object-contain p-1"
            />
          </div>

          <div>
            <p className="text-xl font-black leading-none text-emerald-700">
              LONG GS
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Rong nho Nha Trang
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-10 text-[17px] font-black text-[#071027] md:flex">
          <a href="#bang-gia" className="transition hover:text-emerald-700">
            Bảng giá
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

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#dat-hang"
            className="relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-100 bg-white text-xl shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-50"
            aria-label="Giỏ hàng"
          >
            🛒
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-black text-white">
              3
            </span>
          </a>

          <a
            href={zaloLink}
            target="_blank"
            className="rounded-full bg-emerald-700 px-7 py-3 text-base font-black text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Zalo ngay
          </a>
        </div>
      </div>

      <div className="overflow-hidden bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-600 py-3 text-white">
        <div className="marquee flex min-w-max items-center gap-4 whitespace-nowrap text-sm font-bold md:text-base">
          <span>📢</span>
          <span>
            Rong nho LONG GS - Đặc sản biển Nha Trang, Khánh Hòa • Nhận đơn gia
            đình, quán ăn và đại lý nhỏ • Giao hàng nhanh toàn quốc
          </span>
        </div>
      </div>
    </header>
  );
}