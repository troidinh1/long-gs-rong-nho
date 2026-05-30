import { faqs } from "./data";

export default function FAQ() {
  return (
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
  );
}