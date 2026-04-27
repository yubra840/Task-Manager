//Sever/routes/authRoutes.js
import express from "express";
import { login, register,  forgotPassword, resetPassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});


export default router;