-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "categoryTitle" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Price" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "variantKey" TEXT NOT NULL,
    "variantTitle" TEXT,
    "sort" TEXT,
    "surface" TEXT,
    "finish" TEXT,
    "thicknessMm" REAL,
    "size" TEXT,
    "unit" TEXT NOT NULL,
    "priceRub" INTEGER,
    "pricePerM2Rub" REAL,
    "note" TEXT,
    "rowNumber" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PriceImport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "storedFilePath" TEXT,
    "imagePath" TEXT,
    "rowsCount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "errorText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Price_source_idx" ON "Price"("source");

-- CreateIndex
CREATE INDEX "Price_productId_idx" ON "Price"("productId");

-- CreateIndex
CREATE INDEX "Price_thicknessMm_idx" ON "Price"("thicknessMm");

-- CreateIndex
CREATE INDEX "Price_sort_idx" ON "Price"("sort");

-- CreateIndex
CREATE INDEX "Price_finish_idx" ON "Price"("finish");

-- CreateIndex
CREATE UNIQUE INDEX "Price_source_productId_variantKey_key" ON "Price"("source", "productId", "variantKey");
