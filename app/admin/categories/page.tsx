import CategoriesTable from "@/components/admin/CategoriesTable";

export default function AdminCategoriesPage() {
  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Categories
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Quản lý danh mục
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Tạo và quản lý nhóm sản phẩm như rong nho, combo, nước chấm hoặc quà
            tặng.
          </p>
        </div>
      </section>

      <CategoriesTable />
    </div>
  );
}