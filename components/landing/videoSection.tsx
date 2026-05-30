export default function VideoSection() {
  return (
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
            Video giúp khách hàng hiểu sản phẩm nhanh hơn, tăng độ tin tưởng và
            dễ ra quyết định đặt hàng.
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
            <SmallVideo
              src="/videos/rong-nho-cach-an.mp4"
              title="Thưởng thức rong nho đúng cách"
              desc="Hướng dẫn sơ chế và cách ăn rong nho ngon nhất."
            />

            <SmallVideo
              src="/videos/rong-nho-salad.mp4"
              title="Rong nho LONG GS trong món salad"
              desc="Gợi ý món salad tươi ngon, bổ dưỡng từ rong nho."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SmallVideo({
  src,
  title,
  desc,
}: {
  src: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-4 shadow-xl shadow-slate-900/5">
      <div className="overflow-hidden rounded-[1.4rem] bg-slate-100">
        <video
          src={src}
          controls
          playsInline
          poster="/images/product-rong-nho.png"
          className="aspect-video w-full object-cover"
        />
      </div>

      <div className="px-1 pb-1 pt-4">
        <h3 className="text-lg font-black text-[#071027]">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}