/*
  Warnings:

  - You are about to alter the column `price` on the `ProductVariant` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(8,2)`.

*/
-- AlterTable
ALTER TABLE "public"."ProductVariant" ALTER COLUMN "price" SET DATA TYPE DECIMAL(8,2);
