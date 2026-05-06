import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import type { PriceSourceValue } from "./priceSource";
import { PRICE_SOURCE } from "./priceSource";
import type { ParsedPriceRow } from "./priceTypes";

export async function generatePriceImage(
  rows: ParsedPriceRow[],
  importId: number,
  source: PriceSourceValue
) {
  const safeRows = rows.slice(0, 300);

  const width = 1400;
  const rowHeight = 44;
  const headerHeight = 130;
  const height = headerHeight + safeRows.length * rowHeight + 80;

  const title =
    source === PRICE_SOURCE.MAIN
      ? "Прайс-лист"
      : "Прайс-лист Plydex";

  const tableRows = safeRows
    .map((row, index) => {
      const y = headerHeight + index * rowHeight;

      const price = row.priceRub
        ? `${row.priceRub.toLocaleString("ru-RU")} ₽/${row.unit}`
        : row.pricePerM2Rub
          ? `${row.pricePerM2Rub.toLocaleString("ru-RU")} ₽/${row.unit}`
          : "по запросу";

      return `
        <text x="40" y="${y}" font-size="18">${escapeXml(row.categoryTitle)}</text>
        <text x="250" y="${y}" font-size="18">${escapeXml(row.productTitle)}</text>
        <text x="650" y="${y}" font-size="18">${escapeXml(row.variantTitle ?? "")}</text>
        <text x="1030" y="${y}" font-size="18">${escapeXml(row.size ?? "")}</text>
        <text x="1170" y="${y}" font-size="18" font-weight="700">${escapeXml(price)}</text>
        <line x1="30" y1="${y + 14}" x2="1370" y2="${y + 14}" stroke="#dddddd" />
      `;
    })
    .join("");

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff" />

      <text x="40" y="55" font-size="36" font-weight="700">
        ${escapeXml(title)}
      </text>

      <text x="40" y="90" font-size="20" fill="#666666">
        Сгенерировано автоматически после загрузки Excel
      </text>

      <rect x="30" y="105" width="1340" height="42" fill="#111111" />

      <text x="40" y="132" font-size="17" font-weight="700" fill="#ffffff">Категория</text>
      <text x="250" y="132" font-size="17" font-weight="700" fill="#ffffff">Товар</text>
      <text x="650" y="132" font-size="17" font-weight="700" fill="#ffffff">Вариант</text>
      <text x="1030" y="132" font-size="17" font-weight="700" fill="#ffffff">Размер</text>
      <text x="1170" y="132" font-size="17" font-weight="700" fill="#ffffff">Цена</text>

      ${tableRows}
    </svg>
  `;

  const outputDir = path.join(process.cwd(), "storage", "generated");

  await mkdir(outputDir, {
    recursive: true,
  });

  const imagePath = path.join(
    outputDir,
    `price-${source.toLowerCase()}-${importId}.png`
  );

  await sharp(Buffer.from(svg)).png().toFile(imagePath);

  await prisma.priceImport.update({
    where: {
      id: importId,
    },
    data: {
      imagePath,
    },
  });

  return imagePath;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}