import prisma from "@/lib/prisma";
import type { PriceSourceValue } from "./priceSource";
import type { ParsedPriceRow } from "./priceTypes";

type ImportPricesParams = {
  source: PriceSourceValue;
  rows: ParsedPriceRow[];
  originalFileName: string;
  storedFilePath: string;
  pdfPath?: string;
};

export async function importPrices({
  source,
  rows,
  originalFileName,
  storedFilePath,
  pdfPath,
}: ImportPricesParams) {
  const result = await prisma.$transaction(async (tx) => {
    const priceImport = await tx.priceImport.create({
      data: {
        source,
        originalFileName,
        storedFilePath,
        pdfPath,
        rowsCount: rows.length,
        status: "success",
      },
    });

    await tx.price.deleteMany({
      where: {
        source,
      },
    });

    for (const row of rows) {
      const product = await tx.product.upsert({
        where: {
          slug: row.productSlug,
        },
        update: {
          title: row.productTitle,
          categorySlug: row.categorySlug,
          categoryTitle: row.categoryTitle,
          isActive: true,
        },
        create: {
          slug: row.productSlug,
          title: row.productTitle,
          categorySlug: row.categorySlug,
          categoryTitle: row.categoryTitle,
          isActive: true,
        },
      });

      await tx.price.create({
        data: {
          productId: product.id,
          source: row.source,
          variantKey: row.variantKey,

          variantTitle: row.variantTitle,
          sort: row.sort,
          surface: row.surface,
          finish: row.finish,

          thicknessMm: row.thicknessMm,
          size: row.size,

          unit: row.unit,
          priceRub: row.priceRub,
          pricePerM2Rub: row.pricePerM2Rub,

          note: row.note,
          rowNumber: row.rowNumber,
        },
      });
    }

    return {
      importId: priceImport.id,
    };
  });

  return result;
}