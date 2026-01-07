import express from "express";
import dotenv from "dotenv";
import routeProduct from "./routes/product";
import routeOrder from "./routes/order";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/v1", routeProduct);
app.use("/api/orders", routeOrder);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
