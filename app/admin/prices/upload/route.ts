import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import prisma from "@/lib/prisma";
import {
  getAdminTokenFromRequest,
  verifyAdminCsrfToken,
  verifyAdminToken,
} from "@/lib/admin/session";
import { parsePriceSource } from "@/lib/prices/priceSource";
import { parsePriceExcel } from "@/lib/prices/parsePriceExcel";
import { importPrices } from "@/lib/prices/importPrices";
import { saveUploadedPdf } from "@/lib/prices/saveUploadedPdf";
import {
  createStorageRelativePath,
  resolveStoragePath,
} from "@/lib/storage/paths";

export const runtime = "nodejs";

const maxExcelSizeBytes = 10 * 1024 * 1024;
const maxPdfSizeBytes = 20 * 1024 * 1024;

function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.name.trim() !== "" && value.size > 0;
}

export async function POST(request: Request) {
  try {
    const adminToken = getAdminTokenFromRequest(request);

    if (!(await verifyAdminToken(adminToken))) {
      return NextResponse.json({ error: "Требуется вход в админку" }, { status: 401 });
    }

    const formData = await request.formData().catch(() => null);

    if (!formData) {
      return NextResponse.json(
        { error: "Некорректные данные формы" },
        { status: 400 }
      );
    }

    const csrfToken = String(formData.get("csrfToken") ?? "");

    if (!verifyAdminCsrfToken(adminToken, csrfToken)) {
      return NextResponse.json(
        { error: "Форма устарела. Обновите страницу и попробуйте еще раз." },
        { status: 403 }
      );
    }

    const source = parsePriceSource(formData.get("source"));
    const excelFile = formData.get("priceFile");
    const pdfFile = formData.get("pricePdf");
    const uploadedExcelFile = isUploadedFile(excelFile) ? excelFile : null;
    const uploadedPdfFile = isUploadedFile(pdfFile) ? pdfFile : null;

    if (!source) {
      return NextResponse.json(
        { error: "Неизвестный тип прайса" },
        { status: 400 }
      );
    }

    if (!uploadedExcelFile && !uploadedPdfFile) {
      return NextResponse.json(
        { error: "Выберите Excel-файл, PDF-файл или оба файла" },
        { status: 400 }
      );
    }

    if (
      uploadedExcelFile &&
      !uploadedExcelFile.name.toLowerCase().endsWith(".xlsx")
    ) {
      return NextResponse.json(
        { error: "Можно загружать только .xlsx" },
        { status: 400 }
      );
    }

    if (uploadedExcelFile && uploadedExcelFile.size > maxExcelSizeBytes) {
      return NextResponse.json(
        { error: "Excel-файл не должен быть больше 10 МБ" },
        { status: 400 }
      );
    }

    if (
      uploadedPdfFile &&
      !uploadedPdfFile.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "Можно загружать только PDF-файл" },
        { status: 400 }
      );
    }

    if (uploadedPdfFile && uploadedPdfFile.size > maxPdfSizeBytes) {
      return NextResponse.json(
        { error: "PDF-файл не должен быть больше 20 МБ" },
        { status: 400 }
      );
    }

    const pdfPath = uploadedPdfFile
      ? await saveUploadedPdf({
          file: uploadedPdfFile,
          source,
        })
      : undefined;

    if (!uploadedExcelFile) {
      if (!uploadedPdfFile) {
        return NextResponse.json(
          { error: "PDF-файл не найден" },
          { status: 400 }
        );
      }

      await prisma.priceImport.create({
        data: {
          source,
          originalFileName: uploadedPdfFile.name,
          pdfPath,
          rowsCount: 0,
          status: "success",
        },
      });

      return NextResponse.redirect(new URL("/admin/prices", request.url), 303);
    }

    const excelBuffer = Buffer.from(await uploadedExcelFile.arrayBuffer());

    const uploadDir = resolveStoragePath("uploads");

    await mkdir(uploadDir, {
      recursive: true,
    });

    const safeFileName = uploadedExcelFile.name.replace(/[^\wа-яА-ЯёЁ.\- ]/g, "_");
    const storedFileName = `${Date.now()}-${source.toLowerCase()}-${safeFileName}`;
    const storedFilePath = createStorageRelativePath("uploads", storedFileName);

    await writeFile(resolveStoragePath(storedFilePath), excelBuffer);

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
      originalFileName: uploadedExcelFile.name,
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
