import { Router } from "express";
import {
  getDiscounts,
  adminGetAllDiscounts,
  adminCreateDiscount,
  adminUpdateDiscount,
  adminDeleteDiscount,
} from "../controllers/discountController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public route to get active discounts
router.get("/", getDiscounts);

// Admin-only routes
router.get("/admin/all", authMiddleware, adminMiddleware, adminGetAllDiscounts);
router.post("/admin", authMiddleware, adminMiddleware, adminCreateDiscount);
router.put("/admin/:id", authMiddleware, adminMiddleware, adminUpdateDiscount);
router.delete(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  adminDeleteDiscount,
);

export default router;
