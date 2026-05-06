import type { PriceSourceValue } from "./priceSource";
import { PRICE_SOURCE } from "./priceSource";
import type { ParsedPriceRow } from "./priceTypes";
import { parseMainPriceExcel } from "./parseMainPriceExcel";
import { parsePlydexPriceExcel } from "./parsePlydexPriceExcel";

export async function parsePriceExcel(
  buffer: Buffer,
  source: PriceSourceValue
): Promise<ParsedPriceRow[]> {
  if (source === PRICE_SOURCE.MAIN) {
    return parseMainPriceExcel(buffer);
  }

  if (source === PRICE_SOURCE.PLYDEX) {
    return parsePlydexPriceExcel(buffer);
  }

  throw new Error(`Неизвестный тип прайса: ${source}`);
}