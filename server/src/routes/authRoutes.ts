import { Router } from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/me", authMiddleware, getProfile);

export default router;
