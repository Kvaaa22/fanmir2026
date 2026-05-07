import { readFile, stat } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type FileType = "excel" | "pdf";

const STORAGE_ROOT = path.resolve(process.cwd(), "storage");

const FILE_CONFIG = {
  excel: {
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fallbackName: "price.xlsx",
  },
  pdf: {
    contentType: "application/pdf",
    fallbackName: "price.pdf",
  },
} satisfies Record<
  FileType,
  {
    contentType: string;
    fallbackName: string;
  }
>;

function parseFileType(value: string | null): FileType | null {
  if (value === "excel" || value === "pdf") {
    return value;
  }

  return null;
}

function isInsideStorage(filePath: string) {
  const relativePath = path.relative(STORAGE_ROOT, filePath);

  return relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

function getStoredFileName(filePath: string, fallbackName: string) {
  const baseName = filePath.split(/[\\/]/).pop() ?? fallbackName;
  const cleanName = baseName.replace(/^\d+-(main|plydex)-/i, "");

  return cleanName || fallbackName;
}

function encodeDispositionFileName(fileName: string) {
  const fallbackName = fileName
    .replace(/[^\x20-\x7E]/g, "_")
    .replace(/["\\]/g, "_");
  const encodedName = encodeURIComponent(fileName)
    .replace(/['()]/g, escape)
    .replace(/\*/g, "%2A");

  return `filename="${fallbackName}"; filename*=UTF-8''${encodedName}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));
  const type = parseFileType(url.searchParams.get("type"));

  if (!Number.isInteger(id) || id <= 0 || !type) {
    return NextResponse.json(
      { error: "Некорректный запрос файла прайса" },
      { status: 400 }
    );
  }

  const priceImport = await prisma.priceImport.findUnique({
    where: {
      id,
    },
  });

  if (!priceImport) {
    return NextResponse.json(
      { error: "Загрузка прайса не найдена" },
      { status: 404 }
    );
  }

  const filePath =
    type === "excel" ? priceImport.storedFilePath : priceImport.pdfPath;

  if (!filePath) {
    return NextResponse.json(
      { error: "Файл для этой загрузки не найден" },
      { status: 404 }
    );
  }

  const resolvedFilePath = path.resolve(filePath);

  if (!isInsideStorage(resolvedFilePath)) {
    return NextResponse.json(
      { error: "Файл находится вне разрешенной папки" },
      { status: 403 }
    );
  }

  const config = FILE_CONFIG[type];
  const fileName =
    type === "excel"
      ? priceImport.originalFileName
      : getStoredFileName(filePath, config.fallbackName);

  try {
    const fileStat = await stat(resolvedFilePath);

    if (!fileStat.isFile()) {
      return NextResponse.json(
        { error: "Файл прайса не найден" },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(resolvedFilePath);
    const disposition =
      type === "excel" || url.searchParams.get("download") === "1"
        ? "attachment"
        : "inline";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": config.contentType,
        "Content-Length": fileStat.size.toString(),
        "Content-Disposition": `${disposition}; ${encodeDispositionFileName(fileName)}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Файл прайса не найден на диске" },
      { status: 404 }
    );
  }
}
