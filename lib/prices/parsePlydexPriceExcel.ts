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

type SimpleFinishColumn = {
  finish: string;
  col: number;
};

const STANDARD_PANEL_FINISHES: FinishColumn[] = [
  { finish: "без покрытия", priceCol: 4, pricePerM2Col: 5 },
  { finish: "классик", priceCol: 6, pricePerM2Col: 7 },
  { finish: "лофт", priceCol: 8, pricePerM2Col: 9 },
  { finish: "эксклюзив", priceCol: 10, pricePerM2Col: 11 },
];

const CUSTOM_PANEL_FINISHES: SimpleFinishColumn[] = [
  { finish: "без покрытия", col: 3 },
  { finish: "классик, масло", col: 4 },
  { finish: "лофт, масло", col: 6 },
  { finish: "эмаль, морилка/лак", col: 8 },
  { finish: "эмаль/патина", col: 10 },
];

const PROFILE_FINISHES: SimpleFinishColumn[] = [
  { finish: "без покрытия", col: 3 },
  { finish: "классик", col: 4 },
  { finish: "лофт", col: 6 },
  { finish: "эмаль, морилка/лак", col: 8 },
  { finish: "эмаль/патина", col: 10 },
];

export async function parsePlydexPriceExcel(
  buffer: Buffer
): Promise<ParsedPriceRow[]> {
  const workbook = new ExcelJS.Workbook();

  await workbook.xlsx.load(buffer as unknown as Parameters<typeof workbook.xlsx.load>[0]);

  const worksheet = workbook.getWorksheet("Лист1") ?? workbook.worksheets[0];

  if (!worksheet) {
    throw new Error("В прайсе Plydex не найден лист с данными");
  }

  return [
    ...parseStandardPanels(worksheet),
    ...parseCustomPanels(worksheet),
    ...parseCustomProfile(worksheet),
  ];
}

function normalizeLookupText(value: string) {
  return value
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/\s+/g, " ")
    .trim();
}

function getCellText(worksheet: ExcelJS.Worksheet, row: number, col: number) {
  try {
    return worksheet.getCell(row, col).text.trim();
  } catch {
    return "";
  }
}

function getRowText(worksheet: ExcelJS.Worksheet, rowNumber: number) {
  const parts: string[] = [];

  for (let colNumber = 1; colNumber <= worksheet.columnCount; colNumber += 1) {
    const text = getCellText(worksheet, rowNumber, colNumber);

    if (text) {
      parts.push(text);
    }
  }

  return normalizeLookupText(parts.join(" "));
}

function findRowByText(
  worksheet: ExcelJS.Worksheet,
  pattern: RegExp,
  startRow = 1
) {
  for (let rowNumber = startRow; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    if (pattern.test(getRowText(worksheet, rowNumber))) {
      return rowNumber;
    }
  }

  return undefined;
}

function isMergedMasterCell(
  worksheet: ExcelJS.Worksheet,
  row: number,
  col: number
) {
  const cell = worksheet.getCell(row, col);

  return !cell.master || cell.master.address === cell.address;
}

function parseStandardPanels(worksheet: ExcelJS.Worksheet): ParsedPriceRow[] {
  const result: ParsedPriceRow[] = [];
  const headerRow = findRowByText(worksheet, /панели стандартные размеры/);

  if (!headerRow) {
    return result;
  }

  const nextHeaderRow =
    findRowByText(worksheet, /панели по .*размерам/, headerRow + 1) ??
    worksheet.rowCount + 1;

  for (let rowNumber = headerRow + 3; rowNumber < nextHeaderRow; rowNumber += 1) {
    if (!isMergedMasterCell(worksheet, rowNumber, 3)) {
      continue;
    }

    const size = getCellText(worksheet, rowNumber, 3);

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
        ? getCellText(worksheet, rowNumber, item.pricePerM2Col)
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
  const headerRow = findRowByText(worksheet, /панели по .*размерам/);

  if (!headerRow) {
    return result;
  }

  const rowNumber = headerRow + 2;

  for (const item of CUSTOM_PANEL_FINISHES) {
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
  const headerRow = findRowByText(worksheet, /профиль по .*размерам/);

  if (!headerRow) {
    return result;
  }

  let groupNumber = 0;

  for (let rowNumber = headerRow + 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    if (!isMergedMasterCell(worksheet, rowNumber, 3)) {
      continue;
    }

    if (!parsePriceFromCell(worksheet, rowNumber, 3)) {
      continue;
    }

    groupNumber += 1;
    const variantTitle = `Профиль по индивидуальным размерам, группа ${groupNumber}`;

    for (const item of PROFILE_FINISHES) {
      const priceRub = parsePriceFromCell(
        worksheet,
        rowNumber,
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
          variantTitle,
          item.finish,
        ]),

        variantTitle,

        finish: item.finish,

        unit: "м²",
        pricePerM2Rub: priceRub,

        note: "Цена от",
        rowNumber,
      });
    }
  }

  return result;
}
