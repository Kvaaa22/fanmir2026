import ExcelJS from "exceljs";
import { PRICE_SOURCE } from "./priceSource";
import type { ParsedPriceRow } from "./priceTypes";
import { createVariantKey } from "./priceTypes";
import {
  normalizeSize,
  parseNumberFromCell,
  parsePriceFromCell,
} from "./excelCellUtils";

type FinishColumn = {
  finish: string;
  priceCol: number;
  pricePerM2Col?: number;
};

const STANDARD_PANEL_FINISHES: FinishColumn[] = [
  { finish: "без покрытия", priceCol: 4, pricePerM2Col: 5 },
  { finish: "классик", priceCol: 6, pricePerM2Col: 7 },
  { finish: "лофт", priceCol: 8, pricePerM2Col: 9 },
  { finish: "эксклюзив", priceCol: 10, pricePerM2Col: 11 },
];

const SIMPLE_FINISH_COLS = [
  { finish: "без покрытия", col: 3 },
  { finish: "классик", col: 4 },
  { finish: "лофт", col: 6 },
  { finish: "эмаль, морилка/лак", col: 8 },
  { finish: "эмаль/патина", col: 10 },
];

const READY_PRODUCT_FINISH_COLS = [
  { finish: "без покрытия", col: 4 },
  { finish: "классик", col: 5 },
  { finish: "лофт", col: 6 },
  { finish: "эмаль, морилка/лак", col: 8 },
  { finish: "эмаль/патина", col: 10 },
];

const DOOR_FINISH_COLS = [
  { finish: "без покрытия", col: 3 },
  { finish: "классик", col: 4 },
  { finish: "лофт", col: 6 },
  { finish: "эмаль, морилка/лак", col: 8 },
  { finish: "эмаль/патина", col: 10 },
];

const PANO_COLUMNS = [
  {
    variantTitle: "Mix ширина 32/65/97 длина 600/800/1200",
    col: 3,
  },
  {
    variantTitle: "Mix ширина 75 длина 525/725/1125",
    col: 4,
  },
  {
    variantTitle: "Кубы 275",
    col: 6,
  },
  {
    variantTitle: "Ромбы 195/390",
    col: 8,
  },
  {
    variantTitle: "Треугольники 320/370",
    col: 9,
  },
  {
    variantTitle: "3D 185x450x25",
    col: 11,
  },
];

export async function parsePlydexPriceExcel(
  buffer: Buffer
): Promise<ParsedPriceRow[]> {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);

  const worksheet = workbook.getWorksheet("Лист1");

  if (!worksheet) {
    throw new Error("В прайсе Plydex не найден лист 'Лист1'");
  }

  return [
    ...parseStandardPanels(worksheet),
    ...parseCustomPanels(worksheet),
    ...parseCustomProfile(worksheet),
    ...parseReadyProducts(worksheet),
    ...parseDoors(worksheet),
    ...parsePano(worksheet),
    ...parseCoatings(worksheet),
  ];
}

function parseStandardPanels(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];

  for (const rowNumber of [9, 12]) {
    const size = worksheet.getCell(rowNumber, 3).text.trim();

    if (!size) {
      continue;
    }

    for (const item of STANDARD_PANEL_FINISHES) {
      const priceRub = parsePriceFromCell(worksheet, rowNumber, item.priceCol);

      if (!priceRub) {
        continue;
      }

      const pricePerM2Rub = item.pricePerM2Col
        ? parseNumberFromCell(worksheet, rowNumber, item.pricePerM2Col)
        : undefined;

      const note = item.pricePerM2Col
        ? worksheet.getCell(rowNumber, item.pricePerM2Col).text.trim()
        : undefined;

      result.push({
        source: PRICE_SOURCE.PLYDEX,

        productSlug: "plydex-panels-standard",
        productTitle: "Plydex панели стандартные размеры",

        categorySlug: "plydex-panels",
        categoryTitle: "Plydex панели",

        variantKey: createVariantKey([
          "plydex-panels-standard",
          size,
          item.finish,
        ]),

        variantTitle: [size, item.finish].join(", "),

        finish: item.finish,
        size: normalizeSize(size),

        unit: "шт.",
        priceRub,
        pricePerM2Rub,

        note: note && !pricePerM2Rub ? note : undefined,
        rowNumber,
      });
    }
  }

  return result;
}

function parseCustomPanels(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];
  const rowNumber = 17;

  for (const item of SIMPLE_FINISH_COLS) {
    const priceRub = parsePriceFromCell(worksheet, rowNumber, item.col);

    if (!priceRub) {
      continue;
    }

    result.push({
      source: PRICE_SOURCE.PLYDEX,

      productSlug: "plydex-panels-custom",
      productTitle: "Plydex панели по индивидуальным размерам",

      categorySlug: "plydex-panels",
      categoryTitle: "Plydex панели",

      variantKey: createVariantKey([
        "plydex-panels-custom",
        item.finish,
      ]),

      variantTitle: item.finish,

      finish: item.finish,

      unit: "м²",
      pricePerM2Rub: priceRub,

      note: "Цена от",
      rowNumber,
    });
  }

  return result;
}

function parseCustomProfile(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];

  const profileRows = [
    {
      rowNumber: 21,
      variantTitle: "Профиль по индивидуальным размерам, группа 1",
    },
    {
      rowNumber: 24,
      variantTitle: "Профиль по индивидуальным размерам, группа 2",
    },
    {
      rowNumber: 27,
      variantTitle: "Профиль по индивидуальным размерам, группа 3",
    },
  ];

  for (const profileRow of profileRows) {
    for (const item of SIMPLE_FINISH_COLS) {
      const priceRub = parsePriceFromCell(
        worksheet,
        profileRow.rowNumber,
        item.col
      );

      if (!priceRub) {
        continue;
      }

      result.push({
        source: PRICE_SOURCE.PLYDEX,

        productSlug: "plydex-profile-custom",
        productTitle: "Plydex профиль по индивидуальным размерам",

        categorySlug: "plydex-profile",
        categoryTitle: "Plydex профиль",

        variantKey: createVariantKey([
          "plydex-profile-custom",
          profileRow.variantTitle,
          item.finish,
        ]),

        variantTitle: profileRow.variantTitle,

        finish: item.finish,

        unit: "м²",
        pricePerM2Rub: priceRub,

        note: "Цена от",
        rowNumber: profileRow.rowNumber,
      });
    }
  }

  return result;
}

function parseReadyProducts(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];
  let currentName = "";

  for (const rowNumber of [32, 33, 34, 35, 36, 37]) {
    const name = worksheet.getCell(rowNumber, 2).text.trim();

    if (name) {
      currentName = name;
    }

    const size = worksheet.getCell(rowNumber, 3).text.trim();

    if (!currentName || !size) {
      continue;
    }

    for (const item of READY_PRODUCT_FINISH_COLS) {
      const priceRub = parsePriceFromCell(worksheet, rowNumber, item.col);

      if (!priceRub) {
        continue;
      }

      result.push({
        source: PRICE_SOURCE.PLYDEX,

        productSlug: "plydex-ready-products",
        productTitle: "Plydex готовые изделия",

        categorySlug: "plydex-ready-products",
        categoryTitle: "Plydex готовые изделия",

        variantKey: createVariantKey([
          "plydex-ready-products",
          currentName,
          size,
          item.finish,
        ]),

        variantTitle: [currentName, size].join(", "),

        finish: item.finish,
        size: normalizeSize(size),

        unit: "шт.",
        priceRub,

        rowNumber,
      });
    }
  }

  return result;
}

function parseDoors(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];

  for (const rowNumber of [40, 41]) {
    const doorName = worksheet.getCell(rowNumber, 2).text.trim();

    if (!doorName) {
      continue;
    }

    for (const item of DOOR_FINISH_COLS) {
      const priceRub = parsePriceFromCell(worksheet, rowNumber, item.col);

      if (!priceRub) {
        continue;
      }

      result.push({
        source: PRICE_SOURCE.PLYDEX,

        productSlug: "plydex-doors",
        productTitle: "Plydex двери",

        categorySlug: "plydex-doors",
        categoryTitle: "Plydex двери",

        variantKey: createVariantKey([
          "plydex-doors",
          doorName,
          item.finish,
        ]),

        variantTitle: doorName,

        finish: item.finish,

        unit: "комплект",
        priceRub,

        rowNumber,
      });
    }
  }

  return result;
}

function parsePano(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];

  for (const rowNumber of [45, 46, 47, 48]) {
    const finish = worksheet.getCell(rowNumber, 2).text.trim();

    if (!finish) {
      continue;
    }

    for (const item of PANO_COLUMNS) {
      const priceRub = parsePriceFromCell(worksheet, rowNumber, item.col);

      if (!priceRub) {
        continue;
      }

      result.push({
        source: PRICE_SOURCE.PLYDEX,

        productSlug: "plydex-pano",
        productTitle: "Plydex варианты и примеры пано",

        categorySlug: "plydex-pano",
        categoryTitle: "Plydex пано",

        variantKey: createVariantKey([
          "plydex-pano",
          item.variantTitle,
          finish,
        ]),

        variantTitle: item.variantTitle,

        finish,

        unit: "м²",
        pricePerM2Rub: priceRub,

        rowNumber,
      });
    }
  }

  return result;
}

function parseCoatings(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];

  for (const rowNumber of [51, 52, 53, 54, 55]) {
    const name = worksheet.getCell(rowNumber, 2).text.trim();
    const description = worksheet.getCell(rowNumber, 3).text.trim();
    const priceRub = parsePriceFromCell(worksheet, rowNumber, 10);

    if (!name || !priceRub) {
      continue;
    }

    result.push({
      source: PRICE_SOURCE.PLYDEX,

      productSlug: "plydex-coatings",
      productTitle: "Plydex варианты лакокрасочных покрытий",

      categorySlug: "plydex-coatings",
      categoryTitle: "Plydex покрытия",

      variantKey: createVariantKey([
        "plydex-coatings",
        name,
      ]),

      variantTitle: name,

      finish: name,

      unit: rowNumber === 55 ? "услуга" : "м²",
      pricePerM2Rub: rowNumber === 55 ? undefined : priceRub,
      priceRub: rowNumber === 55 ? priceRub : undefined,

      note: description || undefined,
      rowNumber,
    });
  }

  return result;
}