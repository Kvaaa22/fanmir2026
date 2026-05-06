import { PriceSource } from "@/lib/generated/prisma/enums";

export const PRICE_SOURCE = {
  MAIN: PriceSource.MAIN,
  PLYDEX: PriceSource.PLYDEX,
} as const;

export type PriceSourceValue =
  (typeof PRICE_SOURCE)[keyof typeof PRICE_SOURCE];

export function parsePriceSource(value: FormDataEntryValue | null) {
  if (value === PRICE_SOURCE.MAIN) {
    return PRICE_SOURCE.MAIN;
  }

  if (value === PRICE_SOURCE.PLYDEX) {
    return PRICE_SOURCE.PLYDEX;
  }

  return null;
}