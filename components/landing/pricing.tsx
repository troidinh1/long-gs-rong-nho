"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { formatVND } from "@/lib/money";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export default function Pricing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  async function fetchData() {
    try {
      setIsLoading(true);

      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      const productsResult = await productsResponse.json();
      const categoriesResult = await categoriesResponse.json();

      if (productsResponse.ok) {
        setProducts(productsResult.products || []);
      }

      if (categoriesResponse.ok) {
        setCategories(categoriesResult.categories || []);
      }
    } catch (error) {
      console.error("Fetch catalog data error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategoryId === "all") return products;

    return products.filter(
      (product) => product.category_id === activeCategoryId
    );
  }, [products, activeCategoryId]);

  const activeCategoryName = useMemo(() => {
    if (activeCategoryId === "all") return "Tất cả sản phẩm";

    return (
      categories.find((category) => category.id === activeCategoryId)?.name ||
      "Danh mục"
    );
  }, [categories, activeCategoryId]);

  const featuredProduct = products[0];

  return (
    <section
      id="bang-gia"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fffc_45%,#ffffff_100%)] px-4 py-20 md:px-8"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-100 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-52 h-96 w-96 rounded-full bg-sky-100 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
            Cửa hàng LONG GS
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Sản phẩm rong nho và đặc sản biển sạch
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-500 md:text-lg">
            Khám phá các sản phẩm LONG GS theo danh mục. Giá, ảnh và sản phẩm
            được cập nhật trực tiếp từ hệ thống admin.
          </p>
        </div>

        <div className="mt-10 rounded-[2rem] border border-slate-100 bg-white/90 p-3 shadow-xl shadow-slate-900/5 backdrop-blur">
          <div className="flex gap-3 overflow-x-auto p-1">
            <button
              type="button"
              onClick={() => setActiveCategoryId("all")}
              className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-2xl px-5 py-3 text-sm font-black transition ${
                activeCategoryId === "all"
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                  : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <span>🛒</span>
              Tất cả
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  activeCategoryId === "all"
                    ? "bg-white/15 text-white"
                    : "bg-white text-slate-500"
                }`}
              >
                {products.length}
              </span>
            </button>

            {categories.map((category) => {
              const count = products.filter(
                (product) => product.category_id === category.id
              ).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-2xl px-5 py-3 text-sm font-black transition ${
                    activeCategoryId === category.id
                      ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                      : "bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <span>{getCategoryIcon(category.slug)}</span>
                  {category.name}
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      activeCategoryId === category.id
                        ? "bg-white/15 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Đang xem
            </p>

            <h3 className="mt-1 text-2xl font-black text-slate-950">
              {activeCategoryName}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500">
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">
              {filteredProducts.length} sản phẩm
            </span>

            <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-600">
              Cập nhật từ admin
            </span>
          </div>
        </div>

        {featuredProduct && activeCategoryId === "all" && (
          <div className="mt-8 overflow-hidden rounded-[2.5rem] border border-emerald-100 bg-slate-950 shadow-2xl shadow-slate-950/15">
            <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[320px] bg-gradient-to-br from-emerald-100 to-sky-100">
                <Image
                  src={featuredProduct.image_url || "/images/product-rong-nho.png"}
                  alt={featuredProduct.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />

                {featuredProduct.badge && (
                  <div className="absolute left-6 top-6 rounded-full bg-white px-5 py-2 text-sm font-black uppercase tracking-wide text-emerald-700 shadow-xl">
                    {featuredProduct.badge}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center p-7 text-white md:p-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-300">
                  Sản phẩm nổi bật
                </p>

                <h3 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
                  {featuredProduct.name}
                </h3>

                <p className="mt-5 max-w-xl leading-8 text-slate-300">
                  {featuredProduct.description ||
                    "Sản phẩm rong nho LONG GS phù hợp cho gia đình, quán ăn và khách muốn nhập bán thử."}
                </p>

                <div className="mt-7 flex flex-wrap items-end gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Giá bán
                    </p>

                    <p className="mt-1 text-4xl font-black text-emerald-300">
                      {formatVND(featuredProduct.price)}
                    </p>
                  </div>

                  <a
                    href="#dat-hang"
                    className="rounded-2xl bg-white px-7 py-4 text-base font-black text-slate-950 transition hover:bg-emerald-100"
                  >
                    Đặt sản phẩm này
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[460px] animate-pulse rounded-[2rem] bg-slate-100"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-100 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                📦
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-950">
                Chưa có sản phẩm trong danh mục này
              </h3>

              <p className="mx-auto mt-3 max-w-md text-slate-500">
                Bạn có thể vào admin để thêm sản phẩm mới hoặc gắn sản phẩm vào
                danh mục tương ứng.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((item, index) => (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-sky-50">
                    <Image
                      src={item.image_url || "/images/product-rong-nho.png"}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                      {item.badge ? (
                        <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-wide text-emerald-700 shadow-lg backdrop-blur">
                          {item.badge}
                        </span>
                      ) : (
                        <span />
                      )}

                      {index === 0 && activeCategoryId === "all" && (
                        <span className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg">
                          Nổi bật
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {item.categories?.name || "Sản phẩm"}
                      </span>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        {item.weight}
                      </span>
                    </div>

                    <h3 className="min-h-[56px] text-xl font-black leading-tight text-slate-950">
                      {item.name}
                    </h3>

                    <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                      {item.description ||
                        "Sản phẩm phù hợp cho gia đình, quán ăn hoặc khách muốn nhập bán thử."}
                    </p>

                    <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Giá bán
                        </p>

                        <p className="mt-1 text-3xl font-black text-emerald-700">
                          {formatVND(item.price)}
                        </p>
                      </div>

                      <a
                        href="#dat-hang"
                        className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
                      >
                        Đặt
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
                Dành cho đại lý
              </p>

              <h3 className="mt-2 text-2xl font-black text-slate-950">
                Muốn nhập số lượng nhỏ để bán thử?
              </h3>

              <p className="mt-2 max-w-2xl text-slate-600">
                LONG GS hỗ trợ khách nhập thử, tư vấn sản phẩm phù hợp và cách
                giới thiệu rong nho cho khách hàng.
              </p>
            </div>

            <a
              href="#dat-hang"
              className="rounded-2xl bg-emerald-700 px-7 py-4 text-center font-black text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-800"
            >
              Liên hệ nhập đại lý
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function getCategoryIcon(slug: string) {
  if (slug.includes("combo")) return "🎁";
  if (slug.includes("nuoc")) return "🥣";
  if (slug.includes("qua")) return "🎀";
  if (slug.includes("dai-ly")) return "🏪";
  return "🌿";
}