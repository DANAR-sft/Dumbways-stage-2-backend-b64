import express from "express";
import dotenv from "dotenv";
import transferRoute from "./routes/transfer-points";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1", transferRoute);

app.use((err: any, req: any, res: any, next: any) => {
  console.log(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  `Server is running on ${PORT}`;
});
