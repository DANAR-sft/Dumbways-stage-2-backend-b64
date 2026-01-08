import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding data...");

  const products = await prisma.product.createMany({
    data: [
      { name: "Laptop", price: 15000000 },
      { name: "Mouse", price: 150000 },
      { name: "Keyboard", price: 350000 },
    ],
  });

  const suppliers = await prisma.supplier.createMany({
    data: [
      { name: "PT Elektronik Nusantara", contact: "021-1234567" },
      { name: "CV Tech Supply", contact: "0812-3456-7890" },
    ],
  });

  const [product1, product2] = await prisma.product.findMany();
  const [supplier1, supplier2] = await prisma.supplier.findMany();

  await prisma.stock.createMany({
    data: [
      { productId: product1.id, supplierId: supplier1.id, quantity: 10 },
      { productId: product2.id, supplierId: supplier1.id, quantity: 20 },
      { productId: product1.id, supplierId: supplier2.id, quantity: 5 },
    ],
  });

  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
