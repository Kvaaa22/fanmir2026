import type { Metadata } from "next";
import { bitter, montserrat } from "./fonts";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CallbackPopup } from "@/components/CallbackPopup/CallbackPopup";
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

      <body>
        <Header />
        <main className="page">{children}</main>
        <Footer />
        <CallbackPopup />
      </body>

    </html>
  );
}
