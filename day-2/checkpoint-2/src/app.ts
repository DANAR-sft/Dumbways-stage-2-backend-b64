import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
