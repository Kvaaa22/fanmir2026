import { mkdir, writeFile } from "fs/promises";
import path from "path";

type SaveUploadedPdfParams = {
  file: File;
  source: string;
};

export async function saveUploadedPdf({
  file,
  source,
}: SaveUploadedPdfParams) {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Можно загружать только PDF-файл");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const pdfDir = path.join(process.cwd(), "storage", "pdf");

  await mkdir(pdfDir, {
    recursive: true,
  });

  const safeFileName = file.name.replace(/[^\wа-яА-ЯёЁ.\- ]/g, "_");
  const storedFileName = `${Date.now()}-${source.toLowerCase()}-${safeFileName}`;
  const storedFilePath = path.join(pdfDir, storedFileName);

  await writeFile(storedFilePath, buffer);

  return storedFilePath;
}