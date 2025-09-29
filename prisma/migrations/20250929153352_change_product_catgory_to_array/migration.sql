-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('EUR');

-- CreateEnum
CREATE TYPE "public"."ProductCategory" AS ENUM ('HERBS', 'SPICES');

-- CreateEnum
CREATE TYPE "public"."TaxClass" AS ENUM ('STANDARD', 'REDUCED', 'EXEMPT');

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "latinName" TEXT,
    "bulkGrams" INTEGER NOT NULL DEFAULT 0,
    "reorderAtGrams" INTEGER,
    "descriptionMd" TEXT,
    "originCountry" TEXT,
    "organicCert" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "categories" "public"."ProductCategory"[],
    "images" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "packSizeGrams" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" "public"."Currency" NOT NULL DEFAULT 'EUR',
    "taxClass" "public"."TaxClass" NOT NULL DEFAULT 'REDUCED',
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "public"."Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "public"."ProductVariant"("sku");

-- AddForeignKey
ALTER TABLE "public"."ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
