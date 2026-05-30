export default function AdminHeader() {
  return (
    <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
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
  );
}