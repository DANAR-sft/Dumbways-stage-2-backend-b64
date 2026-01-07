import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET /posts?category=Technology
export const getPosts = async (req: Request, res: Response) => {
  try {
    const message = "berhasil mengambil data posts";
    const { category } = req.query;

    const posts = await prisma.post.findMany({
      where: category
        ? {
            category: {
              name: { equals: String(category), mode: "insensitive" },
            },
          }
        : {},
      include: { category: true },
    });

    res.json({ posts, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil data posts" });
  }
};
