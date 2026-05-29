import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LONG GS | Rong nho Nha Trang",
  description:
    "LONG GS - Rong nho sạch, giòn ngon, đặc sản biển Nha Trang - Khánh Hòa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}