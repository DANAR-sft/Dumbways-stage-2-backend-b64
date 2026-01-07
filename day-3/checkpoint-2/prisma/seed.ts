import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  const categories = await prisma.category.createMany({
    data: [
      { name: "Technology" },
      { name: "Lifestyle" },
      { name: "Education" },
    ],
  });

  const tech = await prisma.category.findFirst({
    where: { name: "Technology" },
  });
  const life = await prisma.category.findFirst({
    where: { name: "Lifestyle" },
  });
  const edu = await prisma.category.findFirst({ where: { name: "Education" } });

  await prisma.post.createMany({
    data: [
      {
        title: "Belajar Prisma ORM",
        content: "Prisma itu keren!",
        categoryId: edu!.id,
      },
      {
        title: "Tips Hidup Sehat",
        content: "Minum air putih cukup",
        categoryId: life!.id,
      },
      {
        title: "Teknologi AI",
        content: "AI mengubah dunia",
        categoryId: tech!.id,
      },
    ],
  });

  const allPosts = await prisma.post.findMany();

  await prisma.comment.createMany({
    data: [
      {
        postId: allPosts[0].id,
        author: "Alice",
        content: "Artikel bagus banget!",
      },
      { postId: allPosts[0].id, author: "Bob", content: "Bermanfaat banget!" },
      {
        postId: allPosts[1].id,
        author: "Charlie",
        content: "Saya suka topiknya",
      },
      { postId: allPosts[2].id, author: "Dina", content: "Menarik banget" },
      {
        postId: allPosts[2].id,
        author: "Eka",
        content: "Tolong bahas lebih lanjut",
      },
      {
        postId: allPosts[2].id,
        author: "Fajar",
        content: "AI memang luar biasa",
      },
    ],
  });

  console.log("✅ Seeding selesai!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
