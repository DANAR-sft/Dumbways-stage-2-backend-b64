import { Router } from "express";
import { getOrderSummary } from "../controllers/order";

const router = Router();

router.get("/summary", getOrderSummary);

export default router;
