import { Router } from "express";
import { loginSupplier, registerSupplier } from "../controllers/supplier";

const router = Router();

router.post("/login", loginSupplier);
router.post("/register", registerSupplier);

export default router;
