import { Request, Response } from "express";
import prisma from "../prisma/client";

export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;

    // Validasi input
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: "Nama produk minimal 3 karakter" });
    }

    const parsedPrice = parseInt(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res
        .status(400)
        .json({ error: "Harga produk harus angka positif" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File gambar tidak ditemukan" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Simpan ke database
    const product = await prisma.product.create({
      data: {
        name,
        price: parsedPrice,
        imageUrl,
      },
    });

    res.json({
      message: "Gambar produk berhasil diupload",
      product,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
