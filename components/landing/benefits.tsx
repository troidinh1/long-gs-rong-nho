import { benefits } from "./data";

export default function Benefits() {
  return (
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
  );
}