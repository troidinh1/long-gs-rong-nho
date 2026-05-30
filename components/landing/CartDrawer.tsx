"use client";

import Image from "next/image";
import { formatVND } from "@/lib/money";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    cartCount,
    cartTotal,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  function goToOrderForm() {
    closeCart();

    setTimeout(() => {
      document.querySelector("#dat-hang")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  return (
    <>
      {isCartOpen && (
        <button
          type="button"
          onClick={closeCart}
          className="fixed inset-0 z-[80] cursor-pointer bg-slate-950/50 backdrop-blur-sm"
          aria-label="Đóng giỏ hàng"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-[90] flex h-screen w-full max-w-md flex-col bg-white shadow-2xl shadow-slate-950/30 transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Giỏ hàng
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Sản phẩm đã chọn
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-slate-100 text-xl font-black text-slate-700 transition hover:bg-red-50 hover:text-red-600"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-4xl">
                🛒
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-950">
                Giỏ hàng đang trống
              </h3>

              <p className="mt-2 max-w-xs text-slate-500">
                Hãy chọn sản phẩm LONG GS để thêm vào giỏ hàng.
              </p>

              <button
                type="button"
                onClick={closeCart}
                className="mt-6 cursor-pointer rounded-2xl bg-emerald-700 px-6 py-3 font-black text-white transition hover:bg-emerald-800"
              >
                Tiếp tục mua hàng
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-emerald-50">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-black text-slate-950">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm font-bold text-slate-500">
                        {item.weight}
                      </p>

                      <p className="mt-2 text-lg font-black text-emerald-700">
                        {formatVND(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-2xl bg-slate-100 p-1">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white font-black text-slate-700 shadow-sm"
                      >
                        -
                      </button>

                      <span className="flex h-9 min-w-12 items-center justify-center px-3 font-black text-slate-950">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white font-black text-slate-700 shadow-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="cursor-pointer rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-100"
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                    Thành tiền: {formatVND(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5">
            <div className="mb-4 rounded-3xl bg-slate-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Tổng sản phẩm</span>
                <span className="font-black">{cartCount}</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-slate-300">Tạm tính</span>
                <span className="text-2xl font-black text-emerald-300">
                  {formatVND(cartTotal)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={clearCart}
                className="cursor-pointer rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50"
              >
                Xóa giỏ
              </button>

              <button
                type="button"
                onClick={goToOrderForm}
                className="cursor-pointer rounded-2xl bg-emerald-700 px-5 py-3 font-black text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-800"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
