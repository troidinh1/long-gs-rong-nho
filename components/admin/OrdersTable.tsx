"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { formatDateTime, formatVND } from "@/lib/format";
import { Order, OrderFormData, OrderStatus } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";

const emptyForm: OrderFormData = {
  name: "",
  phone: "",
  product: "Rong nho 500g - 150.000đ",
  note: "",
  status: "new",
  quantity: "1",
  address: "",
  customer_type: "retail",
  total_price: "0",
};

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "new", label: "Đơn mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "confirmed", label: "Đã chốt" },
  { value: "cancelled", label: "Đã hủy" },
];

const statusEditOptions: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Đơn mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "confirmed", label: "Đã chốt" },
  { value: "cancelled", label: "Đã hủy" },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<OrderFormData>(emptyForm);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchKeyword, setSearchKeyword] = useState("");

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
        setMessage(result.message || "Không lấy được danh sách đơn hàng.");
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
    const totalOrders = orders.length;
    const newOrders = orders.filter((order) => order.status === "new").length;
    const contactedOrders = orders.filter(
      (order) => order.status === "contacted",
    ).length;
    const confirmedOrders = orders.filter(
      (order) => order.status === "confirmed",
    ).length;
    const cancelledOrders = orders.filter(
      (order) => order.status === "cancelled",
    ).length;

    const confirmedRevenue = orders
      .filter((order) => order.status === "confirmed")
      .reduce((sum, order) => sum + Number(order.total_price || 0), 0);

    return {
      totalOrders,
      newOrders,
      contactedOrders,
      confirmedOrders,
      cancelledOrders,
      confirmedRevenue,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter;

      const matchesKeyword = keyword
        ? [
            order.name,
            order.phone,
            order.product,
            order.note || "",
            order.address || "",
            order.customer_type,
            order.created_at,
            ...(order.order_items || []).map((item) => item.product_name),
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        : true;

      return matchesStatus && matchesKeyword;
    });
  }, [orders, searchKeyword, statusFilter]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
      quantity: String(order.quantity || 1),
      address: order.address || "",
      customer_type: order.customer_type || "retail",
      total_price: String(order.total_price || 0),
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          product: formData.product,
          note: formData.note,
          status: formData.status,
          quantity: Number(formData.quantity || 1),
          address: formData.address,
          customer_type: formData.customer_type,
          total_price: Number(formData.total_price || 0),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Lưu đơn hàng thất bại.");
        return;
      }

      setMessage(
        isEditMode
          ? "Cập nhật đơn hàng thành công."
          : "Tạo đơn hàng thành công.",
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

  async function quickUpdateStatus(order: Order, status: OrderStatus) {
    if (order.status === status) return;

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
          quantity: Number(order.quantity || 1),
          address: order.address || "",
          customer_type: order.customer_type || "retail",
          total_price: Number(order.total_price || 0),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không thể cập nhật trạng thái.");
        return;
      }

      setMessage("Cập nhật trạng thái thành công.");
      await fetchOrders();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi cập nhật trạng thái.");
    }
  }

  async function deleteOrder(orderId: string) {
    const isConfirmed = window.confirm(
      "Bạn có chắc muốn xóa đơn hàng này không?",
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

  function toggleOrderDetail(orderId: string) {
    setExpandedOrderId((currentId) => (currentId === orderId ? null : orderId));
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Tổng đơn"
          value={stats.totalOrders}
          note="Tất cả đơn"
          tone="dark"
        />
        <StatCard
          label="Đơn mới"
          value={stats.newOrders}
          note="Cần liên hệ"
          tone="blue"
        />
        <StatCard
          label="Đã liên hệ"
          value={stats.contactedOrders}
          note="Đang tư vấn"
          tone="amber"
        />
        <StatCard
          label="Đã chốt"
          value={stats.confirmedOrders}
          note="Đơn thành công"
          tone="green"
        />
        <StatCard
          label="Đã hủy"
          value={stats.cancelledOrders}
          note="Không mua"
          tone="red"
        />
        <StatCard
          label="Doanh thu chốt"
          value={formatVND(stats.confirmedRevenue)}
          note="Tính đơn đã chốt"
          tone="green"
        />
      </section>

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
              Dùng khi có khách đặt qua điện thoại, Facebook hoặc Zalo.
            </p>
          </div>

          {editingOrderId && (
            <button
              type="button"
              onClick={startCreate}
              className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 transition hover:bg-slate-50"
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
            <input
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Rong nho 500g - 150.000đ"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Số lượng</label>
            <input
              name="quantity"
              type="number"
              min={1}
              value={formData.quantity}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Loại khách</label>
            <select
              name="customer_type"
              value={formData.customer_type}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="retail">Khách lẻ</option>
              <option value="dealer">Đại lý</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold">Tổng tiền</label>
            <input
              name="total_price"
              type="number"
              min={0}
              value={formData.total_price}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
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

          <div>
            <label className="mb-2 block font-bold">Địa chỉ</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ví dụ: Trần Phú, Nha Trang"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
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
              className="cursor-pointer rounded-2xl bg-emerald-700 px-6 py-3 font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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

      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-black">Danh sách đơn hàng</h2>
            <p className="mt-1 text-slate-500">
              Dạng bảng gọn để quản lý nhiều đơn nhanh hơn. Bấm “Chi tiết” để
              xem sản phẩm trong đơn.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[220px_1fr_auto]">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OrderStatus | "all")
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              {statusOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên, SĐT, sản phẩm, địa chỉ..."
              className="rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />

            <button
              type="button"
              onClick={fetchOrders}
              className="cursor-pointer rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50"
            >
              Tải lại
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center font-bold">
            Đang tải danh sách đơn hàng...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center font-bold">
            Không có đơn hàng phù hợp.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1200px] border-collapse text-left">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Khách hàng</th>
                    <th className="px-5 py-4">Ngày đặt</th>
                    <th className="px-5 py-4">Sản phẩm</th>
                    <th className="px-5 py-4">Tổng tiền</th>
                    <th className="px-5 py-4">Trạng thái</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <>
                        <tr
                          key={order.id}
                          className="border-b border-slate-100 align-top transition hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-black text-slate-950">
                                {order.name}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-500">
                                📞 {order.phone}
                              </p>
                              {order.address && (
                                <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-500">
                                  📍 {order.address}
                                </p>
                              )}
                              <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                {order.customer_type === "dealer"
                                  ? "Đại lý"
                                  : "Khách lẻ"}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-slate-700">
                              {formatDateTime(order.created_at)}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="max-w-[360px] truncate text-sm font-bold text-slate-700">
                              {getProductSummary(order)}
                            </p>
                            <button
                              type="button"
                              onClick={() => toggleOrderDetail(order.id)}
                              className="mt-2 cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                            >
                              {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-lg font-black text-emerald-700">
                              {formatVND(order.total_price || 0)}
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-400">
                              SL: {order.quantity || 1}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="grid gap-2">
                              <OrderStatusBadge status={order.status} />

                              <select
                                value={order.status}
                                onChange={(e) =>
                                  quickUpdateStatus(
                                    order,
                                    e.target.value as OrderStatus,
                                  )
                                }
                                className="w-40 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                              >
                                {statusEditOptions.map((item) => (
                                  <option key={item.value} value={item.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(order)}
                                className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                              >
                                Sửa
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteOrder(order.id)}
                                className="cursor-pointer rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="border-b border-slate-100 bg-slate-50">
                            <td colSpan={6} className="px-5 py-5">
                              <OrderDetail order={order} />
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
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;

                return (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-slate-950">
                            {order.name}
                          </h3>
                          <OrderStatusBadge status={order.status} />
                        </div>

                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          📞 {order.phone}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          🕒 {formatDateTime(order.created_at)}
                        </p>

                        {order.address && (
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            📍 {order.address}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-black text-emerald-700">
                          {formatVND(order.total_price || 0)}
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          SL: {order.quantity || 1}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                      <p className="line-clamp-2 text-sm font-bold text-slate-700">
                        {getProductSummary(order)}
                      </p>

                      {isExpanded && <OrderDetail order={order} />}
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          quickUpdateStatus(
                            order,
                            e.target.value as OrderStatus,
                          )
                        }
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      >
                        {statusEditOptions.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => toggleOrderDetail(order.id)}
                        className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                      >
                        {isExpanded ? "Ẩn chi tiết" : "Chi tiết"}
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(order)}
                          className="cursor-pointer rounded-xl bg-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-300"
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteOrder(order.id)}
                          className="cursor-pointer rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
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

function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="mt-2 rounded-2xl bg-white p-4">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-black uppercase tracking-wide text-slate-500">
          Chi tiết sản phẩm
        </p>

        {order.note && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
            Ghi chú: {order.note}
          </p>
        )}
      </div>

      {order.order_items && order.order_items.length > 0 ? (
        <div className="grid gap-2">
          {order.order_items.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:grid-cols-[1fr_120px_140px]"
            >
              <div>
                <p className="font-black text-slate-950">{item.product_name}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {item.product_weight || "Không có khối lượng"}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase text-slate-400">
                  Số lượng
                </p>
                <p className="mt-1 font-black text-slate-700">
                  {item.quantity} x {formatVND(item.unit_price)}
                </p>
              </div>

              <div className="text-left md:text-right">
                <p className="text-xs font-black uppercase text-slate-400">
                  Thành tiền
                </p>
                <p className="mt-1 font-black text-emerald-700">
                  {formatVND(item.line_total)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="font-semibold text-slate-600">{order.product}</p>
        </div>
      )}
    </div>
  );
}

function getProductSummary(order: Order) {
  if (order.order_items && order.order_items.length > 0) {
    return order.order_items
      .map((item) => `${item.product_name} x${item.quantity}`)
      .join(" | ");
  }

  return order.product;
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
  tone: "dark" | "blue" | "amber" | "green" | "red";
}) {
  const toneClass = {
    dark: "bg-slate-950 text-white",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  }[tone];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-sm font-black text-slate-500">{label}</p>
      <div
        className={`mt-4 inline-flex min-h-12 min-w-12 items-center justify-center rounded-2xl px-4 text-2xl font-black ${toneClass}`}
      >
        {value}
      </div>
      <p className="mt-3 text-sm font-bold text-slate-500">{note}</p>
    </div>
  );
}
