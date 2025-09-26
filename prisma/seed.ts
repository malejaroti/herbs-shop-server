// prisma/seed.ts
import { PrismaClient } from '../src/generated/prisma';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin-herbs-page@gmail.com";
  const pass  = process.env.ADMIN_PASS  || "admin1234";
  const firstName  = process.env.ADMIN_FIRST_NAME || "Maria";
  const lastName  = process.env.ADMIN_LAST_NAME  || "Tibana";

  const hashed = await bcrypt.hash(pass, 10);

  await prisma.user.upsert({
    where: { email },
    create: { firstName, lastName, email, password: hashed, role: "ADMIN" },
    update: { role: "ADMIN" },
  });
}

main()
  .then(() => console.log("✅ Seed done"))
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
