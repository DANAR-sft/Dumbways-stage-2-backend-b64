import { Router } from "express";
import { getCommentsByPost, getCommentsSummary } from "../controllers/comment";

const router = Router();
router.get("/comments-summary", getCommentsSummary);
router.get("/:id/comments", getCommentsByPost);
export default router;
