import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const message = "berhasil mengambil kategori";
    const categories = await prisma.category.findMany();
    res.json({ categories, message });
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil kategori" });
  }
};
