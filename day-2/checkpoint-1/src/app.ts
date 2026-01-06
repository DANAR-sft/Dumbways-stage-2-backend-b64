import express from "express";
import router from "./routes/product";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
