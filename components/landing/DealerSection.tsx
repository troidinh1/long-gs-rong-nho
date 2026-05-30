export default function DealerSection() {
  return (
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
            Phù hợp cho người bán online, cửa hàng thực phẩm sạch, quán ăn, cộng
            tác viên hoặc đại lý nhỏ muốn bắt đầu với sản phẩm dễ tư vấn.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white/15 p-6 backdrop-blur-xl">
          <div className="grid gap-5">
            <InfoCard
              title="Nhập số lượng linh hoạt"
              desc="Có thể bắt đầu từ số lượng nhỏ để kiểm tra nhu cầu khách hàng."
            />
            <InfoCard
              title="Dễ bán trên mạng xã hội"
              desc="Phù hợp đăng Facebook, Zalo, TikTok, livestream hoặc bán theo combo gia đình."
            />
            <InfoCard
              title="Tư vấn nhanh qua Zalo"
              desc="Nhắn Zalo để được tư vấn giá nhập, cách bảo quản và cách giới thiệu sản phẩm."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 text-[#071027]">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-2 text-slate-500">{desc}</p>
    </div>
  );
}