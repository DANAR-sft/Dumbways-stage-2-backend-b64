import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";

// Extend Request interface untuk menambahkan supplier property
declare global {
  namespace Express {
    interface Request {
      supplier?: any;
    }
  }
}

// Middleware untuk mengautentikasi supplier berdasarkan session
export const authenticateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.cookies.supplier_session;

    if (!sessionId) {
      return res.status(401).json({
        error: "Session tidak ditemukan. Silakan login terlebih dahulu.",
      });
    }

    // Cari session di database
    const session = await prisma.session.findUnique({
      where: { sessionId },
      include: {
        supplier: {
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
            phone: true,
            address: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(401).json({
        error: "Session tidak valid. Silakan login kembali.",
      });
    }

    // Cek apakah session sudah expired
    if (session.expiresAt < new Date()) {
      // Hapus session yang expired
      await prisma.session.delete({
        where: { id: session.id },
      });

      res.clearCookie("supplier_session");

      return res.status(401).json({
        error: "Session telah expired. Silakan login kembali.",
      });
    }

    // Update last activity (optional - extends session)
    await prisma.session.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });

    // Attach supplier to request object
    req.supplier = session.supplier;
    next();
  } catch (error: any) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
};

// Middleware untuk mengecek apakah supplier sudah login (optional auth)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.cookies.supplier_session;

    if (!sessionId) {
      return next();
    }

    const session = await prisma.session.findUnique({
      where: { sessionId },
      include: {
        supplier: {
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
            phone: true,
            address: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (session && session.expiresAt > new Date()) {
      req.supplier = session.supplier;
    }

    next();
  } catch (error: any) {
    console.error("Optional auth error:", error);
    next(); // Continue even if there's an error
  }
};
