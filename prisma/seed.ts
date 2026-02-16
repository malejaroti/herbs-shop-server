import { PrismaClient } from "../src/generated/prisma";
import products from "./seed-data-products.json";
import productsVariants from "./seed-data-productVariants.json";
const prisma = new PrismaClient();

async function seedDatabase() {
  // Products must be seeded first, because ProductVariants reference a productId (foreign key).
  // Seeding variants before products would cause a foreign key constraint error (P2003).
  await prisma.product.createMany({ data: products });
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