import { Request, Response } from "express";
import {
  updateCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../services/cartService";

export async function updateCartItem(req: Request, res: Response) {
  try {
    const userId = req.user!._id.toString();
    const { productId, action } = req.body;

    if (!productId || !action) {
      return res.status(400).json({
        success: false,
        message: "Product ID and action are required",
      });
    }

    if (!["increment", "decrement"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be 'increment' or 'decrement'",
      });
    }

    const result = await updateCart(userId, { productId, action });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getUserCart(req: Request, res: Response) {
  try {
    const userId = req.user!._id.toString();
    const result = await getCart(userId);

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function removeItemFromCart(req: Request, res: Response) {
  try {
    const userId = req.user!._id.toString();
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const result = await removeFromCart(userId, productId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function clearUserCart(req: Request, res: Response) {
  try {
    const userId = req.user!._id.toString();
    const result = await clearCart(userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Clear cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
