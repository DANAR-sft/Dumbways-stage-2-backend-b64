import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding database...");

  const users = await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
      { name: "Charlie", email: "charlie@example.com" },
    ],
  });

  const products = await prisma.product.createMany({
    data: [
      { name: "Laptop", price: 15000000, stock: 10 },
      { name: "Keyboard", price: 300000, stock: 25 },
      { name: "Mouse", price: 150000, stock: 40 },
    ],
  });

  const allUsers = await prisma.user.findMany();
  const allProducts = await prisma.product.findMany();

  await prisma.order.createMany({
    data: [
      {
        userId: allUsers[0].id,
        productId: allProducts[0].id,
        quantity: 1,
      },
      {
        userId: allUsers[0].id,
        productId: allProducts[2].id,
        quantity: 2,
      },
      {
        userId: allUsers[1].id,
        productId: allProducts[1].id,
        quantity: 1,
      },
    ],
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
