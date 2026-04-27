import express from "express";
import {
  createTeamTask,
  getTeamTasks,
  deleteTeamTask,
  updateTeamTask
} from "../controllers/teamTaskController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:teamId", verifyToken, createTeamTask);
router.get("/:teamId", verifyToken, getTeamTasks);
router.delete("/:taskId", verifyToken, deleteTeamTask);
router.put("/:taskId", verifyToken, updateTeamTask);

export default router;