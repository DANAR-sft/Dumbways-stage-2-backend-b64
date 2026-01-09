import express from "express";
import { handleRegister, handleLogin } from "../controllers/auth";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);

router.get("/me", authenticate, (req, res) => {
  res.json({ message: "Protected route" });
});

export default router;
