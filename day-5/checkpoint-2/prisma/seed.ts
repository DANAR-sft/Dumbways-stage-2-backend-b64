import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding data awal...");

  const hashedPassword = await bcrypt.hash("password123", 10);
  const hashedAdmin = await bcrypt.hash("admin123", 10);

  await prisma.supplier.createMany({
    data: [
      {
        name: "Supplier A",
        email: "supplier@example.com",
        password: hashedPassword,
      },
      {
        name: "Admin",
        email: "admin@example.com",
        password: hashedAdmin,
        role: "admin",
      },
    ],
  });

  const supplier = await prisma.supplier.findFirst({
    where: { email: "supplier@example.com" },
  });
  if (supplier) {
    await prisma.product.createMany({
      data: [
        { name: "Laptop", price: 15000000, supplierId: supplier.id },
        { name: "Mouse", price: 250000, supplierId: supplier.id },
      ],
    });
  }

  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
