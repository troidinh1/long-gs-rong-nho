import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://long-gs-rong-nho.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "LONG GS | Rong nho Nha Trang - Khánh Hòa",
    template: "%s | LONG GS",
  },

  description:
    "LONG GS cung cấp rong nho sạch, xanh giòn, dễ ăn, phù hợp dùng gia đình, quán ăn và đại lý nhỏ. Đặc sản biển Nha Trang - Khánh Hòa.",

  keywords: [
    "LONG GS",
    "rong nho",
    "rong nho Nha Trang",
    "rong nho Khánh Hòa",
    "rong nho sạch",
    "đặc sản biển",
    "thực phẩm sạch",
    "đại lý rong nho",
  ],

  authors: [{ name: "LONG GS" }],
  creator: "LONG GS",
  publisher: "LONG GS",

  openGraph: {
    title: "LONG GS | Rong nho Nha Trang - Khánh Hòa",
    description:
      "Rong nho LONG GS xanh giòn, dễ ăn, phù hợp dùng gia đình, quán ăn và đại lý nhỏ. Nhận đặt hàng và tư vấn qua Zalo.",
    url: siteUrl,
    siteName: "LONG GS",
    images: [
      {
        url: "/images/og-long-gs.png",
        width: 1200,
        height: 630,
        alt: "LONG GS - Rong nho Nha Trang Khánh Hòa",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "LONG GS | Rong nho Nha Trang - Khánh Hòa",
    description:
      "Rong nho LONG GS xanh giòn, dễ ăn, phù hợp dùng gia đình, quán ăn và đại lý nhỏ.",
    images: ["/images/og-long-gs.png"],
  },

  icons: {
    icon: "/images/logo-long-gs.png",
    shortcut: "/images/logo-long-gs.png",
    apple: "/images/logo-long-gs.png",
  },

  alternates: {
    canonical: siteUrl,
  },
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