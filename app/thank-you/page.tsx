import Link from "next/link";

const zaloPhone = "0896456068";
const zaloLink = `https://zalo.me/${zaloPhone}`;

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,#d8fff3_0%,#f5fffc_35%,#ffffff_70%)] px-4 py-10 text-[#071027] md:px-8">
      <section className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-emerald-100 bg-white p-7 text-center shadow-2xl shadow-emerald-900/10 md:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
            ✅
          </div>

          <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Đặt hàng thành công
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Cảm ơn bạn đã gửi thông tin cho LONG GS!
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Đơn hàng của bạn đã được ghi nhận. LONG GS sẽ liên hệ lại qua số
            điện thoại bạn đã để lại để tư vấn, xác nhận sản phẩm và hỗ trợ giao
            hàng.
          </p>

          <div className="mt-8 grid gap-4 rounded-3xl bg-emerald-50 p-5 text-left md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5">
              <p className="text-2xl">📞</p>
              <h3 className="mt-3 font-black">Bước 1</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                LONG GS kiểm tra thông tin đặt hàng.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-2xl">💬</p>
              <h3 className="mt-3 font-black">Bước 2</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Nhân viên liên hệ tư vấn và xác nhận đơn.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <p className="text-2xl">🚚</p>
              <h3 className="mt-3 font-black">Bước 3</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Chốt đơn và hỗ trợ giao hàng phù hợp.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={zaloLink}
              target="_blank"
              className="rounded-2xl bg-emerald-700 px-7 py-4 text-center font-black text-white shadow-xl shadow-emerald-900/20 transition hover:bg-emerald-800"
            >
              Nhắn Zalo để được tư vấn nhanh
            </a>

            <Link
              href="/"
              className="rounded-2xl border border-emerald-200 bg-white px-7 py-4 text-center font-black text-emerald-700 transition hover:bg-emerald-50"
            >
              Quay lại trang chủ
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Zalo hỗ trợ:{" "}
            <span className="font-black text-emerald-700">{zaloPhone}</span>
          </p>
        </div>
      </section>
    </main>
  );
}