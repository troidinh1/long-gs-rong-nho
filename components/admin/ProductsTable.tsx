"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { formatVND } from "@/lib/money";
import { Category } from "@/types/category";
import { Product, ProductFormData } from "@/types/product";

const emptyForm: ProductFormData = {
  name: "",
  weight: "",
  price: "",
  description: "",
  image_url: "/images/product-rong-nho.png",
  badge: "",
  is_active: true,
  sort_order: "0",
  category_id: "",
};

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchProducts() {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("/api/admin/products");
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không lấy được sản phẩm.");
        return;
      }

      setProducts(result.products || []);
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi khi tải danh sách sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("/api/admin/categories");
      const result = await response.json();

      if (!response.ok) {
        console.error(result.message || "Không lấy được danh mục.");
        return;
      }

      const categoryList: Category[] = result.categories || [];
      setCategories(categoryList);

      setFormData((prev) => {
        if (prev.category_id) return prev;

        return {
          ...prev,
          category_id: categoryList[0]?.id || "",
        };
      });
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const { checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      is_active: checked,
    }));
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsUploading(true);
    setMessage("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/admin/upload-product-image", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Upload ảnh thất bại.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image_url: result.imageUrl,
      }));

      setMessage("Upload ảnh thành công. Link ảnh đã được điền vào form.");
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi upload ảnh.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  function startCreate() {
    setEditingProductId(null);
    setFormData({
      ...emptyForm,
      category_id: categories[0]?.id || "",
    });
    setMessage("");
  }

  function startEdit(product: Product) {
    setEditingProductId(product.id);

    setFormData({
      name: product.name,
      weight: product.weight,
      price: String(product.price),
      description: product.description || "",
      image_url: product.image_url || "/images/product-rong-nho.png",
      badge: product.badge || "",
      is_active: product.is_active,
      sort_order: String(product.sort_order),
      category_id: product.category_id || "",
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
      const isEditMode = Boolean(editingProductId);

      const url = isEditMode
        ? `/api/admin/products/${editingProductId}`
        : "/api/admin/products";

      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          weight: formData.weight,
          price: Number(formData.price || 0),
          description: formData.description,
          image_url: formData.image_url || "/images/product-rong-nho.png",
          badge: formData.badge,
          is_active: formData.is_active,
          sort_order: Number(formData.sort_order || 0),
          category_id: formData.category_id || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Lưu sản phẩm thất bại.");
        return;
      }

      setMessage(
        isEditMode ? "Cập nhật sản phẩm thành công." : "Tạo sản phẩm thành công."
      );

      setEditingProductId(null);
      setFormData({
        ...emptyForm,
        category_id: categories[0]?.id || "",
      });
      await fetchProducts();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi lưu sản phẩm.");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleProduct(product: Product) {
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name,
          weight: product.weight,
          price: product.price,
          description: product.description || "",
          image_url: product.image_url || "/images/product-rong-nho.png",
          badge: product.badge || "",
          is_active: !product.is_active,
          sort_order: product.sort_order,
          category_id: product.category_id || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không thể đổi trạng thái sản phẩm.");
        return;
      }

      setMessage(product.is_active ? "Đã ẩn sản phẩm." : "Đã hiện sản phẩm.");
      await fetchProducts();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi đổi trạng thái sản phẩm.");
    }
  }

  async function deleteProduct(productId: string) {
    const isConfirmed = window.confirm(
      "Bạn có chắc muốn xóa sản phẩm này không?"
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không thể xóa sản phẩm.");
        return;
      }

      setMessage("Xóa sản phẩm thành công.");
      await fetchProducts();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi xóa sản phẩm.");
    }
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              {editingProductId ? "Update Product" : "Create Product"}
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {editingProductId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sản phẩm ở đây sẽ hiển thị tự động trên trang chủ theo danh mục.
            </p>
          </div>

          {editingProductId && (
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
            <label className="mb-2 block font-bold">Tên sản phẩm</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Rong nho LONG GS 500g"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Danh mục</label>
            <select
              name="category_id"
              value={formData.category_id || ""}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="">Chưa chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {categories.length === 0 && (
              <p className="mt-2 text-sm font-bold text-red-500">
                Chưa có danh mục. Hãy tạo danh mục trước.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-bold">Khối lượng</label>
            <input
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              placeholder="Ví dụ: 500g"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Giá</label>
            <input
              name="price"
              type="number"
              min={0}
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="Ví dụ: 150000"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Nhãn</label>
            <input
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="Ví dụ: Bán chạy"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Thứ tự hiển thị</label>
            <input
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleChange}
              placeholder="Ví dụ: 1"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-bold">Ảnh sản phẩm</label>

            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="/images/product-rong-nho.png hoặc link ảnh Supabase"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              <label
                className={`flex cursor-pointer items-center justify-center rounded-2xl px-4 py-3 text-center font-black text-white transition ${
                  isUploading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-slate-900 hover:bg-emerald-700"
                }`}
              >
                {isUploading ? "Đang upload..." : "Upload ảnh"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {formData.image_url && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="mb-2 text-sm font-bold text-slate-500">
                  Xem trước ảnh:
                </p>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.image_url}
                  alt="Xem trước sản phẩm"
                  className="h-44 w-full rounded-xl object-contain"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 font-bold md:col-span-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={handleCheckboxChange}
              className="h-5 w-5"
            />
            Hiển thị sản phẩm trên trang chủ
          </label>

          <div className="md:col-span-2">
            <label className="mb-2 block font-bold">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Mô tả ngắn về sản phẩm..."
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="rounded-2xl bg-emerald-700 px-6 py-3 font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "Đang lưu..."
                : editingProductId
                ? "Cập nhật sản phẩm"
                : "Tạo sản phẩm"}
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
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black">Danh sách sản phẩm</h2>
            <p className="mt-1 text-slate-500">
              Quản lý sản phẩm đang hiển thị trên landing page.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProducts}
            className="rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50"
          >
            Tải lại
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center font-bold">
            Đang tải danh sách sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center font-bold">Chưa có sản phẩm nào.</div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1200px] border-collapse text-left">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="p-4">Thứ tự</th>
                    <th className="p-4">Ảnh</th>
                    <th className="p-4">Tên sản phẩm</th>
                    <th className="p-4">Danh mục</th>
                    <th className="p-4">Khối lượng</th>
                    <th className="p-4">Giá</th>
                    <th className="p-4">Nhãn</th>
                    <th className="p-4">Hiển thị</th>
                    <th className="p-4">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-slate-100">
                      <td className="p-4 font-bold">{product.sort_order}</td>

                      <td className="p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            product.image_url || "/images/product-rong-nho.png"
                          }
                          alt={product.name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      </td>

                      <td className="p-4">
                        <p className="font-black">{product.name}</p>
                        <p className="mt-1 max-w-[320px] text-sm text-slate-500">
                          {product.description || "Không có mô tả"}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          {product.categories?.name || "Chưa gắn"}
                        </span>
                      </td>

                      <td className="p-4 font-semibold">{product.weight}</td>

                      <td className="p-4 font-black text-emerald-700">
                        {formatVND(product.price)}
                      </td>

                      <td className="p-4">{product.badge || "Không có"}</td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            product.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {product.is_active ? "Đang hiện" : "Đang ẩn"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                          >
                            Sửa
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleProduct(product)}
                            className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-black text-amber-700 transition hover:bg-amber-100"
                          >
                            {product.is_active ? "Ẩn" : "Hiện"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteProduct(product.id)}
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
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image_url || "/images/product-rong-nho.png"}
                      alt={product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-black">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {product.weight} - {formatVND(product.price)}
                      </p>
                      <p className="mt-1 text-sm font-bold text-emerald-700">
                        {product.categories?.name || "Chưa gắn danh mục"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    {product.description || "Không có mô tả"}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        product.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {product.is_active ? "Đang hiện" : "Đang ẩn"}
                    </span>

                    <span className="text-sm font-bold text-slate-500">
                      Thứ tự: {product.sort_order}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                    >
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleProduct(product)}
                      className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-black text-amber-700 transition hover:bg-amber-100"
                    >
                      {product.is_active ? "Ẩn" : "Hiện"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
                    >
                      Xóa
                    </button>
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