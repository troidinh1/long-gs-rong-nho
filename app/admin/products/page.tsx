import ProductsTable from "@/components/admin/ProductsTable";

export default function AdminProductsPage() {
  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Products
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Quản lý sản phẩm
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Thêm, sửa, xóa, ẩn hiện sản phẩm và upload ảnh sản phẩm lên
              Supabase Storage.
            </p>
          </div>

          <a
            href="/#bang-gia"
            target="_blank"
            className="rounded-2xl bg-emerald-700 px-6 py-3 text-center font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
          >
            Xem bảng giá
          </a>
        </div>
      </section>

      <ProductsTable />
    </div>
  );
}