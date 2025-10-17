import { Router } from "express";
import { checkout } from "../controllers/checkoutController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// All checkout routes require authentication
router.use(authMiddleware);

router.post("/", checkout);

export default router;
