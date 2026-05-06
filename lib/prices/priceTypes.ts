import type { PriceSourceValue } from "./priceSource";

export type ParsedPriceRow = {
  source: PriceSourceValue;

  productSlug: string;
  productTitle: string;

  categorySlug: string;
  categoryTitle: string;

  variantKey: string;
  variantTitle?: string;

  sort?: string;
  surface?: string;
  finish?: string;

  thicknessMm?: number;
  size?: string;

  unit: string;

  priceRub?: number;
  pricePerM2Rub?: number;

  note?: string;
  rowNumber?: number;
};

export function createVariantKey(
  parts: Array<string | number | null | undefined>
) {
  return parts
    .filter((part) => {
      return part !== null && part !== undefined && String(part).trim() !== "";
    })
    .map((part) => {
      return String(part)
        .trim()
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll("/", "-")
        .replaceAll("х", "x")
        .replaceAll("*", "x");
    })
    .join("__");
}