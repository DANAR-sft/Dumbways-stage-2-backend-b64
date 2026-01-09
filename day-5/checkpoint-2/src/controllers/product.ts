import { Request, Response } from "express";
import prisma from "../prisma/client";
import Joi from "joi";
import { AuthRequest } from "../middlewares/auth";

const productSchema = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.number().min(0).required(),
});

export const addProduct = async (req: AuthRequest, res: Response) => {
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, price } = req.body;
  const supplierId = req.user.id;

  const product = await prisma.product.create({
    data: { name, price, supplierId },
  });

  res.json({ message: "Produk berhasil ditambahkan", product });
};

export const getSupplierProducts = async (req: AuthRequest, res: Response) => {
  const supplierId = req.user.id;
  const products = await prisma.product.findMany({
    where: { supplierId },
  });
  res.json({ message: "Produk berhasil diambil", products });
};

const updateProductSchema = Joi.object({
  name: Joi.string().min(3),
  price: Joi.number().min(0),
}).min(1); // minimal satu field harus ada

export const updateProduct = async (req: AuthRequest, res: Response) => {
  const { error } = updateProductSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const productId = parseInt(req.params.id);
  const supplierId = req.user.id;

  // Cek apakah produk ada dan milik supplier yang login
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    return res.status(404).json({ error: "Produk tidak ditemukan" });
  }

  if (existingProduct.supplierId !== supplierId) {
    return res
      .status(403)
      .json({ error: "Anda tidak memiliki akses untuk mengupdate produk ini" });
  }

  const { name, price } = req.body;

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(name && { name }),
      ...(price !== undefined && { price }),
    },
  });

  res.json({ message: "Produk berhasil diupdate", product: updatedProduct });
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const productId = parseInt(req.params.id);
  const supplierId = req.user.id;

  // Cek apakah produk ada dan milik supplier yang login
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    return res.status(404).json({ error: "Produk tidak ditemukan" });
  }

  if (existingProduct.supplierId !== supplierId) {
    return res
      .status(403)
      .json({ error: "Anda tidak memiliki akses untuk menghapus produk ini" });
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  res.json({ message: "Produk berhasil dihapus" });
};
