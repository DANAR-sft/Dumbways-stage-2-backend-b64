import express from "express";
import postRoutes from "./routes/post-route";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1", postRoutes);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
