import { feedbacks } from "./data";

export default function Feedback() {
  return (
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
  );
}