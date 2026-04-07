import type { Metadata } from "next";
import { bitter, montserrat } from "./fonts";
import "./globals.css";
import "./general.css";

export const metadata: Metadata = {
  title: "Фанерный мир",
  description: "Продажа фанеры, раскрой по размерам и доставка по Красноярску.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${montserrat.variable} ${bitter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
