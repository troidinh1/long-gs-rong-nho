"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { formatVND } from "@/lib/money";
import { Product } from "@/types/product";

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
    badge: "Bán chạy",
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

export default function Hero() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products");
      const result = await response.json();

      if (!response.ok) return;

      if (result.products?.length > 0) {
        setProducts(result.products);
      }
    } catch (error) {
      console.error("Fetch hero products error:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const featuredProduct = useMemo(() => {
    return (
      products.find((product) =>
        product.badge?.toLowerCase().includes("bán chạy")
      ) ||
      products[1] ||
      products[0]
    );
  }, [products]);

  const heroImage = featuredProduct?.image_url || "/images/product-rong-nho.png";
  const smallProducts = products.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-[#f7fffb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#bbf7d0_0%,transparent_32%),radial-gradient(circle_at_top_right,#bae6fd_0%,transparent_28%),linear-gradient(180deg,#ffffff_0%,#f0fdf4_100%)]" />

      <div className="pointer-events-none absolute -left-36 top-24 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-36 bottom-10 h-96 w-96 rounded-full bg-sky-200/60 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8 md:py-20">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-200 bg-white/80 px-4 py-2.5 text-sm font-black text-emerald-700 shadow-sm backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              🌊
            </span>
            Đặc sản biển Nha Trang - Khánh Hòa
          </div>

          <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-7xl">
            Rong nho sạch,{" "}
            <span className="bg-gradient-to-r from-emerald-700 to-sky-600 bg-clip-text text-transparent">
              xanh giòn
            </span>{" "}
            cho bữa ăn hiện đại.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-600">
            LONG GS cung cấp rong nho cho gia đình, quán ăn và đại lý nhỏ. Sản
            phẩm dễ dùng, dễ bán, phù hợp xu hướng ăn sạch và thực phẩm healthy.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#dat-hang"
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-8 py-4 text-base font-black text-white shadow-2xl shadow-emerald-900/25 transition hover:-translate-y-1 hover:bg-emerald-800"
            >
              Đặt hàng ngay <span>→</span>
            </a>

            <a
              href="#bang-gia"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-black text-slate-900 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50"
            >
              Xem sản phẩm
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {smallProducts.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-white bg-white/80 p-4 shadow-xl shadow-slate-900/5 backdrop-blur transition hover:-translate-y-1"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-lg">
                  {item.badge?.toLowerCase().includes("đại lý")
                    ? "🏪"
                    : item.badge?.toLowerCase().includes("bán chạy")
                    ? "🔥"
                    : "🌿"}
                </div>

                <p className="text-2xl font-black text-slate-950">
                  {item.weight}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-500">
                  {item.badge || item.description || "Sản phẩm"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              ✓ Tư vấn nhanh
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              ✓ Giao hàng toàn quốc
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              ✓ Nhận đại lý nhỏ
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-emerald-200 via-sky-100 to-white blur-2xl" />

          <div className="relative rounded-[2.5rem] border border-white bg-white/80 p-4 shadow-2xl shadow-emerald-950/15 backdrop-blur md:p-6">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-50 to-sky-50">
              <Image
                src={heroImage}
                alt={featuredProduct?.name || "Rong nho LONG GS"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover drop-shadow-2xl"
              />
            </div>
          </div>

          {featuredProduct && (
            <div className="absolute bottom-6 left-1/2 w-[90%] -translate-x-1/2 rounded-[1.7rem] border border-white bg-white/95 p-4 shadow-2xl shadow-slate-950/15 backdrop-blur md:w-[430px]">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                  🛍️
                </div>

                <div className="min-w-0">
                  <p className="truncate text-lg font-black leading-tight text-slate-950">
                    {featuredProduct.badge || "Sản phẩm nổi bật"}
                  </p>

                  <p className="mt-1 text-base font-medium text-slate-500">
                    {featuredProduct.weight} chỉ{" "}
                    <span className="font-black text-emerald-700">
                      {formatVND(featuredProduct.price)}
                    </span>
                  </p>
                </div>

                <a
                  href="#dat-hang"
                  className="ml-auto hidden rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white md:block"
                >
                  Mua
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}