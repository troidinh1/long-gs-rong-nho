"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/admin",
    label: "Đơn hàng",
  },
  {
    href: "/admin/products",
    label: "Sản phẩm",
  },
];

export default function AdminTopbar() {
  const pathname = usePathname();

  async function handleLogout() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/admin/login";
  }

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/admin">
          <p className="text-lg font-black text-slate-950">
            LONG <span className="text-emerald-700">GS</span>
          </p>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
            Admin
          </p>
        </Link>

        <button
  type="button"
  onClick={handleLogout}
  className="cursor-pointer rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white"
>
  Đăng xuất
</button>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-black ${
                isActive
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <a
          href="/"
          target="_blank"
          className="whitespace-nowrap rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-600"
        >
          Website
        </a>
      </div>
    </div>
  );
}