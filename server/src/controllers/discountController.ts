import { Request, Response } from "express";
import { getActiveDiscounts } from "../services/discountService";

export async function getDiscounts(req: Request, res: Response) {
  try {
    const result = await getActiveDiscounts();

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get discounts error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
