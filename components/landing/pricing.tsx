import Image from "next/image";
import { products } from "./data";

export default function Pricing() {
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
        </div>

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

                  <p className="mt-1 text-base text-slate-500">{item.label}</p>

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
  );
}