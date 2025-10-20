import { PrismaClient } from "../src/generated/prisma";
const products = require("./seed-data-products.json");
const productsVariants = require("./seed-data-productVariants.json");
const prisma = new PrismaClient();

async function seedDatabase() {
//  await prisma.product.createMany({ data: products });
 await prisma.productVariant.createMany({ data: productsVariants });
}
seedDatabase()
 .then(() => console.log("Seeding complete"))
 .catch((e) => {
  console.error(e);
  process.exit(1);
 })
 .finally(async () => {
  await prisma.$disconnect();
 });