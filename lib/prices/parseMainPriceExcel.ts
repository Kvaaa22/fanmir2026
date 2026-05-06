import ExcelJS from "exceljs";
import { PRICE_SOURCE } from "./priceSource";
import type { ParsedPriceRow } from "./priceTypes";
import { createVariantKey } from "./priceTypes";
import {
  calculatePricePerM2,
  normalizeSize,
  parsePriceFromCell,
} from "./excelCellUtils";

type PriceColumnConfig = {
  col: number;
  thicknessMm?: number;
  variantTitle?: string;
};

type MatrixBlockConfig = {
  productSlug: string;
  productTitle: string;
  categorySlug: string;
  categoryTitle: string;

  size: string;
  areaM2?: number;

  labelCol: number;
  labelType: "sort" | "surface";

  dataRows: number[];
  priceColumns: PriceColumnConfig[];

  unit: string;
};

const MAIN_BLOCKS: MatrixBlockConfig[] = [
  {
    productSlug: "fanera-hvoinaya-fsf-nsh-2440x1220",
    productTitle: "Фанера хвойных пород ФСФ НШ 2440x1220",
    categorySlug: "plywood-softwood",
    categoryTitle: "Хвойная фанера",
    size: "2440x1220",
    areaM2: 2.97,
    labelCol: 1,
    labelType: "sort",
    dataRows: [12, 13, 14, 15],
    priceColumns: [
      { col: 6, thicknessMm: 6.5 },
      { col: 7, thicknessMm: 9 },
      { col: 8, thicknessMm: 12 },
      { col: 9, thicknessMm: 15 },
      { col: 10, thicknessMm: 18 },
      { col: 11, thicknessMm: 21 },
      { col: 12, thicknessMm: 24 },
      { col: 13, thicknessMm: 27 },
      { col: 14, thicknessMm: 30 },
    ],
    unit: "лист",
  },
  {
    productSlug: "fanera-berezovaya-fk-nsh-1525x1525",
    productTitle: "Фанера березовая ФК НШ 1525x1525",
    categorySlug: "plywood-birch-fk",
    categoryTitle: "Березовая фанера ФК",
    size: "1525x1525",
    areaM2: 2.32,
    labelCol: 1,
    labelType: "sort",
    dataRows: [19],
    priceColumns: [
      { col: 3, thicknessMm: 3 },
      { col: 4, thicknessMm: 4 },
      { col: 5, thicknessMm: 6 },
      { col: 6, thicknessMm: 8 },
      { col: 7, thicknessMm: 9 },
      { col: 8, thicknessMm: 10 },
      { col: 9, thicknessMm: 12 },
      { col: 10, thicknessMm: 14 },
      { col: 11, thicknessMm: 15 },
      { col: 12, thicknessMm: 16 },
      { col: 13, thicknessMm: 18 },
      { col: 14, thicknessMm: 20 },
    ],
    unit: "лист",
  },
  {
    productSlug: "fanera-berezovaya-fk-sh2-sveza-1525x1525",
    productTitle: "Фанера березовая ФК Ш2 СВЕЗА 1525x1525",
    categorySlug: "plywood-birch-fk",
    categoryTitle: "Березовая фанера ФК",
    size: "1525x1525",
    areaM2: 2.32,
    labelCol: 1,
    labelType: "sort",
    dataRows: [23, 24, 25, 26, 27],
    priceColumns: [
      { col: 4, thicknessMm: 3 },
      { col: 5, thicknessMm: 4 },
      { col: 6, thicknessMm: 5 },
      { col: 7, thicknessMm: 6 },
      { col: 8, thicknessMm: 8 },
      { col: 9, thicknessMm: 9 },
      { col: 10, thicknessMm: 10 },
      { col: 11, thicknessMm: 12 },
      { col: 12, thicknessMm: 15 },
      { col: 13, thicknessMm: 18 },
      { col: 14, thicknessMm: 21 },
    ],
    unit: "лист",
  },
  {
    productSlug: "fanera-berezovaya-fsf-sveza-2440x1220",
    productTitle: "Фанера березовая ФСФ СВЕЗА 2440x1220",
    categorySlug: "plywood-birch-fsf",
    categoryTitle: "Березовая фанера ФСФ",
    size: "2440x1220",
    areaM2: 2.97,
    labelCol: 1,
    labelType: "sort",
    dataRows: [31, 32, 33, 34, 35, 36],
    priceColumns: [
      { col: 2, thicknessMm: 4 },
      { col: 3, thicknessMm: 6 },
      { col: 4, thicknessMm: 8 },
      { col: 5, thicknessMm: 9 },
      { col: 6, thicknessMm: 12 },
      { col: 7, thicknessMm: 15 },
      { col: 8, thicknessMm: 18 },
      { col: 9, thicknessMm: 21 },
      { col: 10, thicknessMm: 24 },
      { col: 11, thicknessMm: 27 },
      { col: 12, thicknessMm: 30 },
      { col: 13, thicknessMm: 35 },
      { col: 14, thicknessMm: 40 },
    ],
    unit: "лист",
  },
  {
    productSlug: "fanera-berezovaya-fsf-sveza-1500x3000",
    productTitle: "Фанера березовая ФСФ СВЕЗА 1500x3000",
    categorySlug: "plywood-birch-fsf",
    categoryTitle: "Березовая фанера ФСФ",
    size: "1500x3000",
    areaM2: 4.5,
    labelCol: 1,
    labelType: "sort",
    dataRows: [40, 41, 42, 43, 44, 45],
    priceColumns: [
      { col: 4, thicknessMm: 6 },
      { col: 5, thicknessMm: 9 },
      { col: 6, thicknessMm: 12 },
      { col: 7, thicknessMm: 15 },
      { col: 8, thicknessMm: 18 },
      { col: 9, thicknessMm: 21 },
      { col: 10, thicknessMm: 24 },
      { col: 11, thicknessMm: 27 },
      { col: 13, thicknessMm: 30 },
    ],
    unit: "лист",
  },
  {
    productSlug: "fanera-berezovaya-laminirovannaya-2440x1220",
    productTitle: "Фанера березовая ламинированная 2440x1220",
    categorySlug: "plywood-laminated",
    categoryTitle: "Ламинированная фанера",
    size: "2440x1220",
    areaM2: 2.97,
    labelCol: 1,
    labelType: "surface",
    dataRows: [49, 50],
    priceColumns: [
      { col: 4, thicknessMm: 6 },
      { col: 5, thicknessMm: 9 },
      { col: 6, thicknessMm: 12 },
      { col: 7, thicknessMm: 15 },
      { col: 8, thicknessMm: 18 },
      { col: 9, thicknessMm: 21 },
      { col: 10, thicknessMm: 24 },
      { col: 11, thicknessMm: 27 },
      { col: 12, thicknessMm: 30 },
      { col: 13, thicknessMm: 35 },
      { col: 14, thicknessMm: 40 },
    ],
    unit: "лист",
  },
  {
    productSlug: "fanera-berezovaya-laminirovannaya-1500x3000",
    productTitle: "Фанера березовая ламинированная 1500x3000",
    categorySlug: "plywood-laminated",
    categoryTitle: "Ламинированная фанера",
    size: "1500x3000",
    areaM2: 4.5,
    labelCol: 1,
    labelType: "surface",
    dataRows: [54, 55],
    priceColumns: [
      { col: 4, thicknessMm: 6 },
      { col: 5, thicknessMm: 9 },
      { col: 7, thicknessMm: 12 },
      { col: 9, thicknessMm: 15 },
      { col: 11, thicknessMm: 18 },
      { col: 13, thicknessMm: 21 },
    ],
    unit: "лист",
  },
  {
    productSlug: "osb-3-2500x1250",
    productTitle: "Ориентированно-стружечная плита OSB-3 2500x1250",
    categorySlug: "osb",
    categoryTitle: "OSB-3",
    size: "2500x1250",
    areaM2: 3.125,
    labelCol: 1,
    labelType: "sort",
    dataRows: [59, 60, 61],
    priceColumns: [
      { col: 4, thicknessMm: 6 },
      { col: 6, thicknessMm: 9 },
      { col: 8, thicknessMm: 12 },
      { col: 10, thicknessMm: 15 },
      { col: 12, thicknessMm: 18 },
      { col: 14, thicknessMm: 22 },
    ],
    unit: "лист",
  },
  {
    productSlug: "mdf-sort-1-shlifovannaya-2800x2070",
    productTitle: "МДФ сорт 1 шлифованная 2800x2070",
    categorySlug: "mdf",
    categoryTitle: "МДФ",
    size: "2800x2070",
    areaM2: 5.796,
    labelCol: 1,
    labelType: "sort",
    dataRows: [75],
    priceColumns: [
      { col: 4, thicknessMm: 6 },
      { col: 5, thicknessMm: 8 },
      { col: 6, thicknessMm: 10 },
      { col: 7, thicknessMm: 16 },
      { col: 8, thicknessMm: 18 },
      { col: 9, thicknessMm: 19 },
      { col: 10, thicknessMm: 22 },
      { col: 11, thicknessMm: 28 },
      { col: 12, thicknessMm: 16, variantTitle: "16 мм 1 ст" },
      { col: 13, thicknessMm: 16, variantTitle: "16 мм 2 ст" },
    ],
    unit: "лист",
  },
];

export async function parseMainPriceExcel(
  buffer: Buffer
): Promise<ParsedPriceRow[]> {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);

  const worksheet = workbook.getWorksheet("Лист1");

  if (!worksheet) {
    throw new Error("В основном прайсе не найден лист 'Лист1'");
  }

  const rows: ParsedPriceRow[] = [];

  for (const block of MAIN_BLOCKS) {
    rows.push(...parseMatrixBlock(worksheet, block));
  }

  rows.push(...parseDspRows(worksheet));
  rows.push(...parseDvpRows(worksheet));

  return rows;
}

function parseMatrixBlock(
  worksheet: ExcelJS.Worksheet,
  block: MatrixBlockConfig
): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];

  for (const rowNumber of block.dataRows) {
    const rowLabel = worksheet.getCell(rowNumber, block.labelCol).text.trim();

    if (!rowLabel || rowLabel.toLowerCase().includes("листов")) {
      continue;
    }

    for (const priceColumn of block.priceColumns) {
      const priceRub = parsePriceFromCell(
        worksheet,
        rowNumber,
        priceColumn.col
      );

      if (!priceRub) {
        continue;
      }

      const sort = block.labelType === "sort" ? rowLabel : undefined;
      const surface = block.labelType === "surface" ? rowLabel : undefined;

      const variantTitle =
        priceColumn.variantTitle ??
        [
          rowLabel,
          priceColumn.thicknessMm ? `${priceColumn.thicknessMm} мм` : undefined,
          block.size,
        ]
          .filter(Boolean)
          .join(", ");

      result.push({
        source: PRICE_SOURCE.MAIN,

        productSlug: block.productSlug,
        productTitle: block.productTitle,

        categorySlug: block.categorySlug,
        categoryTitle: block.categoryTitle,

        variantKey: createVariantKey([
          block.productSlug,
          rowLabel,
          priceColumn.thicknessMm,
          block.size,
          priceColumn.variantTitle,
        ]),

        variantTitle,

        sort,
        surface,

        thicknessMm: priceColumn.thicknessMm,
        size: normalizeSize(block.size),

        unit: block.unit,
        priceRub,
        pricePerM2Rub: calculatePricePerM2(priceRub, block.areaM2),

        rowNumber,
      });
    }
  }

  return result;
}

function parseDspRows(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];

  for (const rowNumber of [65, 66]) {
    const size = worksheet.getCell(rowNumber, 4).text.trim();
    const surface = worksheet.getCell(rowNumber, 11).text.trim();
    const priceRub = parsePriceFromCell(worksheet, rowNumber, 13);
    const areaM2 = Number(worksheet.getCell(rowNumber, 9).value);

    if (!priceRub || !size) {
      continue;
    }

    result.push({
      source: PRICE_SOURCE.MAIN,

      productSlug: "dsp",
      productTitle: "Древесно-стружечная плита ДСП",

      categorySlug: "dsp",
      categoryTitle: "ДСП",

      variantKey: createVariantKey(["dsp", size, surface]),

      variantTitle: [size, surface].filter(Boolean).join(", "),

      surface,
      size: normalizeSize(size),

      unit: "лист",
      priceRub,
      pricePerM2Rub: calculatePricePerM2(priceRub, areaM2),

      rowNumber,
    });
  }

  return result;
}

function parseDvpRows(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];

  for (const rowNumber of [69, 70, 71, 72]) {
    const name = worksheet.getCell(rowNumber, 1).text.trim();
    const size = worksheet.getCell(rowNumber, 4).text.trim();
    const surface = worksheet.getCell(rowNumber, 11).text.trim();
    const priceRub = parsePriceFromCell(worksheet, rowNumber, 13);
    const areaM2 = Number(worksheet.getCell(rowNumber, 9).value);

    if (!priceRub || !size) {
      continue;
    }

    result.push({
      source: PRICE_SOURCE.MAIN,

      productSlug: "dvp-hdf",
      productTitle: "Древесно-волокнистые плиты ДВП / ХДФ",

      categorySlug: "dvp",
      categoryTitle: "ДВП / ХДФ",

      variantKey: createVariantKey(["dvp-hdf", name, size, surface]),

      variantTitle: [name, size, surface].filter(Boolean).join(", "),

      surface,
      size: normalizeSize(size),

      unit: "лист",
      priceRub,
      pricePerM2Rub: calculatePricePerM2(priceRub, areaM2),

      rowNumber,
    });
  }

  return result;
}