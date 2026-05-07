import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { parsePriceSource } from "@/lib/prices/priceSource";
import { parsePriceExcel } from "@/lib/prices/parsePriceExcel";
import { importPrices } from "@/lib/prices/importPrices";
import { saveUploadedPdf } from "@/lib/prices/saveUploadedPdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const source = parsePriceSource(formData.get("source"));
    const excelFile = formData.get("priceFile");
    const pdfFile = formData.get("pricePdf");

    if (!source) {
      return NextResponse.json(
        { error: "Неизвестный тип прайса" },
        { status: 400 }
      );
    }

    if (!(excelFile instanceof File)) {
      return NextResponse.json(
        { error: "Excel-файл не найден" },
        { status: 400 }
      );
    }

    if (!(pdfFile instanceof File)) {
      return NextResponse.json(
        { error: "PDF-файл не найден" },
        { status: 400 }
      );
    }

    if (!excelFile.name.toLowerCase().endsWith(".xlsx")) {
      return NextResponse.json(
        { error: "Можно загружать только .xlsx" },
        { status: 400 }
      );
    }

    const excelBuffer = Buffer.from(await excelFile.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "storage", "uploads");

    await mkdir(uploadDir, {
      recursive: true,
    });

    const safeFileName = excelFile.name.replace(/[^\wа-яА-ЯёЁ.\- ]/g, "_");
    const storedFileName = `${Date.now()}-${source.toLowerCase()}-${safeFileName}`;
    const storedFilePath = path.join(uploadDir, storedFileName);

    await writeFile(storedFilePath, excelBuffer);

    const pdfPath = await saveUploadedPdf({
      file: pdfFile,
      source,
    });

    const rows = await parsePriceExcel(excelBuffer, source);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "В файле не найдено цен для импорта" },
        { status: 400 }
      );
    }

    await importPrices({
      source,
      rows,
      originalFileName: excelFile.name,
      storedFilePath,
      pdfPath,
    });

    // After a successful POST, use 303 so the browser follows with GET.
    return NextResponse.redirect(new URL("/admin/prices", request.url), 303);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Ошибка при загрузке прайса",
      },
      {
        status: 500,
      }
    );
  }
}
