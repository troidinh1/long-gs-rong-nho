"use client";

export default function AdminHeader() {
  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    window.location.href = "/admin/login";
  }

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
          LONG GS Admin
        </p>

        <h1 className="mt-2 text-3xl font-black md:text-4xl">
          Quản lý đơn hàng
        </h1>

        <p className="mt-2 text-slate-500">
          CRUD đơn hàng: tạo, xem, sửa trạng thái và xóa đơn hàng.
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-2xl bg-slate-900 px-6 py-3 font-black text-white transition hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}