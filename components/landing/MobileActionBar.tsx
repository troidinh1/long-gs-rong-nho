import { zaloLink } from "./data";

export default function MobileActionBar() {
  return (
    <div className="fixed bottom-5 left-4 right-4 z-50 grid grid-cols-[56px_1fr] gap-3 md:hidden">
      <a
        href="#dat-hang"
        className="relative flex h-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xl shadow-slate-900/20"
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
        className="flex h-14 items-center justify-center rounded-2xl bg-emerald-700 px-6 text-center font-black text-white shadow-2xl shadow-emerald-900/30"
      >
        Nhắn Zalo đặt hàng
      </a>
    </div>
  );
}