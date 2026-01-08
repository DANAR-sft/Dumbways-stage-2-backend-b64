import express from "express";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error-middleware";
import supplierRoutes from "./routes/supplier";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/suppliers", supplierRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`)
);
