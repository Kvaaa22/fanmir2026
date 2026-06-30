import type { Metadata } from "next";

export const siteName = "Фанерный мир";
export const siteDescription =
  "Продажа фанеры, раскрой по размерам и доставка по Красноярску.";
export const siteUrl = "https://xn--80aqldrt.xn--p1ai";
export const siteHost = "xn--80aqldrt.xn--p1ai";

const defaultOgImage = {
  url: "/img/hero/slideInStock.webp",
  width: 1365,
  height: 694,
  alt: "Фанера и листовые материалы в наличии",
};

type PageMetadataParams = {
  title: string;
  description: string;
  path: "/" | `/${string}`;
  noIndex?: boolean;
};

function getFullTitle(title: string) {
  return title === siteName ? siteName : `${title} | ${siteName}`;
}

function getRobots(noIndex: boolean): Metadata["robots"] {
  if (noIndex) {
    return {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataParams): Metadata {
  const fullTitle = getFullTitle(title);

  return {
    title: title === siteName ? { absolute: siteName } : title,
    description,
    ...(noIndex
      ? {}
      : {
          alternates: {
            canonical: path,
          },
        }),
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName,
      locale: "ru_RU",
      type: "website",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultOgImage.url],
    },
    robots: getRobots(noIndex),
  };
}

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  name: siteName,
  url: siteUrl,
  logo: new URL("/img/logoFull.png", siteUrl).toString(),
  image: new URL(defaultOgImage.url, siteUrl).toString(),
  description: siteDescription,
  email: "fanmir24@yandex.ru",
  telephone: "+7 391 268-32-33",
  priceRange: "RUB",
  address: {
    "@type": "PostalAddress",
    addressCountry: "RU",
    addressLocality: "Красноярск",
    streetAddress: "улица Калинина, 169, офис 1-05",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 56.053861,
    longitude: 92.745941,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+7 391 268-32-33",
      contactType: "sales",
      areaServed: "Красноярск",
      availableLanguage: "ru",
    },
    {
      "@type": "ContactPoint",
      telephone: "+7 391 268-32-23",
      contactType: "sales",
      areaServed: "Красноярск",
      availableLanguage: "ru",
    },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
};
