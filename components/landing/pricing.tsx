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
    <section id="bang-gia" className="bg-white px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Bảng giá
          </p>

          <h2 className="mt-4 text-4xl font-black text-[#071027] md:text-5xl">
            Chọn gói phù hợp
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Bảng giá được cập nhật từ hệ thống admin, giúp bạn đổi giá hoặc thêm
            sản phẩm mà không cần sửa code.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-3xl bg-emerald-50 p-8 text-center font-bold text-emerald-700">
            Đang tải sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center font-bold text-slate-500">
            Hiện chưa có sản phẩm nào.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-7 shadow-2xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-emerald-900/10"
              >
                <div className="grid grid-cols-2 items-center gap-4">
                  <div>
                    {item.badge && (
                      <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
                        {item.badge}
                      </span>
                    )}

                    <h3 className="mt-6 text-4xl font-black text-[#071027]">
                      {item.weight}
                    </h3>

                    <p className="mt-1 text-base text-slate-500">
                      {item.name}
                    </p>

                    <p className="mt-4 text-3xl font-black text-emerald-700">
                      {formatVND(item.price)}
                    </p>
                  </div>

                  <div className="relative aspect-square">
                    <Image
                      src={item.image_url || "/images/product-rong-nho.png"}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 180px"
                      className="object-contain drop-shadow-xl transition group-hover:scale-105"
                    />
                  </div>
                </div>

                {item.description && (
                  <p className="mt-5 min-h-12 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                )}

                <a
                  href="#dat-hang"
                  className="mt-6 block rounded-2xl bg-[#071027] px-6 py-4 text-center font-black text-white transition hover:bg-emerald-700"
                >
                  Đặt gói này
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}