import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import ExcelJS from "exceljs";
import prisma from "@/lib/prisma";
import { PRICE_SOURCE, type PriceSourceValue } from "@/lib/prices/priceSource";
import { isInsideStorage, resolveStoragePath } from "@/lib/storage/paths";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Наши цены | Фанерный мир",
  description: "Актуальные цены на фанеру и продукцию Plydex.",
};

type ExcelCell = {
  key: string;
  value: string;
  imageSrc?: string;
  imageVariant?: "cell" | "type";
  colSpan: number;
  rowSpan: number;
  isHeader: boolean;
  style: CSSProperties;
};

type ExcelRow = {
  key: string;
  cells: ExcelCell[];
  height?: number;
};

type ExcelTable = {
  rows: ExcelRow[];
  columnWidths: number[];
};

type ExcelTableGroup = {
  key: string;
  caption: string;
  rows: ExcelRow[];
};

type PriceSection = {
  title: string;
  source: PriceSourceValue;
  table: ExcelTable | null;
  hasPdf: boolean;
};

const EMPTY_VALUE = "—";
const MIN_COLUMN_WIDTH = 44;
const MAX_COLUMN_WIDTH = 120;

function isPricePerM2ColumnTitle(value: string) {
  const normalizedValue = value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/м²/g, "м2")
    .replace(/м\.кв\.?/g, "м2")
    .replace(/мкв/g, "м2")
    .replace(/кв\.м\.?/g, "м2");

  return (
    normalizedValue.includes("м2") &&
    (normalizedValue.includes("цена") ||
      normalizedValue.includes("руб") ||
      normalizedValue.includes("1м2") ||
      normalizedValue.includes("руб./м2") ||
      normalizedValue.includes("руб/м2"))
  );
}

function getPdfHref(source: PriceSourceValue) {
  const params = new URLSearchParams({
    source,
    download: "1",
  });

  return `/api/price-pdf/latest?${params.toString()}`;
}

function normalizeColor(argb?: string) {
  if (!argb || argb.length < 6) {
    return undefined;
  }

  return `#${argb.slice(-6)}`;
}

function getCellText(cell: ExcelJS.Cell) {
  const value = cell.value;

  if (value == null) {
    return "";
  }

  if (typeof value === "object") {
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((item) => item.text).join("");
    }

    if ("text" in value && typeof value.text === "string") {
      return value.text;
    }

    if ("result" in value && value.result != null) {
      return String(value.result);
    }
  }

  return cell.text || String(value);
}

function getEffectiveCell(cell: ExcelJS.Cell) {
  return cell.isMerged && cell.master ? cell.master : cell;
}

function getUsedBounds(worksheet: ExcelJS.Worksheet) {
  let minRow = Number.POSITIVE_INFINITY;
  let maxRow = 0;
  let minCol = Number.POSITIVE_INFINITY;
  let maxCol = 0;

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const text = getCellText(getEffectiveCell(cell)).trim();

      if (!text) {
        return;
      }

      minRow = Math.min(minRow, rowNumber);
      maxRow = Math.max(maxRow, rowNumber);
      minCol = Math.min(minCol, colNumber);
      maxCol = Math.max(maxCol, colNumber);
    });
  });

  if (!maxRow || !maxCol) {
    return null;
  }

  return {
    minRow,
    maxRow,
    minCol,
    maxCol,
  };
}

function getMergeSpan(
  worksheet: ExcelJS.Worksheet,
  rowNumber: number,
  colNumber: number,
  maxRow: number,
  maxCol: number
) {
  const cell = worksheet.getCell(rowNumber, colNumber);

  if (!cell.isMerged || !cell.master || cell.master.address !== cell.address) {
    return {
      colSpan: 1,
      rowSpan: 1,
    };
  }

  let lastRow = rowNumber;
  let lastCol = colNumber;

  for (let row = rowNumber; row <= maxRow; row += 1) {
    for (let col = colNumber; col <= maxCol; col += 1) {
      const current = worksheet.getCell(row, col);

      if (current.isMerged && current.master?.address === cell.address) {
        lastRow = Math.max(lastRow, row);
        lastCol = Math.max(lastCol, col);
      }
    }
  }

  return {
    colSpan: lastCol - colNumber + 1,
    rowSpan: lastRow - rowNumber + 1,
  };
}

function getCellStyle(cell: ExcelJS.Cell): CSSProperties {
  const fill = cell.fill;
  const font = cell.font;
  const alignment = cell.alignment;
  const border = cell.border;
  const style: CSSProperties = {};

  if (font?.italic) {
    style.fontStyle = "italic";
  }

  if (font?.color?.argb) {
    style.color = normalizeColor(font.color.argb);
  }

  if (
    fill?.type === "pattern" &&
    "fgColor" in fill &&
    fill.fgColor?.argb &&
    fill.fgColor.argb !== "00000000"
  ) {
    style.backgroundColor = normalizeColor(fill.fgColor.argb);
  }

  if (alignment?.horizontal) {
    style.textAlign =
      alignment.horizontal === "centerContinuous"
        ? "center"
        : (alignment.horizontal as CSSProperties["textAlign"]);
  }

  if (alignment?.vertical) {
    style.verticalAlign = alignment.vertical as CSSProperties["verticalAlign"];
  }

  if (alignment?.wrapText) {
    style.whiteSpace = "normal";
  }

  if (border?.top || border?.right || border?.bottom || border?.left) {
    style.borderColor = "#b8b8b8";
  }

  return style;
}

function getReplacementImage(
  source: PriceSourceValue,
  rowNumber: number,
  colNumber: number
) {
  if (source !== PRICE_SOURCE.PLYDEX || colNumber !== 2) {
    return undefined;
  }

  if (rowNumber >= 9 && rowNumber <= 14) {
    return "/img/prices/paneliPlydexStandard.jpg";
  }

  if (rowNumber >= 21 && rowNumber <= 23) {
    return "/img/prices/ProfilIndivid1.png";
  }

  if (rowNumber >= 24 && rowNumber <= 26) {
    return "/img/prices/ProfilIndivid2.png";
  }

  if (rowNumber >= 27 && rowNumber <= 29) {
    return "/img/prices/ProfilIndivid3.png";
  }

  return undefined;
}

function normalizeCellValue(value: string) {
  const trimmedValue = value.trim();

  if (/^[-–—]+$/.test(trimmedValue)) {
    return EMPTY_VALUE;
  }

  return trimmedValue || EMPTY_VALUE;
}

function getMainPriceTypeImage(value: string) {
  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue) {
    return undefined;
  }

  if (normalizedValue.includes("хвойн")) {
    return "/img/prices/fanera-xvoinaya.png";
  }

  if (normalizedValue.includes("ламинирован")) {
    return "/img/prices/fanera-laminirovannaya.png";
  }

  if (normalizedValue.includes("берез") || normalizedValue.includes("берёз")) {
    return "/img/prices/fanera-berezovaya.png";
  }

  if (normalizedValue.includes("osb") || normalizedValue.includes("ориентирован")) {
    return "/img/prices/pliti-osb-3.png";
  }

  if (normalizedValue.includes("древесно-струж") || normalizedValue.includes("дсп")) {
    return "/img/prices/dsp.png";
  }

  if (
    normalizedValue.includes("древесно-волок") ||
    normalizedValue.includes("двп") ||
    normalizedValue.includes("хдф")
  ) {
    return "/img/prices/dvp.png";
  }

  if (normalizedValue.includes("мдф")) {
    return "/img/prices/mdf.png";
  }

  return undefined;
}

function isProductTypeRow(row: ExcelRow, columnCount: number) {
  const value = row.cells[0]?.value.trim();

  return (
    row.cells.length === 1 &&
    row.cells[0]?.colSpan === columnCount &&
    !row.cells[0]?.imageSrc &&
    Boolean(value) &&
    value !== EMPTY_VALUE
  );
}

function isEmphasisRow(row: ExcelRow) {
  const emphasisValues = [
    "сорт",
    "листов в м3",
    "тип поверхности пленки",
    "формат 2500*1250 мм",
    "формат 2500* 1250мм",
    "наименование",
    "формат мм",
    "формат, мм",
    "вид",
    "название",
    "размеры",
  ];

  return row.cells.some((cell) => {
    const normalizedValue = cell.value.trim().toLowerCase().replace(/\s+/g, " ");

    return emphasisValues.includes(normalizedValue);
  });
}

function getProductName(row: ExcelRow | undefined) {
  const productName = row?.cells[0]?.value;

  if (!productName || productName === EMPTY_VALUE) {
    return "";
  }

  return productName.replace(/[.:;,\s]+$/, "");
}

function getProductCaption(row: ExcelRow | undefined, source: PriceSourceValue) {
  const normalizedProductName = getProductName(row);

  if (!normalizedProductName) {
    return "";
  }

  if (source === PRICE_SOURCE.PLYDEX) {
    return normalizedProductName;
  }

  const captionProductName = normalizedProductName.replace(/^Фанера\b/i, "фанеру");

  return `Цена за лист на ${captionProductName}`;
}

function getImageSize(cell: ExcelCell) {
  if (cell.imageSrc === "/img/prices/mdf.png") {
    return {
      height: 15,
      width: 1300,
    };
  }

  if (cell.imageSrc === "/img/prices/plydex.png") {
    return {
      height: 22,
      width: 1101,
    };
  }

  if (cell.imageVariant === "type") {
    return {
      height: 15,
      width: 1100,
    };
  }

  return {
    height: 120,
    width: 160,
  };
}

function getResponsiveColumnWidth(width: number) {
  const viewportWidth = Number(((width / 1211) * 100).toFixed(2));

  return `clamp(32px, ${viewportWidth}vw, ${width}px)`;
}

function getGroupColumnWidth(group: ExcelTableGroup, width: number, index: number) {
  const productName = getProductName(group.rows[0]).toLowerCase();

  if (productName.includes("хвойн") && index < 5) {
    return width / 3;
  }

  return width;
}

function splitTableByProductTypes(
  table: ExcelTable,
  source: PriceSourceValue
): ExcelTableGroup[] {
  const groups: ExcelTableGroup[] = [];
  let currentRows: ExcelRow[] = [];

  table.rows.forEach((row) => {
    if (isProductTypeRow(row, table.columnWidths.length) && currentRows.length) {
      groups.push({
        key: groups.length.toString(),
        caption: getProductCaption(currentRows[0], source),
        rows: currentRows,
      });

      currentRows = [];
    }

    currentRows.push(row);
  });

  if (currentRows.length) {
    groups.push({
      key: groups.length.toString(),
      caption: getProductCaption(currentRows[0], source),
      rows: currentRows,
    });
  }

  return groups;
}

async function readExcelTable(
  filePath: string,
  source: PriceSourceValue
): Promise<ExcelTable | null> {
  const workbook = new ExcelJS.Workbook();
  const resolvedFilePath = resolveStoragePath(filePath);

  if (!isInsideStorage(resolvedFilePath)) {
    console.warn("[prices] Price spreadsheet is outside storage.");
    return null;
  }

  try {
    await workbook.xlsx.readFile(resolvedFilePath);
  } catch (error) {
    console.warn("[prices] Price spreadsheet is unavailable:", error);
    return null;
  }

  const worksheet = workbook.getWorksheet("Лист1") ?? workbook.worksheets[0];

  if (!worksheet) {
    return null;
  }

  const bounds = getUsedBounds(worksheet);

  if (!bounds) {
    return null;
  }

  const skippedCells = new Set<string>();
  const hiddenColumns = new Set<number>();
  const rows: ExcelRow[] = [];
  const columnWidths: number[] = [];
  const shouldTrimMainPriceColumns = source === PRICE_SOURCE.MAIN;

  for (let col = bounds.minCol; col <= bounds.maxCol; col += 1) {
    if (shouldTrimMainPriceColumns && col >= 15) {
      hiddenColumns.add(col);
      continue;
    }

    for (let row = bounds.minRow; row <= bounds.maxRow; row += 1) {
      const cell = getEffectiveCell(worksheet.getCell(row, col));
      const text = getCellText(cell).trim();

      if (shouldTrimMainPriceColumns && isPricePerM2ColumnTitle(text)) {
        hiddenColumns.add(col);
        break;
      }
    }
  }

  for (let col = bounds.minCol; col <= bounds.maxCol; col += 1) {
    if (hiddenColumns.has(col)) {
      continue;
    }

    const width = worksheet.getColumn(col).width;
    columnWidths.push(
      Math.max(
        MIN_COLUMN_WIDTH,
        Math.min(MAX_COLUMN_WIDTH, Math.round((width ?? 12) * 5.2))
      )
    );
  }

  for (let rowNumber = bounds.minRow; rowNumber <= bounds.maxRow; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const cells: ExcelCell[] = [];

    for (let colNumber = bounds.minCol; colNumber <= bounds.maxCol; colNumber += 1) {
      const key = `${rowNumber}:${colNumber}`;

      if (hiddenColumns.has(colNumber)) {
        continue;
      }

      if (skippedCells.has(key)) {
        continue;
      }

      const cell = worksheet.getCell(rowNumber, colNumber);

      if (cell.isMerged && cell.master?.address !== cell.address) {
        continue;
      }

      const { colSpan: originalColSpan, rowSpan } = getMergeSpan(
        worksheet,
        rowNumber,
        colNumber,
        bounds.maxRow,
        bounds.maxCol
      );
      let colSpan = 0;

      for (let col = colNumber; col < colNumber + originalColSpan; col += 1) {
        if (!hiddenColumns.has(col)) {
          colSpan += 1;
        }
      }

      if (colSpan === 0) {
        continue;
      }

      for (let rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
        for (let colOffset = 0; colOffset < originalColSpan; colOffset += 1) {
          if (rowOffset || colOffset) {
            skippedCells.add(`${rowNumber + rowOffset}:${colNumber + colOffset}`);
          }
        }
      }

      const effectiveCell = getEffectiveCell(cell);
      const text = getCellText(effectiveCell).trim();
      const imageSrc = getReplacementImage(source, rowNumber, colNumber);

      cells.push({
        key,
        value: normalizeCellValue(text),
        imageSrc,
        colSpan,
        rowSpan,
        isHeader: rowNumber <= bounds.minRow + 1 || Boolean(effectiveCell.font?.bold),
        style: getCellStyle(effectiveCell),
      });
    }

    if (
      source === PRICE_SOURCE.PLYDEX &&
      cells.some((cell) => cell.value.toLowerCase().includes("прайс лист"))
    ) {
      continue;
    }

    const excelRow = {
      key: rowNumber.toString(),
      cells,
      height: row.height,
    };

    rows.push(excelRow);

    const firstCellValue = cells.find((cell) => cell.value !== EMPTY_VALUE)?.value ?? "";
    const isFullWidthProductTypeRow = isProductTypeRow(excelRow, columnWidths.length);
    const typeImage =
      source === PRICE_SOURCE.MAIN &&
      isFullWidthProductTypeRow
        ? getMainPriceTypeImage(firstCellValue)
        : undefined;
    const plydexLineImage =
      source === PRICE_SOURCE.PLYDEX && isFullWidthProductTypeRow
        ? "/img/prices/plydex.png"
        : undefined;
    const lineImage = typeImage ?? plydexLineImage;

    if (lineImage) {
      rows.push({
        key: `${rowNumber}:type-image`,
        cells: [
          {
            key: `${rowNumber}:type-image-cell`,
            value: "",
            imageSrc: lineImage,
            imageVariant: "type",
            colSpan: columnWidths.length,
            rowSpan: 1,
            isHeader: false,
            style: {},
          },
        ],
      });

    }
  }

  return {
    rows,
    columnWidths,
  };
}

async function getPriceSection(
  title: string,
  source: PriceSourceValue
): Promise<PriceSection> {
  const [latestExcelImport, latestPdfImport] = await Promise.all([
    prisma.priceImport.findFirst({
      where: {
        source,
        status: "success",
        storedFilePath: {
          not: null,
        },
      },
      select: {
        storedFilePath: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.priceImport.findFirst({
      where: {
        source,
        status: "success",
        pdfPath: {
          not: null,
        },
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    title,
    source,
    table: latestExcelImport?.storedFilePath
      ? await readExcelTable(latestExcelImport.storedFilePath, source)
      : null,
    hasPdf: Boolean(latestPdfImport),
  };
}

function PriceTable({ section }: { section: PriceSection }) {
  const table = section.table;
  const tableGroups = table ? splitTableByProductTypes(table, section.source) : [];
  const tableClassName = [
    styles.excelTable,
    section.source === PRICE_SOURCE.PLYDEX ? styles.plydexTable : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={styles.priceSection} aria-labelledby={`${section.source}-title`}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle} id={`${section.source}-title`}>
          {section.title}
        </h2>

        {section.hasPdf ? (
          <a className={styles.downloadButton} href={getPdfHref(section.source)}>
            Скачать прайс в PDF
          </a>
        ) : (
          <span className={styles.downloadUnavailable}>PDF пока не загружен</span>
        )}
      </div>

      {table ? (
        <div className={styles.tableGroups}>
          {tableGroups.map((group) => (
            <figure className={styles.tableGroup} key={group.key}>
              {group.caption ? (
                <figcaption className={styles.tableCaption}>{group.caption}</figcaption>
              ) : null}

              <div className={styles.tableWrap}>
                <table className={tableClassName}>
                  <colgroup>
                    {table.columnWidths.map((width, index) => (
                      <col
                        key={index}
                        style={{
                          width: getResponsiveColumnWidth(
                            getGroupColumnWidth(group, width, index)
                          ),
                        }}
                      />
                    ))}
                  </colgroup>

                  <tbody>
                    {group.rows.map((row, rowIndex) => (
                      <tr key={row.key} style={row.height ? { height: row.height } : undefined}>
                        {row.cells.map((cell) => {
                          const CellTag = cell.isHeader ? "th" : "td";
                          const isTypeCell = isProductTypeRow(row, table.columnWidths.length);
                          const isEmphasisCell = isEmphasisRow(row);
                          const isTypeImageCell = cell.imageVariant === "type";
                          const isAfterImageRow = Boolean(
                            group.rows[rowIndex - 1]?.cells.some(
                              (item) => item.imageVariant === "type"
                            )
                          );

                          return (
                            <CellTag
                            className={[
                              isTypeImageCell ? styles.imageCell : null,
                              isTypeCell ? styles.productTypeCell : null,
                              isEmphasisCell ? styles.emphasisCell : null,
                              isAfterImageRow ? styles.afterImageCell : null,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            key={cell.key}
                            colSpan={cell.colSpan}
                            rowSpan={cell.rowSpan}
                            style={cell.style}
                          >
                            {cell.imageSrc ? (
                              (() => {
                                const imageSize = getImageSize(cell);

                                return (
                                  <Image
                                    alt=""
                                    className={[
                                      styles.excelCellImage,
                                      cell.imageVariant === "type" ? styles.typeImage : styles.cellImage,
                                    ]
                                      .filter(Boolean)
                                      .join(" ")}
                                    height={imageSize.height}
                                    sizes="100vw"
                                    src={cell.imageSrc}
                                    width={imageSize.width}
                                  />
                                );
                              })()
                            ) : (
                              cell.value
                            )}
                            </CellTag>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </figure>
          ))}
        </div>
      ) : (
        <p className={styles.emptyText}>Прайс пока не загружен.</p>
      )}
    </section>
  );
}

export default async function PricesPage() {
  await connection();

  const [mainSection, plydexSection] = await Promise.all([
    getPriceSection("Цены на фанеру", PRICE_SOURCE.MAIN),
    getPriceSection("Цены на plydex", PRICE_SOURCE.PLYDEX),
  ]);

  return (
    <section className={styles.pricesPage} aria-label="Наши цены">
      <div className={styles.pricesFrame}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Актуальные прайсы</span>
          <h1 className={styles.title}>Наши цены</h1>
        </header>

        <div className={styles.sections}>
          <PriceTable section={mainSection} />
          <PriceTable section={plydexSection} />
        </div>
      </div>
    </section>
  );
}
