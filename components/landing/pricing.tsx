"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatVND } from "@/lib/money";
import { Product } from "@/types/product";

export default function Pricing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchProducts() {
    try {
      setIsLoading(true);

      const response = await fetch("/api/products");
      const result = await response.json();

      if (!response.ok) {
        console.error(result.message || "Không thể lấy sản phẩm.");
        return;
      }

      setProducts(result.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section id="bang-gia" className="bg-white px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Sản phẩm LONG GS
            </p>

            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Chọn gói rong nho phù hợp với nhu cầu của bạn
            </h2>
          </div>

          <p className="max-w-md text-base leading-8 text-slate-500">
            Giá và sản phẩm được cập nhật trực tiếp từ hệ thống admin. Khi thay
            đổi trong admin, trang chủ sẽ tự cập nhật.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-[2rem] bg-emerald-50 p-8 text-center font-bold text-emerald-700">
            Đang tải sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[2rem] bg-slate-50 p-8 text-center font-bold text-slate-500">
            Hiện chưa có sản phẩm nào.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((item, index) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-[2rem] border bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-2xl ${
                  index === 1
                    ? "border-emerald-300 ring-4 ring-emerald-50"
                    : "border-slate-100"
                }`}
              >
                {index === 1 && (
                  <div className="absolute right-5 top-5 rounded-full bg-emerald-700 px-4 py-2 text-xs font-black uppercase tracking-wide text-white">
                    Gợi ý
                  </div>
                )}

                <div className="relative mb-6 aspect-square overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-sky-50">
                  <Image
                    src={item.image_url || "/images/product-rong-nho.png"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  {item.badge && (
                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
                      {item.badge}
                    </span>
                  )}

                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
                    {item.weight}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-black text-slate-950">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                )}

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-400">Giá bán</p>
                    <p className="mt-1 text-3xl font-black text-emerald-700">
                      {formatVND(item.price)}
                    </p>
                  </div>

                  <a
                    href="#dat-hang"
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                  >
                    Đặt ngay
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}