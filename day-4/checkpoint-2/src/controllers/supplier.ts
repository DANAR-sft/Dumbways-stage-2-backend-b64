import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

export const updateSupplierStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        error: "Data update stok harus berupa array dan tidak boleh kosong",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedStocks = [];

      for (const data of updates) {
        const { supplierId, productId, newQuantity } = data;

        const stock = await tx.stock.findFirst({
          where: { supplierId, productId },
        });

        if (!stock) {
          const error: any = new Error("Supplier tidak ditemukan");
          error.code = "SUPPLIER_NOT_FOUND";
          throw error;
        }

        if (newQuantity < 0) {
          const error: any = new Error("Stok tidak boleh bernilai negatif");
          error.code = "NEGATIVE_STOCK";
          throw error;
        }

        const updated = await tx.stock.update({
          where: { id: stock.id },
          data: { quantity: newQuantity },
        });

        updatedStocks.push(updated);
      }

      return updatedStocks;
    });

    res.json({
      message: "✅ Stok berhasil diperbarui",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
