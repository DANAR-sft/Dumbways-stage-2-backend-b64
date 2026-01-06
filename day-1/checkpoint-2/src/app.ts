import express from "express";
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", productsRouter);
app.use("/api/v1", ordersRouter);

app.get("/", (req, res) =>
  res.json({ ok: true, message: "Express TS Cart API (Dummy Data)" })
);

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
