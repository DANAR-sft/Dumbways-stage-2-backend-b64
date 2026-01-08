import express from "express";
import { transferPoints, userPoints } from "../controllers/transfer-points";

const route = express.Router();

route.post("/transfer-points", transferPoints);
route.post("/user-points/:id", userPoints);
route.get("/user-points/:id", userPoints);

export default route;
