"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const zaloPhone = "0896456068";
const zaloLink = `https://zalo.me/${zaloPhone}`;

const products = [
  {
    weight: "250g",
    label: "Dùng thử",
    price: "80.000đ",
    image: "/images/product-rong-nho.png",
    icon: "🥫",
  },
  {
    weight: "500g",
    label: "Gia đình",
    price: "150.000đ",
    image: "/images/product-rong-nho.png",
    icon: "👨‍👩‍👧",
  },
  {
    weight: "1kg",
    label: "Đại lý",
    price: "300.000đ",
    image: "/images/product-rong-nho.png",
    icon: "🏪",
  },
];

const benefits = [
  {
    title: "Xanh giòn tự nhiên",
    desc: "Rong nho có độ giòn mát, vị biển nhẹ, dễ dùng trong bữa ăn hằng ngày.",
  },
  {
    title: "Dễ chế biến",
    desc: "Có thể ăn cùng nước chấm, salad, hải sản, cơm gia đình hoặc món healthy.",
  },
  {
    title: "Phù hợp bán online",
    desc: "Sản phẩm dễ tư vấn, dễ tạo combo và phù hợp cho khách mua dùng thử.",
  },
  {
    title: "Nhận đại lý nhỏ",
    desc: "Hỗ trợ người mới muốn nhập số lượng nhỏ để bán thử trên Facebook, Zalo, TikTok.",
  },
];

const feedbacks = [
  {
    name: "Chị Hương - Nha Trang",
    text: "Rong nho ăn giòn, vị dễ chịu, ngâm lại vẫn đẹp. Gia đình mình rất thích.",
  },
  {
    name: "Anh Nam - TP.HCM",
    text: "Đóng gói cẩn thận, tư vấn nhanh. Mình mua gói 500g dùng rất tiện.",
  },
  {
    name: "Cô Lan - Đại lý nhỏ",
    text: "Sản phẩm dễ bán, khách mua thử xong quay lại đặt thêm. Giá nhập phù hợp.",
  },
];

const faqs = [
  {
    q: "Rong nho LONG GS dùng như thế nào?",
    a: "Bạn chỉ cần ngâm rong nho trong nước sạch vài phút, sau đó để ráo và dùng cùng nước chấm, salad hoặc món ăn yêu thích.",
  },
  {
    q: "Rong nho có bị tanh không?",
    a: "Rong nho có vị biển nhẹ tự nhiên. Khi sơ chế đúng cách và dùng cùng nước chấm thì rất dễ ăn.",
  },
  {
    q: "Có nhận giao hàng không?",
    a: "Có. Bạn có thể nhắn Zalo để được tư vấn đơn hàng, số lượng và hình thức giao phù hợp.",
  },
  {
    q: "Tôi muốn làm đại lý nhỏ được không?",
    a: "Được. LONG GS hỗ trợ khách muốn nhập thử số lượng nhỏ để bán online hoặc bán tại cửa hàng.",
  },
];

export default function Home() {
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

      const result = await response.json();

      if (!response.ok) {
        setIsSuccess(false);
        setOrderMessage(result.message || "Gửi đơn hàng thất bại.");
        return;
      }

      setIsSuccess(true);
      setOrderMessage("Đặt hàng thành công! LONG GS sẽ liên hệ lại sớm.");
      form.reset();
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setOrderMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#071027]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white shadow-md ring-1 ring-emerald-100">
              <Image
                src="/images/logo-long-gs.png"
                alt="Logo LONG GS"
                fill
                sizes="48px"
                priority
                className="object-contain p-1"
              />
            </div>

            <div>
              <p className="text-xl font-black leading-none text-emerald-700">
                LONG GS
              </p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Rong nho Nha Trang
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-10 text-[17px] font-black text-[#071027] md:flex">
            <a href="#bang-gia" className="transition hover:text-emerald-700">
              Bảng giá
            </a>
            <a href="#loi-ich" className="transition hover:text-emerald-700">
              Lợi ích
            </a>
            <a href="#dai-ly" className="transition hover:text-emerald-700">
              Đại lý
            </a>
            <a href="#dat-hang" className="transition hover:text-emerald-700">
              Đặt hàng
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#dat-hang"
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-emerald-100 bg-white text-xl shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-50"
              aria-label="Giỏ hàng"
            >
              🛒
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-black text-white">
                3
              </span>
            </a>

            <a
              href={zaloLink}
              target="_blank"
              className="rounded-full bg-emerald-700 px-7 py-3 text-base font-black text-white shadow-xl shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              Zalo ngay
            </a>
          </div>
        </div>

        {/* CHỮ CHẠY */}
        <div className="overflow-hidden bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-600 py-3 text-white">
          <div className="marquee flex min-w-max items-center gap-4 whitespace-nowrap text-sm font-bold md:text-base">
            <span>📢</span>
            <span>
              Rong nho LONG GS - Đặc sản biển Nha Trang, Khánh Hòa • Nhận đơn
              gia đình, quán ăn và đại lý nhỏ • Giao hàng nhanh toàn quốc
            </span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,#d8fff3_0%,#f5fffc_35%,#ffffff_70%)]">
        <div className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-sky-100 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-emerald-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-14 md:grid-cols-2 md:items-center md:px-8 md:py-20">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-300 bg-white/80 px-5 py-3 text-sm font-black text-emerald-700 shadow-sm md:text-base">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                🌿
              </span>
              Thực phẩm sạch từ biển Nha Trang - Khánh Hòa
            </div>

            <h1 className="mt-8 max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-[#071027] md:text-7xl">
              Rong nho LONG GS{" "}
              <span className="text-emerald-700">xanh giòn</span>, dễ ăn, dễ
              bán.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-9 text-slate-600">
              LONG GS cung cấp rong nho cho khách dùng gia đình, quán ăn và đại
              lý nhỏ. Giao diện đặt hàng nhanh, tư vấn trực tiếp qua Zalo, phù
              hợp để quảng cáo và chốt đơn.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#dat-hang"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-700 px-8 py-4 text-base font-black text-white shadow-2xl shadow-emerald-900/20 transition hover:-translate-y-1 hover:bg-emerald-800"
              >
                🛒 Đặt hàng ngay
              </a>

              <a
                href="#bang-gia"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-400 bg-white/80 px-8 py-4 text-base font-black text-emerald-700 shadow-sm transition hover:-translate-y-1 hover:bg-emerald-50"
              >
                🏷️ Xem bảng giá
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {products.map((item) => (
                <div
                  key={item.weight}
                  className="rounded-3xl border border-slate-100 bg-white/90 p-4 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
                    {item.icon}
                  </div>
                  <p className="text-2xl font-black text-emerald-700">
                    {item.weight}
                  </p>
                  <p className="text-sm font-medium text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-[2.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-sky-50 p-4 shadow-2xl shadow-emerald-900/10 md:p-6">
              <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white">
                <Image
                  src="/images/product-rong-nho.png"
                  alt="Rong nho LONG GS"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="absolute bottom-7 left-1/2 w-[88%] -translate-x-1/2 rounded-[1.7rem] border border-emerald-100 bg-white/95 p-4 shadow-2xl shadow-emerald-900/20 backdrop-blur md:w-[380px]">
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                  🛍️
                </div>

                <div>
                  <p className="text-lg font-black leading-tight text-[#071027]">
                    Combo bán chạy hôm nay
                  </p>
                  <p className="mt-1 text-base font-medium text-slate-500">
                    Rong nho 500g chỉ{" "}
                    <span className="font-black text-emerald-700">
                      150.000đ
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BẢNG GIÁ */}
        <div
          id="bang-gia"
          className="relative mx-auto max-w-7xl px-4 pb-16 md:px-8"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((item) => (
              <div
                key={item.weight}
                className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-7 shadow-2xl shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-emerald-900/10"
              >
                <div className="grid grid-cols-2 items-center gap-4">
                  <div>
                    <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
                      {item.label}
                    </span>

                    <h3 className="mt-6 text-4xl font-black text-[#071027]">
                      {item.weight}
                    </h3>

                    <p className="mt-1 text-base text-slate-500">
                      {item.label}
                    </p>

                    <p className="mt-4 text-3xl font-black text-emerald-700">
                      {item.price}
                    </p>
                  </div>

                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={`Rong nho LONG GS ${item.weight}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 180px"
                      className="object-contain drop-shadow-xl transition group-hover:scale-105"
                    />
                  </div>
                </div>

                <a
                  href="#dat-hang"
                  className="mt-6 block rounded-2xl bg-[#071027] px-6 py-4 text-center font-black text-white transition hover:bg-emerald-700"
                >
                  Đặt gói này
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section className="bg-white px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Video sản phẩm
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#071027] md:text-5xl">
              Xem rong nho LONG GS thực tế
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-500">
              Video giúp khách hàng hiểu sản phẩm nhanh hơn, tăng độ tin tưởng
              và dễ ra quyết định đặt hàng.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
            <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-2xl shadow-slate-900/8">
              <div className="overflow-hidden rounded-[1.5rem] bg-slate-950">
                <video
                  src="/videos/rong-nho-demo.mp4"
                  controls
                  playsInline
                  poster="/images/product-rong-nho.png"
                  className="aspect-video w-full object-cover"
                />
              </div>

              <div className="px-1 pb-2 pt-5">
                <h3 className="text-xl font-black text-[#071027]">
                  Rong nho LONG GS - Tươi xanh, giòn mát tự nhiên
                </h3>
                <p className="mt-2 text-base text-slate-500">
                  Giới thiệu rong nho LONG GS tươi xanh, đạt chuẩn chất lượng,
                  giữ trọn hương vị biển.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-xl shadow-slate-900/5">
                <div className="overflow-hidden rounded-[1.4rem] bg-slate-100">
                  <video
                    src="/videos/rong-nho-cach-an.mp4"
                    controls
                    playsInline
                    poster="/images/product-rong-nho.png"
                    className="aspect-video w-full object-cover"
                  />
                </div>

                <div className="px-1 pb-1 pt-4">
                  <h3 className="text-lg font-black text-[#071027]">
                    Thưởng thức rong nho đúng cách
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Hướng dẫn sơ chế và cách ăn rong nho ngon nhất.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-xl shadow-slate-900/5">
                <div className="overflow-hidden rounded-[1.4rem] bg-slate-100">
                  <video
                    src="/videos/rong-nho-salad.mp4"
                    controls
                    playsInline
                    poster="/images/product-rong-nho.png"
                    className="aspect-video w-full object-cover"
                  />
                </div>

                <div className="px-1 pb-1 pt-4">
                  <h3 className="text-lg font-black text-[#071027]">
                    Rong nho LONG GS trong món salad
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Gợi ý món salad tươi ngon, bổ dưỡng từ rong nho.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LỢI ÍCH */}
      <section id="loi-ich" className="bg-emerald-50/70 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
                Lợi ích
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#071027] md:text-5xl">
                Vì sao khách hàng chọn LONG GS?
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Rong nho là sản phẩm dễ dùng, dễ giới thiệu và phù hợp với xu
                hướng ăn sạch, ăn nhẹ, ăn healthy.
              </p>

              <a
                href="#dat-hang"
                className="mt-8 inline-flex rounded-2xl bg-emerald-700 px-8 py-4 font-black text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-800"
              >
                Tư vấn đặt hàng
              </a>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {benefits.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-black text-emerald-700">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-black text-[#071027]">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ĐẠI LÝ */}
      <section
        id="dai-ly"
        className="bg-gradient-to-br from-emerald-700 via-teal-700 to-sky-700 px-4 py-20 text-white md:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100">
              Dành cho đại lý nhỏ
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Muốn nhập rong nho bán thử? LONG GS có thể hỗ trợ.
            </h2>

            <p className="mt-6 text-lg leading-9 text-emerald-50">
              Phù hợp cho người bán online, cửa hàng thực phẩm sạch, quán ăn,
              cộng tác viên hoặc đại lý nhỏ muốn bắt đầu với sản phẩm dễ tư vấn.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/15 p-6 backdrop-blur-xl">
            <div className="grid gap-5">
              <div className="rounded-3xl bg-white p-6 text-[#071027]">
                <h3 className="text-xl font-black">Nhập số lượng linh hoạt</h3>
                <p className="mt-2 text-slate-500">
                  Có thể bắt đầu từ số lượng nhỏ để kiểm tra nhu cầu khách hàng.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 text-[#071027]">
                <h3 className="text-xl font-black">Dễ bán trên mạng xã hội</h3>
                <p className="mt-2 text-slate-500">
                  Phù hợp đăng Facebook, Zalo, TikTok, livestream hoặc bán theo
                  combo gia đình.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 text-[#071027]">
                <h3 className="text-xl font-black">Tư vấn nhanh qua Zalo</h3>
                <p className="mt-2 text-slate-500">
                  Nhắn Zalo để được tư vấn giá nhập, cách bảo quản và cách giới
                  thiệu sản phẩm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="bg-white px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              Feedback
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#071027] md:text-5xl">
              Khách hàng nói gì?
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {feedbacks.map((item) => (
              <div
                key={item.name}
                className="rounded-[2rem] border border-emerald-100 bg-white p-7 shadow-xl shadow-slate-900/5"
              >
                <p className="text-xl">⭐⭐⭐⭐⭐</p>
                <p className="mt-5 leading-8 text-slate-600">“{item.text}”</p>
                <p className="mt-6 font-black text-emerald-700">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-sky-50 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
              FAQ
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#071027] md:text-5xl">
              Câu hỏi thường gặp
            </h2>
          </div>

          <div className="mt-12 grid gap-5">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-900/5"
              >
                <summary className="cursor-pointer list-none text-lg font-black text-[#071027]">
                  {item.q}
                </summary>

                <p className="mt-4 leading-8 text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FORM */}
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
              LONG GS sẽ liên hệ lại để tư vấn và chốt đơn.
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

      {/* FOOTER */}
      <footer className="bg-[#071027] px-4 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-black text-emerald-300">LONG GS</p>
            <p className="mt-2 text-slate-400">
              Rong nho / thực phẩm sạch / đặc sản biển Nha Trang - Khánh Hòa
            </p>
          </div>

          <div className="text-sm leading-7 text-slate-300">
            <p>Zalo: 0896456068</p>
            <p>Email: hmq2507@gmail.com</p>
            <p>Trần Phú, Nha Trang, Khánh Hòa</p>
          </div>
        </div>
      </footer>

      {/* MOBILE BUTTON */}
      <div className="fixed bottom-5 left-4 right-4 z-50 grid grid-cols-[56px_1fr] gap-3 md:hidden">
        <a
          href="#dat-hang"
          className="relative flex h-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xl shadow-slate-900/20"
          aria-label="Giỏ hàng"
        >
          🛒
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-[11px] font-black text-white">
            3
          </span>
        </a>

        <a
          href={zaloLink}
          target="_blank"
          className="flex h-14 items-center justify-center rounded-2xl bg-emerald-700 px-6 text-center font-black text-white shadow-2xl shadow-emerald-900/30"
        >
          Nhắn Zalo đặt hàng
        </a>
      </div>
    </main>
  );
}
