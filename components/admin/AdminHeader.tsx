"use client";

export default function AdminHeader() {
  async function handleLogout() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    await supabase.auth.signOut();

    window.location.href = "/admin/login";
  }

  return (
    <div className="mb-8 flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            LONG GS Admin
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Dashboard quản trị
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Quản lý đơn hàng, sản phẩm, trạng thái và dữ liệu bán hàng của LONG
            GS.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/"
            target="_blank"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center font-black text-slate-700 transition hover:bg-slate-50"
          >
            Xem website
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-slate-900 px-6 py-3 font-black text-white transition hover:bg-red-600"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
        <a
          href="/admin"
          className="rounded-2xl bg-emerald-700 px-5 py-3 text-center font-black text-white transition hover:bg-emerald-800"
        >
          Quản lý đơn hàng
        </a>

        <a
          href="/admin/products"
          className="rounded-2xl bg-slate-900 px-5 py-3 text-center font-black text-white transition hover:bg-slate-700"
        >
          Quản lý sản phẩm
        </a>
      </div>
    </div>
  );
}