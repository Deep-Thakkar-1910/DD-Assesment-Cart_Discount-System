import { Router } from "express";
import {
  updateCartItem,
  getUserCart,
  removeItemFromCart,
  clearUserCart,
} from "../controllers/cartController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

router.post("/update", updateCartItem);
router.get("/", getUserCart);
router.post("/remove", removeItemFromCart);
router.post("/clear", clearUserCart);

export default router;
