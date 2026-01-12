import { Router } from "express";
import {
  registerSupplier,
  loginSupplier,
  logoutSupplier,
  getCurrentSupplier,
  updateSupplierProfile,
} from "../controllers/auth";
import { authenticateSupplier } from "../middlewares/auth";
import { rateLimitMiddleware } from "../middlewares/rate-limit";

const router = Router();

// Public routes (tidak perlu authentication)
router.post("/auth/register", rateLimitMiddleware, registerSupplier);
router.post("/auth/login", rateLimitMiddleware, loginSupplier);

// Protected routes (perlu authentication)
router.post("/auth/logout", authenticateSupplier, logoutSupplier);
router.get("/auth/profile", authenticateSupplier, getCurrentSupplier);
router.put("/auth/profile", authenticateSupplier, updateSupplierProfile);

// Route untuk mengecek status login
router.get("/auth/check", (req, res) => {
  const sessionId = req.cookies.supplier_session;

  if (!sessionId) {
    return res.json({
      isAuthenticated: false,
      message: "Tidak ada session aktif",
    });
  }

  return res.json({
    isAuthenticated: true,
    message: "Session ditemukan",
  });
});

export default router;
