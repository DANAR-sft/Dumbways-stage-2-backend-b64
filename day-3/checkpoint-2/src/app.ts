import express from "express";
import dotenv from "dotenv";

import postRoutes from "./routes/post";
import commentRoutes from "./routes/comment";
import categoryRoutes from "./routes/category";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/posts", commentRoutes); //
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
