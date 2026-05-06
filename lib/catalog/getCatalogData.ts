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