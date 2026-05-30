"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || "Đăng nhập thất bại.");
        return;
      }

      window.location.href = "/admin";
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-900/10">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            LONG GS Admin
          </p>

          <h1 className="mt-3 text-3xl font-black">Đăng nhập quản trị</h1>

          <p className="mt-3 text-slate-500">
            Nhập mật khẩu admin để xem và quản lý đơn hàng.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 grid gap-4">
          <div>
            <label className="mb-2 block font-bold">Mật khẩu admin</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-2xl bg-emerald-700 px-6 py-4 font-black text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {message && (
            <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
              {message}
            </div>
          )}
        </form>

        <a
          href="/"
          className="mt-6 block text-center text-sm font-bold text-emerald-700 hover:underline"
        >
          Quay lại website
        </a>
      </div>
    </main>
  );
}