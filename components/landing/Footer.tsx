export default function Footer() {
  return (
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
  );
}