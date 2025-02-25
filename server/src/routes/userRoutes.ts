import express from "express";
import {
  getAllUsers,
  getUser,
  createUser,
} from "../controllers/userController";
import authenticateToken from "../middleware/authenticateToken";

const router = express.Router();

router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUser);
router.post("/", createUser);

export default router;
