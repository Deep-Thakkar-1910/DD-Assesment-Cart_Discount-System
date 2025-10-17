import { Request, Response } from "express";
import { processCheckout } from "../services/checkoutService";

export async function checkout(req: Request, res: Response) {
  try {
    const userId = req.user!._id.toString();

    const result = await processCheckout(userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Checkout controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
