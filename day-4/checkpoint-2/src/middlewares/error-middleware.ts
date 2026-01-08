import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("❌ Error caught by middleware:", err);

  if (err.code === "SUPPLIER_NOT_FOUND") {
    return res.status(404).json({ error: "Supplier tidak ditemukan" });
  }

  if (err.code === "NEGATIVE_STOCK") {
    return res.status(400).json({ error: "Stok tidak boleh bernilai negatif" });
  }

  res.status(500).json({ error: "Terjadi kesalahan server" });
}
