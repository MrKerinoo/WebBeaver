import express from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
  validateToken,
} from "../controllers/authController";
import authenticateToken from "../middleware/authenticateToken";

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.post("/validate-token", authenticateToken, validateToken);
router.delete("/logout", logoutUser);

export default router;
