import { config } from "dotenv";

// .env.local (app secrets) takes priority over .env (database URLs).
config({ path: [".env.local", ".env"] });
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const userId = process.env.ADMIN_USER_ID;
  const password = process.env.ADMIN_PASSWORD;

  if (!userId || !password) {
    throw new Error("Set ADMIN_USER_ID and ADMIN_PASSWORD in .env before seeding.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.login.upsert({
    where: { userId },
    update: { passwordHash },
    create: { userId, passwordHash },
  });

  console.log(`Admin login "${userId}" is ready.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
