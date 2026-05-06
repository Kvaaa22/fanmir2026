import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { parsePriceSource } from "@/lib/prices/priceSource";
import { parsePriceExcel } from "@/lib/prices/parsePriceExcel";
import { importPrices } from "@/lib/prices/importPrices";
import { generatePriceImage } from "@/lib/prices/generatePriceImage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const source = parsePriceSource(formData.get("source"));
    const file = formData.get("priceFile");

    if (!source) {
      return NextResponse.json(
        {
          error: "Неизвестный тип прайса",
        },
        {
          status: 400,
        }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "Файл не найден",
        },
        {
          status: 400,
        }
      );
    }

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      return NextResponse.json(
        {
          error: "Можно загружать только .xlsx",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "storage", "uploads");

    await mkdir(uploadDir, {
      recursive: true,
    });

    const safeFileName = file.name.replace(/[^\wа-яА-ЯёЁ.\- ]/g, "_");

    const storedFileName = `${Date.now()}-${source.toLowerCase()}-${safeFileName}`;

    const storedFilePath = path.join(uploadDir, storedFileName);

    await writeFile(storedFilePath, buffer);

    const rows = await parsePriceExcel(buffer, source);

    if (rows.length === 0) {
      return NextResponse.json(
        {
          error: "В файле не найдено цен для импорта",
        },
        {
          status: 400,
        }
      );
    }

    const result = await importPrices({
      source,
      rows,
      originalFileName: file.name,
      storedFilePath,
    });

    await generatePriceImage(rows, result.importId, source);

    return NextResponse.redirect(
      new URL("/admin/prices", request.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error instanceof Error
          ? error.message
          : "Ошибка при загрузке прайса",
      },
      {
        status: 500,
      }
    );
  }
}
