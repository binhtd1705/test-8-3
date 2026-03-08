import type { Metadata } from "next";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chúc Mừng 8/3 | Nguyễn Thị Phượng",
  description:
    "Nhân ngày Quốc tế Phụ nữ 8 tháng 3 năm 2026, gửi đến bạn lời chúc yêu thương nhất ❤️",
  openGraph: {
    title: "Chúc Mừng 8/3 · Nguyễn Thị Phượng",
    description: "Nhân ngày Quốc tế Phụ nữ 8/3/2026",
    images: [
      {
        url: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&q=80",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
