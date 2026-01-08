import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
console.log("🌱 Start seeding...");

async function main() {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        name: "Alice",
        email: "alice@example.com",
        points: 1500,
      },
      {
        name: "Bob",
        email: "bob@example.com",
        points: 800,
      },
      {
        name: "Charlie",
        email: "charlie@example.com",
        points: 300,
      },
    ],
  });

  console.log("✅ Seeding selesai!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
