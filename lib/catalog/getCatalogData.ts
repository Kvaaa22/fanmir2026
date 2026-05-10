import prisma from "@/lib/prisma";

export type CatalogParams = {
  category?: string;
  thickness?: string;
  sort?: string;
  finish?: string;
  surface?: string;
};

export async function getCatalogProducts(params: CatalogParams) {
  return prisma.product.findMany({
    where: {
      isActive: true,

      categorySlug: params.category || undefined,

      prices: {
        some: {
          thicknessMm: params.thickness
            ? Number(params.thickness)
            : undefined,

          sort: params.sort || undefined,
          finish: params.finish || undefined,
          surface: params.surface || undefined,
        },
      },
    },

    include: {
      prices: {
        where: {
          thicknessMm: params.thickness
            ? Number(params.thickness)
            : undefined,

          sort: params.sort || undefined,
          finish: params.finish || undefined,
          surface: params.surface || undefined,
        },

        orderBy: [
          {
            thicknessMm: "asc",
          },
          {
            priceRub: "asc",
          },
        ],
      },
    },

    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
  });
}

export async function getAvailableThicknesses() {
  return prisma.price.findMany({
    distinct: ["thicknessMm"],

    where: {
      thicknessMm: {
        not: null,
      },
    },

    select: {
      thicknessMm: true,
    },

    orderBy: {
      thicknessMm: "asc",
    },
  });
}

export type CatalogPriceCard = {
  id: string;
  productSlug: string;
  categorySlug: string;
  categoryTitle: string;
  imageUrl: string;
  titleLineOne: string;
  titleLineTwo: string;
  meta: Array<{
    label: string;
    value: string;
  }>;
  price: string;
  pricePerM2?: string;
  unitPriceRub: number | null;
};

const LEGACY_PRODUCT_TITLES: Record<string, string> = {
  "fanera-hvoinaya-fsf-nsh-2440x1220":
    "Фанера хвойных пород, ФСФ, НШ 2440x1220 мм",
  "fanera-berezovaya-fk-nsh-1525x1525":
    "Фанера березовая, ФК, Е1, НШ* 1525x1525 мм",
  "fanera-berezovaya-fk-sh2-sveza-1525x1525":
    "Фанера березовая, ФК, Е1, Ш2, Ш, СВЕЗА 1525x1525 мм",
  "fanera-berezovaya-fsf-sveza-2440x1220":
    "Фанера березовая, ФСФ, Е1, Ш, НШ*, СВЕЗА 2440x1220 мм",
  "fanera-berezovaya-fsf-sveza-1500x3000":
    "Фанера березовая, ФСФ, Е1, Ш, НШ*, СВЕЗА 1500x3000 мм",
  "fanera-berezovaya-laminirovannaya-2440x1220":
    "Фанера березовая ФСФ, Е1, ламинированная, 1 сорт, плотность 120 г/м2 СВЕЗА 2440x1220 мм",
  "fanera-berezovaya-laminirovannaya-1500x3000":
    "Фанера березовая ФСФ, Е1, ламинированная, 1 сорт, плотность 120 г/м2 СВЕЗА 1500x3000 мм",
  "osb-3-2500x1250":
    "Ориентированно-стружечная плита OSB-3 2500x1250 мм",
  "mdf-sort-1-shlifovannaya-2800x2070":
    "МДФ СОРТ 1, шлифованная 2800x2070 мм",
};

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 2,
});

function normalizeOrderText(value: string) {
  return value
    .replace(/при\s*заказе/gi, "при заказе")
    .replace(/заказе\s*от/gi, "заказе от")
    .replace(/от\s*(\d)/gi, "от $1")
    .replace(/(\d)\s*шт/gi, "$1 шт")
    .replace(/(\d)(при заказе)/gi, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function formatThickness(thicknessMm: number | null) {
  if (thicknessMm == null) {
    return "-";
  }

  return `${decimalFormatter.format(thicknessMm)} мм`;
}

function formatSize(size: string | null) {
  if (!size) {
    return "-";
  }

  const normalizedSize = size.replaceAll("x", "×").replaceAll("*", "×");
  const displaySize = normalizeOrderText(normalizedSize);

  return /мм/i.test(displaySize) ? displaySize : `${displaySize} мм`;
}

function formatPrice(
  priceRub: number | null,
  pricePerM2Rub: number | null,
  unit: string
) {
  if (priceRub != null) {
    return `${rubFormatter.format(priceRub)} руб./${unit}`;
  }

  if (pricePerM2Rub != null) {
    return `${decimalFormatter.format(pricePerM2Rub)} руб./м²`;
  }

  return "Цена по запросу";
}

function formatPricePerM2(priceRub: number | null, pricePerM2Rub: number | null) {
  if (priceRub == null || pricePerM2Rub == null) {
    return undefined;
  }

  return `${decimalFormatter.format(pricePerM2Rub)} руб./м²`;
}

function normalizeProductTitle(title: string) {
  return normalizeOrderText(title)
    .replace(/\s+/g, " ")
    .replace(/[«»]/g, "")
    .replace(/\s*\([^)]*кв\.?\s*м\.?[^)]*\)/gi, "")
    .replace(/\s*\(ГОСТ[^)]*\)/gi, "")
    .replace(/\s*СТО\b.*$/i, "")
    .replace(/\bмарка\s+/gi, "")
    .replace(/,?\s*формат\s*:?\s*/gi, " ")
    .replace(/\s*мм\./gi, " мм")
    .replace(/\s+,/g, ",")
    .replace(/,\s*(\d{3,4}\s*[xх×*]\s*\d{3,4})/gi, " $1")
    .replace(/\s+/g, " ")
    .trim();
}

function isLegacyProductTitle(title: string) {
  return (
    !title.includes(",") ||
    !/\bмм\b/i.test(title) ||
    (/СВЕЗА/i.test(title) && !/\bЕ1\b/i.test(title))
  );
}

function getProductTitle(slug: string, title: string) {
  const normalizedTitle = normalizeProductTitle(title);
  const legacyTitle = LEGACY_PRODUCT_TITLES[slug];

  if (legacyTitle && isLegacyProductTitle(normalizedTitle)) {
    return legacyTitle;
  }

  return normalizedTitle;
}

function normalizeSizeForCompare(value: string | null) {
  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .replace(/[х×*]/g, "x")
    .replace(/мм/gi, "")
    .replace(/[^\d.x]/g, "");
}

function isSizePart(value: string) {
  return /\d{3,4}\s*[xх×*]\s*\d{3,4}/i.test(value);
}

function productTitleHasSize(productTitle: string, size: string | null) {
  const normalizedSize = normalizeSizeForCompare(size);

  return (
    Boolean(normalizedSize) &&
    normalizeSizeForCompare(productTitle).includes(normalizedSize)
  );
}

function removeDuplicateSizeFromVariantTitle(
  variantTitle: string,
  productTitle: string
) {
  return variantTitle
    .split(",")
    .map((item) => item.trim())
    .filter((item) => {
      return item && !(isSizePart(item) && productTitleHasSize(productTitle, item));
    })
    .join(", ");
}

function buildVariantTitle(params: {
  variantTitle: string | null;
  sort: string | null;
  finish: string | null;
  surface: string | null;
  thicknessMm: number | null;
  size: string | null;
}, productTitle: string) {
  if (params.variantTitle) {
    return normalizeOrderText(
      removeDuplicateSizeFromVariantTitle(params.variantTitle, productTitle)
    );
  }

  return [
    params.sort,
    params.finish,
    params.surface,
    formatThickness(params.thicknessMm),
    productTitleHasSize(productTitle, params.size)
      ? undefined
      : formatSize(params.size),
  ]
    .filter((item) => item && item !== "-")
    .join(", ");
}

function getCatalogCardImage(params: {
  productSlug: string;
  categorySlug: string;
  variantTitle: string;
  imageUrl: string | null;
}) {
  if (params.imageUrl) {
    return params.imageUrl;
  }

  if (
    params.productSlug === "plydex-profile-custom" ||
    params.productSlug === "plydex-ready-products"
  ) {
    if (/группа\s*1|г-образн/i.test(params.variantTitle)) {
      return "/img/catalogue/plydex-profile-g.svg";
    }

    if (/группа\s*2|п-образн/i.test(params.variantTitle)) {
      return "/img/catalogue/plydex-profile-p.svg";
    }

    if (/группа\s*3|4-х|4\s*сторон|о-образн/i.test(params.variantTitle)) {
      return "/img/catalogue/plydex-profile-o.svg";
    }
  }

  if (params.categorySlug.startsWith("plydex")) {
    return "/img/prices/plydex.png";
  }

  return "/img/catalogue/card.png";
}

export async function getCatalogPriceCards() {
  const prices = await prisma.price.findMany({
    where: {
      product: {
        isActive: true,
      },
    },
    include: {
      product: {
        select: {
          slug: true,
          title: true,
          categorySlug: true,
          categoryTitle: true,
          imageUrl: true,
          sortOrder: true,
        },
      },
    },
    orderBy: [
      {
        source: "asc",
      },
      {
        rowNumber: "asc",
      },
      {
        id: "asc",
      },
    ],
  });

  return prices
    .sort((first, second) => {
      const categoryCompare = first.product.categoryTitle.localeCompare(
        second.product.categoryTitle,
        "ru"
      );

      if (categoryCompare !== 0) {
        return categoryCompare;
      }

      const productOrderCompare =
        first.product.sortOrder - second.product.sortOrder;

      if (productOrderCompare !== 0) {
        return productOrderCompare;
      }

      return (first.rowNumber ?? first.id) - (second.rowNumber ?? second.id);
    })
    .map<CatalogPriceCard>((item) => {
      const productTitle = getProductTitle(item.product.slug, item.product.title);
      const primaryType =
        item.sort ?? item.finish ?? item.surface ?? item.product.categoryTitle;

      return {
        id: `${item.source}-${item.id}`,
        productSlug: item.product.slug,
        categorySlug: item.product.categorySlug,
        categoryTitle: item.product.categoryTitle,
        imageUrl: getCatalogCardImage({
          productSlug: item.product.slug,
          categorySlug: item.product.categorySlug,
          variantTitle: item.variantTitle ?? "",
          imageUrl: item.product.imageUrl,
        }),
        titleLineOne: productTitle,
        titleLineTwo:
          buildVariantTitle(item, productTitle) || item.product.categoryTitle,
        meta: [
          {
            label: "Тип",
            value: primaryType,
          },
          {
            label: "Толщина",
            value: formatThickness(item.thicknessMm),
          },
          {
            label: "Размер",
            value: formatSize(item.size),
          },
        ],
        price: formatPrice(item.priceRub, item.pricePerM2Rub, item.unit),
        pricePerM2: formatPricePerM2(item.priceRub, item.pricePerM2Rub),
        unitPriceRub: item.priceRub,
      };
    });
}

export async function getAvailableSorts() {
  return prisma.price.findMany({
    distinct: ["sort"],

    where: {
      sort: {
        not: null,
      },
    },

    select: {
      sort: true,
    },

    orderBy: {
      sort: "asc",
    },
  });
}
