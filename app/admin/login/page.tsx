"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("hmq2507@gmail.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);
    setMessage("");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Email hoặc mật khẩu không đúng.");
      setIsLoading(false);
      return;
    }

    const adminEmail = "hmq2507@gmail.com";

    if (data.user.email !== adminEmail) {
      await supabase.auth.signOut();
      setMessage("Tài khoản này không có quyền admin.");
      setIsLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7fffb] px-4 py-10 text-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#bbf7d0_0%,transparent_32%),radial-gradient(circle_at_bottom_right,#bae6fd_0%,transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]" />
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl" />

      <section className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-white bg-white/80 shadow-2xl shadow-slate-950/10 backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-3xl bg-white shadow-xl">
                  <Image
                    src="/images/logo-long-gs.png"
                    alt="LONG GS"
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </div>

                <div>
                  <p className="text-2xl font-black">
                    LONG <span className="text-emerald-400">GS</span>
                  </p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                    Admin Dashboard
                  </p>
                </div>
              </div>

              <h1 className="mt-12 text-4xl font-black leading-tight">
                Quản lý đơn hàng, sản phẩm và dữ liệu bán hàng.
              </h1>

              <p className="mt-5 leading-8 text-slate-300">
                Đăng nhập để xem đơn hàng mới, cập nhật trạng thái, quản lý sản
                phẩm, upload ảnh và theo dõi hoạt động bán hàng của LONG GS.
              </p>
            </div>

            <div className="grid gap-3 text-sm font-bold text-slate-300">
              <div className="rounded-2xl bg-white/10 p-4">
                ✅ Bảo vệ bằng Supabase Auth
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                ✅ Chỉ email admin được truy cập
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                ✅ Quản lý sản phẩm và đơn hàng
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center lg:hidden">
                <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-emerald-100">
                  <Image
                    src="/images/logo-long-gs.png"
                    alt="LONG GS"
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </div>

                <p className="mt-4 text-2xl font-black">
                  LONG <span className="text-emerald-700">GS</span>
                </p>
              </div>

              <p className="text-center text-sm font-black uppercase tracking-[0.22em] text-emerald-700">
                Admin Login
              </p>

              <h2 className="mt-3 text-center text-4xl font-black tracking-tight">
                Đăng nhập quản trị
              </h2>

              <p className="mx-auto mt-4 max-w-sm text-center leading-7 text-slate-500">
                Sử dụng tài khoản admin đã tạo trong Supabase Auth để truy cập
                dashboard.
              </p>

              <form onSubmit={handleLogin} className="mt-8 grid gap-4">
                <div>
                  <label className="mb-2 block font-black">Email admin</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@email.com"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu admin..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer rounded-2xl bg-emerald-700 px-6 py-4 font-black text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="mt-6 block text-center text-sm font-black text-emerald-700 transition hover:text-emerald-900 hover:underline"
              >
                Quay lại website
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}