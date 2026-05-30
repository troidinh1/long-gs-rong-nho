"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Category, CategoryFormData } from "@/types/category";

const emptyForm: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  is_active: true,
  sort_order: "0",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<CategoryFormData>(emptyForm);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchCategories() {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("/api/admin/categories");
      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không lấy được danh mục.");
        return;
      }

      setCategories(result.categories || []);
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi khi tải danh mục.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "name" && !editingCategoryId) {
        return {
          ...prev,
          name: value,
          slug: createSlug(value),
        };
      }

      if (name === "slug") {
        return {
          ...prev,
          slug: createSlug(value),
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  }

  function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const { checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      is_active: checked,
    }));
  }

  function startCreate() {
    setEditingCategoryId(null);
    setFormData(emptyForm);
    setMessage("");
  }

  function startEdit(category: Category) {
    setEditingCategoryId(category.id);

    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      is_active: category.is_active,
      sort_order: String(category.sort_order),
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
      const isEditMode = Boolean(editingCategoryId);

      const url = isEditMode
        ? `/api/admin/categories/${editingCategoryId}`
        : "/api/admin/categories";

      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          is_active: formData.is_active,
          sort_order: Number(formData.sort_order || 0),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Lưu danh mục thất bại.");
        return;
      }

      setMessage(
        isEditMode ? "Cập nhật danh mục thành công." : "Tạo danh mục thành công."
      );

      setEditingCategoryId(null);
      setFormData(emptyForm);
      await fetchCategories();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi lưu danh mục.");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleCategory(category: Category) {
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          is_active: !category.is_active,
          sort_order: category.sort_order,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Không thể đổi trạng thái danh mục.");
        return;
      }

      setMessage(category.is_active ? "Đã ẩn danh mục." : "Đã hiện danh mục.");
      await fetchCategories();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi đổi trạng thái danh mục.");
    }
  }

  async function deleteCategory(categoryId: string) {
    const isConfirmed = window.confirm(
      "Bạn có chắc muốn xóa danh mục này không?"
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      const text = await response.text();

      let result;

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        result = {
          message: "API xóa danh mục không trả về JSON hợp lệ.",
        };
      }

      if (!response.ok) {
        setMessage(result.message || "Không thể xóa danh mục.");
        return;
      }

      setMessage(result.message || "Xóa danh mục thành công.");
      await fetchCategories();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi xóa danh mục.");
    }
  }

  return (
    <div className="grid gap-8">
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              {editingCategoryId ? "Update Category" : "Create Category"}
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {editingCategoryId ? "Sửa danh mục" : "Thêm danh mục mới"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Dùng để phân nhóm sản phẩm như rong nho, combo, nước chấm, quà
              tặng.
            </p>
          </div>

          {editingCategoryId && (
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
            <label className="mb-2 block font-bold">Tên danh mục</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Rong nho"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold">Slug</label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="Ví dụ: rong-nho"
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

          <label className="flex items-center gap-3 font-bold md:self-end">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={handleCheckboxChange}
              className="h-5 w-5"
            />
            Hiển thị danh mục
          </label>

          <div className="md:col-span-2">
            <label className="mb-2 block font-bold">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Mô tả ngắn về danh mục..."
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
                : editingCategoryId
                ? "Cập nhật danh mục"
                : "Tạo danh mục"}
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
            <h2 className="text-2xl font-black">Danh sách danh mục</h2>
            <p className="mt-1 text-slate-500">
              Quản lý nhóm sản phẩm hiển thị trên website.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchCategories}
            className="cursor-pointer rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50"
          >
            Tải lại
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center font-bold">Đang tải danh mục...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center font-bold">Chưa có danh mục nào.</div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="p-4">Thứ tự</th>
                    <th className="p-4">Tên danh mục</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Mô tả</th>
                    <th className="p-4">Hiển thị</th>
                    <th className="p-4">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-slate-100">
                      <td className="p-4 font-bold">{category.sort_order}</td>

                      <td className="p-4 font-black">{category.name}</td>

                      <td className="p-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                          {category.slug}
                        </span>
                      </td>

                      <td className="max-w-[360px] p-4 text-slate-600">
                        {category.description || "Không có mô tả"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            category.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {category.is_active ? "Đang hiện" : "Đang ẩn"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(category)}
                            className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                          >
                            Sửa
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleCategory(category)}
                            className="cursor-pointer rounded-xl bg-amber-50 px-3 py-2 text-sm font-black text-amber-700 transition hover:bg-amber-100"
                          >
                            {category.is_active ? "Ẩn" : "Hiện"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteCategory(category.id)}
                            className="cursor-pointer rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
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
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{category.name}</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">
                        /{category.slug}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        category.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {category.is_active ? "Đang hiện" : "Đang ẩn"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    {category.description || "Không có mô tả"}
                  </p>

                  <p className="mt-3 text-sm font-bold text-slate-500">
                    Thứ tự: {category.sort_order}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                    >
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="cursor-pointer rounded-xl bg-amber-50 px-3 py-2 text-sm font-black text-amber-700 transition hover:bg-amber-100"
                    >
                      {category.is_active ? "Ẩn" : "Hiện"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteCategory(category.id)}
                      className="cursor-pointer rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-100"
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