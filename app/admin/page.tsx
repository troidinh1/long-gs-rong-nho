import AdminHeader from "../../components/admin/AdminHeader";
import OrdersTable from "../../components/admin/OrdersTable";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminHeader />
        <OrdersTable />
      </div>
    </main>
  );
}