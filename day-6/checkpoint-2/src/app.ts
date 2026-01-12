import express from "express";
import dotenv from "dotenv";
import path from "path";
import { corsMiddleware } from "./middlewares/cors";
import productRoutes from "./routes/product";

dotenv.config();

const app = express();
app.use(express.json());
app.use(corsMiddleware);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`)
);
