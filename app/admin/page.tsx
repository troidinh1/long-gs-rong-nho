import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminPage() {
  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Quản lý đơn hàng
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Theo dõi đơn mới, cập nhật trạng thái, tìm kiếm khách hàng và xem
              doanh thu đơn đã chốt.
            </p>
          </div>

          <a
            href="/#dat-hang"
            target="_blank"
            className="rounded-2xl bg-emerald-700 px-6 py-3 text-center font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
          >
            Xem form đặt hàng
          </a>
        </div>
      </section>

      <OrdersTable />
    </div>
  );
}