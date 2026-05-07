-- AlterTable
ALTER TABLE "PriceImport" ADD COLUMN "pdfPath" TEXT;

-- CreateIndex
CREATE INDEX "PriceImport_source_idx" ON "PriceImport"("source");

-- CreateIndex
CREATE INDEX "PriceImport_createdAt_idx" ON "PriceImport"("createdAt");
