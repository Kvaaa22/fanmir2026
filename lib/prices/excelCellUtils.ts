import type ExcelJS from "exceljs";

export function getText(
  worksheet: ExcelJS.Worksheet,
  row: number,
  col: number
) {
  return worksheet.getCell(row, col).text.trim();
}

export function parseNumberFromCell(
  worksheet: ExcelJS.Worksheet,
  row: number,
  col: number
): number | undefined {
  const cell = worksheet.getCell(row, col);
  const value = cell.value;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const text = cell.text
    .replace(/\s/g, "")
    .replace(",", ".")
    .replace("от", "")
    .replace("руб.", "")
    .replace("₽", "")
    .trim();

  if (!text || text === "-") {
    return undefined;
  }

  const number = Number(text);

  return Number.isFinite(number) ? number : undefined;
}

export function parsePriceFromCell(
  worksheet: ExcelJS.Worksheet,
  row: number,
  col: number
): number | undefined {
  const number = parseNumberFromCell(worksheet, row, col);

  if (number === undefined) {
    return undefined;
  }

  return Math.round(number);
}

export function normalizeSize(value: string) {
  return value
    .trim()
    .replaceAll("х", "x")
    .replaceAll("*", "x")
    .replace(/\s+/g, "");
}

export function calculatePricePerM2(
  priceRub: number | undefined,
  areaM2: number | undefined
) {
  if (!priceRub || !areaM2) {
    return undefined;
  }

  return Math.round((priceRub / areaM2) * 100) / 100;
}