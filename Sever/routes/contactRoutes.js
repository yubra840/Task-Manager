import express from "express";
import {
  getAllUsers,
  getMyContacts,
  addContact,
  removeContact
} from "../controllers/contactController.js";
import {verifyToken} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers);
router.get("/my", verifyToken, getMyContacts);
router.post("/add", verifyToken, addContact);
router.post("/remove", verifyToken, removeContact);

export default router;