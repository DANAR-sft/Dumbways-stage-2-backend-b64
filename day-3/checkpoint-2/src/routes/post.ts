import { Router } from "express";
import { getPosts } from "../controllers/post";

const router = Router();
router.get("/", getPosts);
export default router;
