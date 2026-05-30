"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Order, OrderFormData, OrderStatus } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";

const emptyForm: OrderFormData = {
  name: "",
  phone: "",
  product: "Rong nho 500g - 150.000đ",
  note: "",
  status: "new",
};

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "new", label: "Đơn mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "confirmed", label: "Đã chốt" },
  { value: "cancelled", label: "Đã hủy" },
];

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function normalizeText(text: string) {
  return text.toLowerCase().trim();
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<OrderFormData>(emptyForm);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchOrders() {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("/api/admin/orders");
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không lấy được đơn hàng.");
        return;
      }

      setOrders(result.orders || []);
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi khi tải danh sách đơn hàng.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const newOrders = orders.filter((order) => order.status === "new").length;
    const contacted = orders.filter(
      (order) => order.status === "contacted"
    ).length;
    const confirmed = orders.filter(
      (order) => order.status === "confirmed"
    ).length;
    const cancelled = orders.filter(
      (order) => order.status === "cancelled"
    ).length;

    return {
      total,
      newOrders,
      contacted,
      confirmed,
      cancelled,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const keyword = normalizeText(searchValue);

    return orders.filter((order) => {
      const matchStatus =
        statusFilter === "all" ? true : order.status === statusFilter;

      const searchSource = normalizeText(
        `${order.name} ${order.phone} ${order.product} ${order.note || ""}`
      );

      const matchSearch = keyword ? searchSource.includes(keyword) : true;

      return matchStatus && matchSearch;
    });
  }, [orders, searchValue, statusFilter]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function startCreate() {
    setEditingOrderId(null);
    setFormData(emptyForm);
    setMessage("");
  }

  function startEdit(order: Order) {
    setEditingOrderId(order.id);
    setFormData({
      name: order.name,
      phone: order.phone,
      product: order.product,
      note: order.note || "",
      status: order.status,
    });
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetFilters() {
    setSearchValue("");
    setStatusFilter("all");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSaving(true);
    setMessage("");

    try {
      const isEditMode = Boolean(editingOrderId);

      const url = isEditMode
        ? `/api/admin/orders/${editingOrderId}`
        : "/api/admin/orders";

      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Lưu đơn hàng thất bại.");
        return;
      }

      setMessage(
        isEditMode
          ? "Cập nhật đơn hàng thành công."
          : "Tạo đơn hàng thành công."
      );

      setEditingOrderId(null);
      setFormData(emptyForm);
      await fetchOrders();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi lưu đơn hàng.");
    } finally {
      setIsSaving(false);
    }
  }

  async function updateStatus(order: Order, status: OrderStatus) {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: order.name,
          phone: order.phone,
          product: order.product,
          note: order.note || "",
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không thể đổi trạng thái.");
        return;
      }

      setMessage("Đổi trạng thái thành công.");
      await fetchOrders();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi đổi trạng thái.");
    }
  }

  async function deleteOrder(orderId: string) {
    const isConfirmed = window.confirm(
      "Bạn có chắc muốn xóa đơn hàng này không?"
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không thể xóa đơn hàng.");
        return;
      }

      setMessage("Xóa đơn hàng thành công.");
      await fetchOrders();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi xóa đơn hàng.");
    }
  }

  return (
    <div className="grid gap-8">
      {/* STATS */}
      <section className="grid gap-4 md:grid-cols-5">
        <StatCard title="Tổng đơn" value={stats.total} desc="Tất cả đơn hàng" />
        <StatCard
          title="Đơn mới"
          value={stats.newOrders}
          desc="Cần liên hệ"
          tone="blue"
        />
        <StatCard
          title="Đã liên hệ"
          value={stats.contacted}
          desc="Đang tư vấn"
          tone="amber"
        />
        <StatCard
          title="Đã chốt"
          value={stats.confirmed}
          desc="Đơn thành công"
          tone="emerald"
        />
        <StatCard
          title="Đã hủy"
          value={stats.cancelled}
          desc="Không mua"
          tone="red"
        />
      </section>

      {/* CREATE / UPDATE FORM */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              {editingOrderId ? "Update" : "Create"}
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {editingOrderId ? "Sửa đơn hàng" : "Tạo đơn hàng thủ công"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Dùng phần này khi có khách đặt qua điện thoại, Facebook hoặc Zalo.
            </p>
          </div>

          {editingOrderId && (
            <button
              type="button"
              onClick={startCreate}
              className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Hủy sửa
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-bold">Tên khách</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Số điện thoại</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Ví dụ: 09xxxxxxxx"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Sản phẩm</label>
            <select
              name="product"
              value={formData.product}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option>Rong nho 250g - 80.000đ</option>
              <option>Rong nho 500g - 150.000đ</option>
              <option>Rong nho 1kg - 300.000đ</option>
              <option>Tôi muốn nhập đại lý nhỏ</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="new">Đơn mới</option>
              <option value="contacted">Đã liên hệ</option>
              <option value="confirmed">Đã chốt</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-bold">Ghi chú</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              placeholder="Ghi chú đơn hàng..."
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-2xl bg-emerald-700 px-6 py-3 font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "Đang lưu..."
                : editingOrderId
                ? "Cập nhật đơn hàng"
                : "Tạo đơn hàng"}
            </button>
          </div>
        </form>
      </section>

      {message && (
        <div className="rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-700">
          {message}
        </div>
      )}

      {/* FILTERS */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-2">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Bộ lọc
          </p>
          <h2 className="text-2xl font-black">Tìm kiếm đơn hàng</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_260px_140px]">
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm theo tên, số điện thoại, sản phẩm, ghi chú..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as OrderStatus | "all")
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            {statusOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-2xl bg-slate-900 px-5 py-3 font-black text-white transition hover:bg-slate-700"
          >
            Reset
          </button>
        </div>

        <p className="mt-4 text-sm font-bold text-slate-500">
          Đang hiển thị{" "}
          <span className="text-emerald-700">{filteredOrders.length}</span> /
          {orders.length} đơn hàng.
        </p>
      </section>

      {/* ORDERS TABLE */}
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Danh sách đơn hàng</h2>
            <p className="mt-1 text-slate-500">
              Theo dõi, lọc, cập nhật trạng thái và xử lý đơn hàng.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50"
          >
            Tải lại
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center font-bold">
            Đang tải danh sách đơn hàng...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center font-bold">
            Không tìm thấy đơn hàng phù hợp.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="p-4">Thời gian</th>
                    <th className="p-4">Khách hàng</th>
                    <th className="p-4">SĐT</th>
                    <th className="p-4">Sản phẩm</th>
                    <th className="p-4">Ghi chú</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4">Đổi nhanh</th>
                    <th className="p-4">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100">
                      <td className="p-4 text-sm text-slate-500">
                        {formatDateTime(order.created_at)}
                      </td>

                      <td className="p-4 font-black">{order.name}</td>

                      <td className="p-4">
                        <a
                          href={`tel:${order.phone}`}
                          className="font-bold text-emerald-700"
                        >
                          {order.phone}
                        </a>
                      </td>

                      <td className="p-4 font-semibold">{order.product}</td>

                      <td className="max-w-[220px] p-4 text-slate-600">
                        {order.note || "Không có"}
                      </td>

                      <td className="p-4">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order, e.target.value as OrderStatus)
                          }
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-emerald-500"
                        >
                          <option value="new">Đơn mới</option>
                          <option value="contacted">Đã liên hệ</option>
                          <option value="confirmed">Đã chốt</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(order)}
                            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                          >
                            Sửa
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteOrder(order.id)}
                            className="rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{order.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDateTime(order.created_at)}
                      </p>
                    </div>

                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <strong>SĐT:</strong>{" "}
                      <a
                        href={`tel:${order.phone}`}
                        className="font-bold text-emerald-700"
                      >
                        {order.phone}
                      </a>
                    </p>
                    <p>
                      <strong>Sản phẩm:</strong> {order.product}
                    </p>
                    <p>
                      <strong>Ghi chú:</strong> {order.note || "Không có"}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order, e.target.value as OrderStatus)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold outline-none focus:border-emerald-500"
                    >
                      <option value="new">Đơn mới</option>
                      <option value="contacted">Đã liên hệ</option>
                      <option value="confirmed">Đã chốt</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(order)}
                        className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteOrder(order.id)}
                        className="rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  desc,
  tone = "slate",
}: {
  title: string;
  value: number;
  desc: string;
  tone?: "slate" | "blue" | "amber" | "emerald" | "red";
}) {
  const toneClass = {
    slate: "bg-slate-900 text-white",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  }[tone];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-sm font-bold text-slate-500">{title}</p>

      <div
        className={`mt-4 inline-flex min-w-16 items-center justify-center rounded-2xl px-4 py-2 text-3xl font-black ${toneClass}`}
      >
        {value}
      </div>

      <p className="mt-3 text-sm font-medium text-slate-500">{desc}</p>
    </div>
  );
}