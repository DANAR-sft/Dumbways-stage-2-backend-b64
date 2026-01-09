import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginSupplier = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const supplier = await prisma.supplier.findUnique({ where: { email } });
  if (!supplier)
    return res.status(404).json({ error: "Email tidak ditemukan" });

  const valid = await bcrypt.compare(password, supplier.password);
  if (!valid) return res.status(401).json({ error: "Password salah" });

  const token = jwt.sign(
    { id: supplier.id, role: supplier.role, email: supplier.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login berhasil", token });
};

export const registerSupplier = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Semua field wajib diisi" });

  try {
    const hashed = await bcrypt.hash(password, 10);

    const supplier = await prisma.supplier.create({
      data: { name, email, password: hashed, role },
    });

    return res.status(201).json({
      message: "Register berhasil",
      supplier: {
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        role: supplier.role,
      },
    });
  } catch (err: any) {
    // Prisma unique constraint error code
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email sudah terdaftar" });
    }
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};
