// src/routes/auth.route.ts
import express from "express";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { handleRegister, handleLogin } from "../controllers/auth";
import { upload } from "../utils/multer";
import { limiter } from "../middlewares/rate-limit";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/upload-profile-picture",
  upload.single("profile"),
  handleRegister
);
router.post("/login", handleLogin);

router.get("/me", limiter, authenticate, (req, res) => {
  res.json({ message: "Protected route" });
});

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ success: false, message: "Ukuran file melebihi 2MB." });
    }
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});
export default router;
