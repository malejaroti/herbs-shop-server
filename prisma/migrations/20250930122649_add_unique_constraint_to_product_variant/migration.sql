/*
  Warnings:

  - A unique constraint covering the columns `[productId,name]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_name_key" ON "public"."ProductVariant"("productId", "name");
