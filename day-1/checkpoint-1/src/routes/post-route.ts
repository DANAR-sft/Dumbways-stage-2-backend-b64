import express from "express";
import {
  getPosts,
  createPosts,
  deletePosts,
  updatePosts,
} from "../controllers/post-controller";

const router = express.Router();

router.get("/posts", getPosts);
router.post("/posts", createPosts);
router.put("/posts/:id", updatePosts);
router.delete("/posts/:id", deletePosts);

export default router;
