import { Router } from "express";
import {
  addProduct,
  getSupplierProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// hanya supplier login yang bisa akses
router.get(
  "/suppliers/products",
  authenticate,
  authorize("supplier"),
  getSupplierProducts
);
router.post("/products/add", authenticate, authorize("supplier"), addProduct);
router.put("/products/:id", authenticate, authorize("supplier"), updateProduct);
router.delete(
  "/products/:id",
  authenticate,
  authorize("supplier"),
  deleteProduct
);

export default router;
