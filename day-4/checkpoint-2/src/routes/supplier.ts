import { Router } from "express";
import { updateSupplierStock } from "../controllers/supplier";

const router = Router();

router.post("/stock", updateSupplierStock);

export default router;
