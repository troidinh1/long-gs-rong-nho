"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateTime, formatVND } from "@/lib/format";
import { Customer } from "@/types/customer";
import OrderStatusBadge from "./OrderStatusBadge";

export default function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expandedPhone, setExpandedPhone] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState<
    "all" | "retail" | "dealer"
  >("all");

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function fetchCustomers() {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("/api/admin/customers", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Không lấy được danh sách khách hàng.");
        return;
      }

      setCustomers(result.customers || []);
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi khi tải danh sách khách hàng.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const dealerCustomers = customers.filter(
      (customer) => customer.customer_type === "dealer",
    ).length;

    const totalRevenue = customers.reduce(
      (sum, customer) => sum + Number(customer.total_spent || 0),
      0,
    );

    const totalConfirmedOrders = customers.reduce(
      (sum, customer) => sum + Number(customer.confirmed_orders || 0),
      0,
    );

    return {
      totalCustomers,
      dealerCustomers,
      retailCustomers: totalCustomers - dealerCustomers,
      totalRevenue,
      totalConfirmedOrders,
    };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesType =
        customerTypeFilter === "all"
          ? true
          : customer.customer_type === customerTypeFilter;

      const matchesKeyword = keyword
        ? [
            customer.name,
            customer.phone,
            customer.address || "",
            customer.customer_type,
            ...customer.orders.map((order) => order.product),
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        : true;

      return matchesType && matchesKeyword;
    });
  }, [customers, customerTypeFilter, searchKeyword]);

  function toggleDetail(phone: string) {
    setExpandedPhone((currentPhone) => (currentPhone === phone ? null : phone));
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Customers
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Quản lý khách hàng
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Danh sách khách được gom tự động theo số điện thoại từ đơn hàng.
              Có thể xem lịch sử mua hàng, tổng số đơn và tổng tiền đã chốt.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchCustomers}
            className="cursor-pointer rounded-2xl bg-slate-950 px-6 py-3 font-black text-white transition hover:bg-emerald-700"
          >
            Tải lại
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Tổng khách"
          value={stats.totalCustomers}
          note="Theo số điện thoại"
          tone="dark"
        />
        <StatCard
          label="Khách lẻ"
          value={stats.retailCustomers}
          note="Retail"
          tone="blue"
        />
        <StatCard
          label="Đại lý"
          value={stats.dealerCustomers}
          note="Dealer"
          tone="green"
        />
        <StatCard
          label="Đơn đã chốt"
          value={stats.totalConfirmedOrders}
          note="Từ tất cả khách"
          tone="amber"
        />
        <StatCard
          label="Doanh thu khách"
          value={formatVND(stats.totalRevenue)}
          note="Tổng đơn đã chốt"
          tone="green"
        />
      </section>

      {message && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-700">
          {message}
        </div>
      )}

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-black">Danh sách khách hàng</h2>
            <p className="mt-1 text-slate-500">
              Khách mua gần nhất sẽ hiển thị lên đầu.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[180px_1fr]">
            <select
              value={customerTypeFilter}
              onChange={(e) =>
                setCustomerTypeFilter(
                  e.target.value as "all" | "retail" | "dealer",
                )
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="all">Tất cả</option>
              <option value="retail">Khách lẻ</option>
              <option value="dealer">Đại lý</option>
            </select>

            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên, SĐT, địa chỉ, sản phẩm..."
              className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center font-bold">
            Đang tải danh sách khách hàng...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center font-bold">
            Không có khách hàng phù hợp.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Khách hàng</th>
                    <th className="px-5 py-4">Loại khách</th>
                    <th className="px-5 py-4">Tổng đơn</th>
                    <th className="px-5 py-4">Đã chốt</th>
                    <th className="px-5 py-4">Tổng chi tiêu</th>
                    <th className="px-5 py-4">Mua gần nhất</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => {
                    const isExpanded = expandedPhone === customer.phone;

                    return (
                      <>
                        <tr
                          key={customer.phone}
                          className="border-b border-slate-100 align-top transition hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <p className="font-black text-slate-950">
                              {customer.name}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              📞 {customer.phone}
                            </p>
                            {customer.address && (
                              <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-500">
                                📍 {customer.address}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <CustomerTypeBadge
                              customerType={customer.customer_type}
                            />
                          </td>

                          <td className="px-5 py-4 font-black text-slate-700">
                            {customer.total_orders}
                          </td>

                          <td className="px-5 py-4 font-black text-emerald-700">
                            {customer.confirmed_orders}
                          </td>

                          <td className="px-5 py-4 font-black text-emerald-700">
                            {formatVND(customer.total_spent || 0)}
                          </td>

                          <td className="px-5 py-4 text-sm font-bold text-slate-600">
                            {formatDateTime(customer.last_order_at)}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => toggleDetail(customer.phone)}
                              className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                            >
                              {isExpanded ? "Ẩn lịch sử" : "Xem lịch sử"}
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="border-b border-slate-100 bg-slate-50">
                            <td colSpan={7} className="px-5 py-5">
                              <CustomerOrderHistory customer={customer} />
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 xl:hidden">
              {filteredCustomers.map((customer) => {
                const isExpanded = expandedPhone === customer.phone;

                return (
                  <article
                    key={customer.phone}
                    className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-slate-950">
                            {customer.name}
                          </h3>
                          <CustomerTypeBadge
                            customerType={customer.customer_type}
                          />
                        </div>

                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          📞 {customer.phone}
                        </p>

                        {customer.address && (
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            📍 {customer.address}
                          </p>
                        )}

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          🕒 Mua gần nhất:{" "}
                          {formatDateTime(customer.last_order_at)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-emerald-50 p-4 text-right">
                        <p className="text-xs font-black uppercase text-emerald-700">
                          Tổng chi tiêu
                        </p>
                        <p className="mt-1 text-xl font-black text-emerald-700">
                          {formatVND(customer.total_spent || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <MiniInfo
                        label="Tổng đơn"
                        value={customer.total_orders}
                      />
                      <MiniInfo
                        label="Đã chốt"
                        value={customer.confirmed_orders}
                      />
                      <MiniInfo
                        label="Đã hủy"
                        value={customer.cancelled_orders}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDetail(customer.phone)}
                      className="mt-4 w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                    >
                      {isExpanded ? "Ẩn lịch sử" : "Xem lịch sử mua hàng"}
                    </button>

                    {isExpanded && <CustomerOrderHistory customer={customer} />}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function CustomerOrderHistory({ customer }: { customer: Customer }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="mb-4">
        <p className="text-sm font-black uppercase tracking-wide text-slate-500">
          Lịch sử mua hàng
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {customer.total_orders} đơn hàng của {customer.name}
        </p>
      </div>

      <div className="grid gap-3">
        {customer.orders.map((order) => (
          <div
            key={order.id}
            className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[1fr_160px_140px]"
          >
            <div>
              <p className="font-black text-slate-950">{order.product}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {formatDateTime(order.created_at)}
              </p>
              {order.address && (
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  📍 {order.address}
                </p>
              )}
            </div>

            <div>
              <OrderStatusBadge status={order.status} />
              <p className="mt-2 text-sm font-bold text-slate-500">
                SL: {order.quantity || 1}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs font-black uppercase text-slate-400">
                Tổng tiền
              </p>
              <p className="mt-1 font-black text-emerald-700">
                {formatVND(order.total_price || 0)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomerTypeBadge({
  customerType,
}: {
  customerType: "retail" | "dealer";
}) {
  if (customerType === "dealer") {
    return (
      <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
        Đại lý
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
      Khách lẻ
    </span>
  );
}

function MiniInfo({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string | number;
  note: string;
  tone: "dark" | "blue" | "amber" | "green";
}) {
  const toneClass = {
    dark: "bg-slate-950 text-white",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-sm font-black text-slate-500">{label}</p>

      <div
        className={`mt-4 inline-flex min-h-12 items-center rounded-2xl px-4 text-2xl font-black ${toneClass}`}
      >
        {value}
      </div>

      <p className="mt-3 text-sm font-bold text-slate-500">{note}</p>
    </div>
  );
}
