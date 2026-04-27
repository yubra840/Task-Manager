import express from "express";
import {
  addComment,
  getComments
} from "../controllers/teamTaskCommentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:taskId", verifyToken, addComment);
router.get("/:taskId", verifyToken, getComments);

export default router;