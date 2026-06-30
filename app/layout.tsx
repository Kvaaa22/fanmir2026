import type { Metadata } from "next";
import { bitter, montserrat } from "./fonts";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CallbackPopup } from "@/components/CallbackPopup/CallbackPopup";
import {
  localBusinessJsonLd,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/seo/site";
import "./globals.css";
import "./general.css";

const localBusinessJson = JSON.stringify(localBusinessJsonLd).replace(
  /</g,
  "\\u003c"
);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "фанера Красноярск",
    "купить фанеру",
    "распил фанеры",
    "листовые материалы",
    "OSB Красноярск",
  ],
  creator: siteName,
  publisher: siteName,
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/img/hero/slideInStock.webp",
        width: 1365,
        height: 694,
        alt: "Фанера и листовые материалы в наличии",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/img/hero/slideInStock.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: localBusinessJson }}
        />
        <Header />
        <main className="page">{children}</main>
        <Footer />
        <CallbackPopup />
      </body>

    </html>
  );
}
