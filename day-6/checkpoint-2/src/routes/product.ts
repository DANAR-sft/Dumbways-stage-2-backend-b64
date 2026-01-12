import { Router } from "express";
import { uploadProductImage } from "../controllers/product";
import { upload } from "../middlewares/upload";
import { rateLimitMiddleware } from "../middlewares/rate-limit";
import { corsMiddleware } from "../middlewares/cors";

const router = Router();

router.post(
  "/products/upload-image",
  rateLimitMiddleware,
  upload.single("image"),
  uploadProductImage
);

router.post("/test-cors", corsMiddleware, (req, res) => {
  res.json({ message: "CORS berhasil diizinkan!" });
});

export default router;
