import express from "express";
import {
  getProducts,
  createProduct,
  getProductsById,
  updateProduct,
  deleteProduct,
} from "../controllers/product";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductsById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
