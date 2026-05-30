"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/admin",
    label: "Đơn hàng",
    icon: "📦",
  },
  {
    href: "/admin/products",
    label: "Sản phẩm",
    icon: "🛍️",
  },
 {
  href: "/admin/categories",
  label: "Danh mục",
  icon: "🏷️",
},
  {
    href: "/admin/customers",
    label: "Khách hàng",
    icon: "👥",
    disabled: true,
  },
  {
    href: "/admin/reports",
    label: "Báo cáo",
    icon: "📊",
    disabled: true,
  },
  {
    href: "/admin/settings",
    label: "Cài đặt",
    icon: "⚙️",
    disabled: true,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  async function handleLogout() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/admin/login";
  }

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:flex-col">
      <div className="border-b border-slate-100 p-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-xl font-black text-white shadow-lg shadow-emerald-900/20">
            GS
          </div>

          <div>
            <p className="text-xl font-black leading-none text-slate-950">
              LONG GS
            </p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex cursor-not-allowed items-center justify-between rounded-2xl px-4 py-3 text-sm font-black text-slate-300"
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </span>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-400">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                isActive
                  ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <a
          href="/"
          target="_blank"
          className="mb-3 flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          Xem website
        </a>

      <button
  type="button"
  onClick={handleLogout}
  className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-red-600"
>
  Đăng xuất
</button>
      </div>
    </aside>
  );
}