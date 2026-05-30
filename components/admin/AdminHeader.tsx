"use client";

export default function AdminHeader() {
  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    window.location.href = "/admin/login";
  }

  return (
    <div className="mb-8 flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
          LONG GS Admin
        </p>

        <h1 className="mt-2 text-3xl font-black md:text-4xl">
          Dashboard đơn hàng
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Quản lý đơn hàng LONG GS: xem đơn mới, lọc trạng thái, tìm kiếm khách,
          cập nhật đơn và theo dõi đơn đã chốt.
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
  );
}