"use client";

import { FormEvent, useState } from "react";
import { zaloLink } from "./data";

export default function OrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    setOrderMessage("");
    setIsSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const orderData = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      product: String(formData.get("product") || "").trim(),
      note: String(formData.get("note") || "").trim(),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        console.error("API không trả về JSON:", text);
        setIsSuccess(false);
        setOrderMessage(
          "API đặt hàng đang lỗi hoặc chưa được tạo đúng. Kiểm tra terminal để xem lỗi."
        );
        return;
      }

      if (!response.ok) {
        setIsSuccess(false);
        setOrderMessage(result.message || "Gửi đơn hàng thất bại.");
        return;
      }

      setIsSuccess(true);
      setOrderMessage("Đặt hàng thành công! Đang chuyển sang trang cảm ơn...");
      form.reset();

      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 800);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setOrderMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="dat-hang" className="bg-white px-4 py-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Đặt hàng
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#071027] md:text-5xl">
            Để lại thông tin, LONG GS tư vấn qua Zalo.
          </h2>

          <p className="mt-6 text-lg leading-9 text-slate-600">
            Khi khách gửi form, thông tin sẽ được lưu vào hệ thống đơn hàng.
            LONG GS sẽ liên hệ lại để tư vấn, xác nhận sản phẩm và hỗ trợ giao
            hàng.
          </p>

          <div className="mt-8 rounded-[2rem] bg-emerald-50 p-7">
            <h3 className="text-xl font-black text-[#071027]">
              Thông tin liên hệ
            </h3>

            <div className="mt-5 space-y-3 text-slate-600">
              <p>
                <strong>Zalo:</strong> 0896456068
              </p>

              <p>
                <strong>Facebook:</strong>{" "}
                <a
                  href="https://www.facebook.com/khaive1s"
                  target="_blank"
                  className="font-black text-emerald-700 underline"
                >
                  facebook.com/khaive1s
                </a>
              </p>

              <p>
                <strong>Email:</strong> hmq2507@gmail.com
              </p>

              <p>
                <strong>Địa chỉ:</strong> Trần Phú, Nha Trang, Khánh Hòa
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleOrder}
          className="rounded-[2rem] border border-emerald-100 bg-white p-7 shadow-2xl shadow-slate-900/10"
        >
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block font-black text-[#071027]">
                Họ và tên
              </label>
              <input
                name="name"
                required
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block font-black text-[#071027]">
                Số điện thoại
              </label>
              <input
                name="phone"
                required
                placeholder="Ví dụ: 09xxxxxxxx"
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-2 block font-black text-[#071027]">
                Sản phẩm quan tâm
              </label>
              <select
                name="product"
                className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option>Rong nho 250g - 80.000đ</option>
                <option>Rong nho 500g - 150.000đ</option>
                <option>Rong nho 1kg - 300.000đ</option>
                <option>Tôi muốn nhập đại lý nhỏ</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-black text-[#071027]">
                Ghi chú
              </label>
              <textarea
                name="note"
                rows={4}
                placeholder="Ví dụ: Tôi muốn mua 2 gói 500g..."
                className="w-full resize-none rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-emerald-700 px-8 py-4 text-base font-black text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Đang gửi đơn..." : "Gửi đơn đặt hàng"}
            </button>

            {orderMessage && (
              <div
                className={`rounded-2xl px-5 py-4 text-sm font-bold ${
                  isSuccess
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {orderMessage}

                {isSuccess && (
                  <div className="mt-3">
                    <a
                      href={zaloLink}
                      target="_blank"
                      className="inline-flex rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white"
                    >
                      Nhắn Zalo để tư vấn nhanh
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}