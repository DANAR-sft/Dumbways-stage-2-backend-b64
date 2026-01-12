import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test supplier
  const hashedPassword = await bcrypt.hash("password123", 12);

  const supplier = await prisma.supplier.upsert({
    where: { email: "supplier@test.com" },
    update: {},
    create: {
      email: "supplier@test.com",
      username: "testsupplier",
      password: hashedPassword,
      name: "Test Supplier",
      phone: "081234567890",
      address: "Jalan Test No. 123, Jakarta",
    },
  });

  console.log("✅ Test supplier created:", {
    id: supplier.id,
    email: supplier.email,
    username: supplier.username,
    name: supplier.name,
  });

  // Create test products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: "Product Test 1",
        price: 50000,
        imageUrl: "/uploads/test-product-1.jpg",
      },
    }),
    prisma.product.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: "Product Test 2",
        price: 75000,
        imageUrl: "/uploads/test-product-2.jpg",
      },
    }),
  ]);

  console.log("✅ Test products created:", products.length);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
