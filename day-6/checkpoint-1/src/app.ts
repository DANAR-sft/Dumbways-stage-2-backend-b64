import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import corsMiddleware from "./middlewares/cors";
import path from "path";
import authRoute from "./routes/auth";
import dotenv from "dotenv";

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Static access for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
