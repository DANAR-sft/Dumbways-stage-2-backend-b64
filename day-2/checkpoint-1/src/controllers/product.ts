import { Request, Response } from "express";
import { prisma } from "../connection/client";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
};

export const getProductsById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const products = await prisma.product.findUnique({ where: { id } });

    res
      .status(200)
      .json({ message: "Product retrieved successfully", products });
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    const create = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
      },
    });
    res.status(201).json({ message: "Product created", create });
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, price } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { name, price: parseFloat(price) },
    });
    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.product.delete({ where: { id } });
  res.json({ message: "Product deleted" });
};
