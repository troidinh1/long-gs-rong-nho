"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatVND } from "@/lib/format";
import { Product } from "@/types/product";
import { useCart } from "./CartProvider";

const zaloPhone = "0896456068";
const zaloLink = "https://zalo.me/0896456068";
const facebookLink = "https://www.facebook.com/khaive1s";

const fallbackProducts: Product[] = [
  {
    id: "fallback-250g",
    name: "Rong nho LONG GS 250g",
    weight: "250g",
    price: 80000,
    description: "Dùng thử",
    image_url: "/images/product-rong-nho.png",
    badge: "Dùng thử",
    is_active: true,
    sort_order: 1,
    created_at: "",
    category_id: null,
    categories: null,
  },
  {
    id: "fallback-500g",
    name: "Rong nho LONG GS 500g",
    weight: "500g",
    price: 150000,
    description: "Gia đình",
    image_url: "/images/product-rong-nho.png",
    badge: "Gia đình",
    is_active: true,
    sort_order: 2,
    created_at: "",
    category_id: null,
    categories: null,
  },
  {
    id: "fallback-1kg",
    name: "Rong nho LONG GS 1kg",
    weight: "1kg",
    price: 300000,
    description: "Đại lý",
    image_url: "/images/product-rong-nho.png",
    badge: "Đại lý",
    is_active: true,
    sort_order: 3,
    created_at: "",
    category_id: null,
    categories: null,
  },
];

export default function OrderForm() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [selectedProductId, setSelectedProductId] = useState(
    fallbackProducts[0].id,
  );
  const [quantity, setQuantity] = useState(1);
  const [customerType, setCustomerType] = useState("retail");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const { items, cartTotal, cartCount, clearCart } = useCart();

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products");
      const result = await response.json();

      if (!response.ok) return;

      const productList: Product[] = result.products || [];

      if (productList.length > 0) {
        setProducts(productList);
        setSelectedProductId(productList[0].id);
      }
    } catch (error) {
      console.error("Fetch order form products error:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const selectedProduct = useMemo(() => {
    return (
      products.find((product) => product.id === selectedProductId) ||
      products[0] ||
      fallbackProducts[0]
    );
  }, [products, selectedProductId]);

  const singleProductTotal = useMemo(() => {
    return selectedProduct.price * quantity;
  }, [selectedProduct, quantity]);

  const finalTotal = items.length > 0 ? cartTotal : singleProductTotal;

  async function handleOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setMessage("");

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const note = String(formData.get("note") || "").trim();

    if (!name || !phone) {
      setMessage("Vui lòng nhập tên và số điện thoại.");
      setIsSubmitting(false);
      return;
    }

    try {
      const cartProductSummary = items
        .map(
          (item) =>
            `${item.name} x${item.quantity} - ${formatVND(
              item.price * item.quantity,
            )}`,
        )
        .join(" | ");

      const orderItems =
        items.length > 0
          ? items.map((item) => ({
              product_id: item.id,
              product_name: item.name,
              product_weight: item.weight,
              unit_price: item.price,
              quantity: item.quantity,
              line_total: item.price * item.quantity,
            }))
          : [
              {
                product_id: selectedProduct.id,
                product_name: selectedProduct.name,
                product_weight: selectedProduct.weight,
                unit_price: selectedProduct.price,
                quantity,
                line_total: selectedProduct.price * quantity,
              },
            ];

      const orderData = {
        name,
        phone,
        product:
          items.length > 0
            ? cartProductSummary
            : `${selectedProduct.name} - ${formatVND(selectedProduct.price)}`,
        quantity: items.length > 0 ? cartCount : quantity,
        address,
        customer_type: customerType,
        total_price: finalTotal,
        note,
        items: orderItems,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không thể gửi đơn hàng.");
        return;
      }

      const createdOrderCode = result.order?.order_code || "";

      setMessage(
        createdOrderCode
          ? `Đặt hàng thành công! Mã đơn của bạn là ${createdOrderCode}.`
          : "Đặt hàng thành công! LONG GS sẽ liên hệ lại sớm.",
      );

      form.reset();
      setQuantity(1);
      setCustomerType("retail");
      clearCart();

      setTimeout(() => {
        if (createdOrderCode) {
          window.location.href = `/thank-you?order_code=${createdOrderCode}&phone=${phone}`;
          return;
        }

        window.location.href = "/thank-you";
      }, 900);
    } catch (error) {
      console.error("Order submit error:", error);
      setMessage("Có lỗi xảy ra khi gửi đơn hàng.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="dat-hang"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f0fdf4_100%)] px-4 py-20 md:px-8"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-100 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-sky-100 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
            Đặt hàng LONG GS
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Gửi thông tin, LONG GS sẽ tư vấn và chốt đơn nhanh
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            Bạn có thể đặt một sản phẩm trực tiếp trong form hoặc thêm nhiều sản
            phẩm vào giỏ hàng trước rồi gửi đơn. Sau khi đặt hàng, bạn có thể
            dùng mã đơn để tra cứu trạng thái.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
                🛒
              </div>
              <p className="mt-4 font-black text-slate-950">Chọn sản phẩm</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Thêm một hoặc nhiều sản phẩm vào giỏ.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-xl">
                📦
              </div>
              <p className="mt-4 font-black text-slate-950">Tra cứu đơn</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Khách có thể theo dõi trạng thái bằng mã đơn.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                🚚
              </div>
              <p className="mt-4 font-black text-slate-950">Giao hàng</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Hỗ trợ giao hàng toàn quốc.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6">
            <h3 className="text-xl font-black text-slate-950">
              Thông tin liên hệ
            </h3>

            <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
              <p>
                Zalo:{" "}
                <a
                  href={zaloLink}
                  target="_blank"
                  className="font-black text-emerald-700 hover:underline"
                >
                  {zaloPhone}
                </a>
              </p>

              <p>
                Facebook:{" "}
                <a
                  href={facebookLink}
                  target="_blank"
                  className="font-black text-emerald-700 hover:underline"
                >
                  facebook.com/khaive1s
                </a>
              </p>

              <p>Email: hmq2507@gmail.com</p>
              <p>Địa chỉ: Trần Phú, Nha Trang, Khánh Hòa</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleOrder}
          className="rounded-[2.5rem] border border-emerald-100 bg-white p-6 shadow-2xl shadow-emerald-950/10 md:p-8"
        >
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Form đặt hàng
            </p>

            <h3 className="mt-2 text-3xl font-black text-slate-950">
              Thông tin đơn hàng
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Nếu giỏ hàng có sản phẩm, đơn sẽ lấy theo giỏ hàng. Nếu giỏ trống,
              đơn sẽ lấy sản phẩm được chọn trong form.
            </p>
          </div>

          {items.length > 0 && (
            <div className="mb-6 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-black text-slate-950">
                    Giỏ hàng hiện có {cartCount} sản phẩm
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Đơn hàng sẽ được tạo theo danh sách sản phẩm trong giỏ.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-black text-red-600 shadow-sm"
                >
                  Xóa giỏ
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 text-sm"
                  >
                    <div>
                      <p className="font-black text-slate-950">{item.name}</p>
                      <p className="mt-1 text-slate-500">
                        {item.weight} x{item.quantity}
                      </p>
                    </div>

                    <p className="font-black text-emerald-700">
                      {formatVND(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-black text-slate-950">
                Tên khách hàng
              </label>
              <input
                name="name"
                required
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block font-black text-slate-950">
                Số điện thoại
              </label>
              <input
                name="phone"
                required
                placeholder="Ví dụ: 09xxxxxxxx"
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block font-black text-slate-950">
                Loại khách
              </label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="retail">Khách lẻ</option>
                <option value="dealer">Đại lý</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-black text-slate-950">
                Số lượng
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value || 1)))
                }
                disabled={items.length > 0}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-400"
              />
              {items.length > 0 && (
                <p className="mt-2 text-xs font-bold text-slate-400">
                  Số lượng đang lấy theo giỏ hàng.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-black text-slate-950">
                Sản phẩm quan tâm
              </label>

              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                disabled={items.length > 0}
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-400"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatVND(product.price)}
                  </option>
                ))}
              </select>

              {items.length > 0 && (
                <p className="mt-2 text-xs font-bold text-slate-400">
                  Sản phẩm đang lấy theo giỏ hàng.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-black text-slate-950">
                Địa chỉ giao hàng
              </label>
              <input
                name="address"
                placeholder="Ví dụ: Trần Phú, Nha Trang"
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-black text-slate-950">
                Ghi chú
              </label>
              <textarea
                name="note"
                rows={4}
                placeholder="Ví dụ: Tôi muốn mua 2 hộp 500g, giao trong hôm nay..."
                className="w-full resize-none rounded-2xl border border-slate-200 px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="mt-6 rounded-[2rem] bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-400">
                  Tổng tạm tính
                </p>

                <p className="mt-1 text-3xl font-black text-emerald-300">
                  {formatVND(finalTotal)}
                </p>
              </div>

              <div className="text-right text-sm font-bold text-slate-300">
                {items.length > 0 ? (
                  <p>{cartCount} sản phẩm trong giỏ</p>
                ) : (
                  <p>
                    {selectedProduct.weight} x{quantity}
                  </p>
                )}

                <p className="mt-1">Chưa gồm phí vận chuyển</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full cursor-pointer rounded-2xl bg-emerald-700 px-6 py-4 font-black text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Đang gửi đơn..." : "Gửi đơn đặt hàng"}
          </button>

          {message && (
            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-700">
              {message}
            </div>
          )}

          <a
            href="/tra-cuu-don-hang"
            className="mt-4 flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-4 font-black text-slate-700 transition hover:bg-slate-50"
          >
            Tra cứu đơn hàng của bạn
          </a>

          <a
            href={zaloLink}
            target="_blank"
            className="mt-3 flex w-full items-center justify-center rounded-2xl border border-emerald-200 bg-white px-6 py-4 font-black text-emerald-700 transition hover:bg-emerald-50"
          >
            Nhắn Zalo để tư vấn nhanh
          </a>
        </form>
      </div>
    </section>
  );
}
