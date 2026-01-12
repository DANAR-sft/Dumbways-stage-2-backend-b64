import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import prisma from "../prisma/client";

// Supplier Registration
export const registerSupplier = async (req: Request, res: Response) => {
  try {
    const { email, username, password, name, phone, address } = req.body;

    // Validasi input
    if (!email || !username || !password || !name) {
      return res.status(400).json({
        error: "Email, username, password, dan nama wajib diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password minimal 6 karakter",
      });
    }

    // Cek apakah email atau username sudah ada
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingSupplier) {
      return res.status(400).json({
        error: "Email atau username sudah digunakan",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat supplier baru
    const supplier = await prisma.supplier.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name,
        phone,
        address,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "Supplier berhasil didaftarkan",
      supplier,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Supplier Login
export const loginSupplier = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({
        error: "Username dan password wajib diisi",
      });
    }

    // Cari supplier berdasarkan username atau email
    const supplier = await prisma.supplier.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
    });

    if (!supplier) {
      return res.status(401).json({
        error: "Username atau password salah",
      });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, supplier.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Username atau password salah",
      });
    }

    // Generate session ID
    const sessionId = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Session berlaku 7 hari

    // Hapus session lama yang sudah expired
    await prisma.session.deleteMany({
      where: {
        supplierId: supplier.id,
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    // Buat session baru
    const session = await prisma.session.create({
      data: {
        sessionId,
        supplierId: supplier.id,
        expiresAt,
      },
    });

    // Set cookie dengan session ID
    res.cookie("supplier_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milliseconds
      sameSite: "strict",
    });

    res.json({
      message: "Login berhasil",
      supplier: {
        id: supplier.id,
        email: supplier.email,
        username: supplier.username,
        name: supplier.name,
        phone: supplier.phone,
        address: supplier.address,
      },
      sessionId,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Supplier Logout
export const logoutSupplier = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.supplier_session;

    if (sessionId) {
      // Hapus session dari database
      await prisma.session.deleteMany({
        where: { sessionId },
      });
    }

    // Clear cookie
    res.clearCookie("supplier_session");

    res.json({
      message: "Logout berhasil",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Get Current Supplier Profile
export const getCurrentSupplier = async (req: Request, res: Response) => {
  try {
    const supplier = (req as any).supplier;

    res.json({
      supplier: {
        id: supplier.id,
        email: supplier.email,
        username: supplier.username,
        name: supplier.name,
        phone: supplier.phone,
        address: supplier.address,
        createdAt: supplier.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Update Supplier Profile
export const updateSupplierProfile = async (req: Request, res: Response) => {
  try {
    const supplier = (req as any).supplier;
    const { name, phone, address } = req.body;

    // Validasi input
    if (!name) {
      return res.status(400).json({
        error: "Nama wajib diisi",
      });
    }

    // Update supplier profile
    const updatedSupplier = await prisma.supplier.update({
      where: { id: supplier.id },
      data: {
        name,
        phone,
        address,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        phone: true,
        address: true,
        updatedAt: true,
      },
    });

    res.json({
      message: "Profile berhasil diupdate",
      supplier: updatedSupplier,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};
