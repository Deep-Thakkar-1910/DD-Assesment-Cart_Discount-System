import { Request, Response } from "express";
import {
  getActiveDiscounts,
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../services/discountService";

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

// Admin only: Get all discounts
export async function adminGetAllDiscounts(req: Request, res: Response) {
  try {
    const result = await getAllDiscounts();

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Admin get all discounts error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Admin only: Create discount
export async function adminCreateDiscount(req: Request, res: Response) {
  try {
    const {
      type,
      ruleType,
      productId,
      category,
      discountValue,
      minQuantity,
      payForQuantity,
      isActive,
    } = req.body;

    // Validation
    if (!type || !ruleType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: "Type, ruleType, and discountValue are required",
      });
    }

    const result = await createDiscount({
      type,
      ruleType,
      productId,
      category,
      discountValue,
      minQuantity,
      payForQuantity,
      isActive: isActive !== undefined ? isActive : true,
    });

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Admin create discount error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Admin only: Update discount
export async function adminUpdateDiscount(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await updateDiscount(id, updateData);

    if (!result.success) {
      const statusCode = result.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Admin update discount error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Admin only: Delete discount
export async function adminDeleteDiscount(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await deleteDiscount(id);

    if (!result.success) {
      const statusCode = result.message.includes("not found") ? 404 : 500;
      return res.status(statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Admin delete discount error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
