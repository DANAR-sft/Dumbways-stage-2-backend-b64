import { Router } from "express";
import { uploadProductImage } from "../controllers/product";
import { upload } from "../middlewares/upload";
import { rateLimitMiddleware } from "../middlewares/rate-limit";
import { corsMiddleware } from "../middlewares/cors";
import { authenticateSupplier, optionalAuth } from "../middlewares/auth";

const router = Router();

// Protected route - hanya supplier yang login yang bisa upload produk
router.post(
  "/products/upload-image",
  rateLimitMiddleware,
  authenticateSupplier,
  upload.single("image"),
  uploadProductImage
);

// Public route untuk testing CORS
router.post("/test-cors", corsMiddleware, (req, res) => {
  res.json({ message: "CORS berhasil diizinkan!" });
});

// Route untuk mendapatkan daftar produk (public, tapi bisa menampilkan info berbeda jika login)
router.get("/products", optionalAuth, async (req, res) => {
  try {
    // Jika supplier login, bisa menampilkan informasi tambahan
    const isAuthenticated = !!(req as any).supplier;

    res.json({
      message: "Endpoint untuk mendapatkan daftar produk",
      isAuthenticated,
      supplier: isAuthenticated ? (req as any).supplier : null,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
