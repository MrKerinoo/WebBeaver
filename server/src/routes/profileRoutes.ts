import express from "express";
import authenticateToken from "../middleware/authenticateToken";
import { updateProfile } from "../controllers/profileController";

const router = express.Router();

router.post("/:id", authenticateToken, updateProfile);

export default router;
