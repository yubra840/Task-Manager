import express from "express";
import {
  createTeam,
  getMyTeams,
  getTeamDetails
} from "../controllers/teamController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createTeam);
router.get("/", verifyToken, getMyTeams);
router.get("/:id", verifyToken, getTeamDetails);

export default router;