import { Router } from "express";
import { getDiscounts } from "../controllers/discountController";

const router = Router();

// Public route to get active discounts
router.get("/", getDiscounts);

export default router;
