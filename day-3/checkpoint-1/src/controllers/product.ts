import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getProducts = async (req: Request, res: Response) => {
  const {
    sortBy = "price",
    order = "asc",
    minPrice,
    maxPrice,
    limit = 10,
    offset = 0,
  } = req.query;

  const message = "berhasil mengambil data produk";

  const filters: any = {};
  if (minPrice) filters.price = { gte: parseFloat(minPrice as string) };
  if (maxPrice) {
    filters.price = {
      ...(filters.price || {}),
      lte: parseFloat(maxPrice as string),
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: filters,
      orderBy: {
        [sortBy as string]: order as "asc" | "desc",
      },
      take: Number(limit),
      skip: Number(offset),
    });

    const total = await prisma.product.count({ where: filters });
    res.status(200).json({ data: products, total, message });
  } catch (error) {
    res.status(500).json({ error: "gagal mengambil data produk" });
  }
};
