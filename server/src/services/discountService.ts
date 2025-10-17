import Discount from "../models/Discount";

export interface DiscountedItem {
  productId: string;
  productName: string;
  category: string;
  originalPrice: number;
  quantity: number;
  discountApplied?: string;
  discountAmount: number;
  finalPrice: number;
}

export interface ActiveDiscount {
  _id: string;
  type: string;
  ruleType: string;
  productId?: string;
  category?: string;
  discountValue: number;
  minQuantity?: number;
  payForQuantity?: number;
}

interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export async function applyDiscounts(
  cartItems: Array<{
    productId: any;
    quantity: number;
  }>,
): Promise<{
  discountedItems: DiscountedItem[];
  totalOriginalPrice: number;
  totalDiscount: number;
  totalFinalPrice: number;
}> {
  const discountedItems: DiscountedItem[] = [];
  let totalOriginalPrice = 0;
  let totalDiscount = 0;

  // Get all active discounts
  const discounts = await Discount.find({ isActive: true }).populate(
    "productId",
  );

  for (const cartItem of cartItems) {
    const product = cartItem.productId;
    const quantity = cartItem.quantity;
    const originalItemPrice = product.price * quantity;
    totalOriginalPrice += originalItemPrice;

    let discountAmount = 0;
    let discountApplied: string | undefined;

    // Check for product-specific discounts
    const productDiscount = discounts.find(
      (d) =>
        d.productId &&
        d.productId._id.toString() === product._id.toString() &&
        quantity >= (d.minQuantity || 1),
    );

    if (productDiscount) {
      switch (productDiscount.type) {
        case "BOGO": {
          // Buy 1 Get 1 Free: Every second item is free
          const freeItems = Math.floor(quantity / 2);
          discountAmount = freeItems * product.price;
          discountApplied = productDiscount.ruleType;
          break;
        }
        case "BUY_X_FOR_Y": {
          // Buy 2 for 1: If qty >= 2, only pay for specified quantity
          if (quantity >= (productDiscount.minQuantity || 2)) {
            const sets = Math.floor(
              quantity / (productDiscount.minQuantity || 2),
            );
            const remainder = quantity % (productDiscount.minQuantity || 2);
            const itemsToPay =
              sets * (productDiscount.payForQuantity || 1) + remainder;
            discountAmount = (quantity - itemsToPay) * product.price;
            discountApplied = productDiscount.ruleType;
          }
          break;
        }
        case "PERCENTAGE_OFF": {
          discountAmount =
            originalItemPrice * (productDiscount.discountValue / 100);
          discountApplied = productDiscount.ruleType;
          break;
        }
      }
    } else {
      // Check for category-wide discounts
      const categoryDiscount = discounts.find(
        (d) => d.category && d.category === product.category,
      );

      if (categoryDiscount && categoryDiscount.type === "PERCENTAGE_OFF") {
        discountAmount =
          originalItemPrice * (categoryDiscount.discountValue / 100);
        discountApplied = categoryDiscount.ruleType;
      }
    }

    totalDiscount += discountAmount;

    discountedItems.push({
      productId: product._id.toString(),
      productName: product.name,
      category: product.category,
      originalPrice: product.price,
      quantity,
      discountApplied,
      discountAmount,
      finalPrice: originalItemPrice - discountAmount,
    });
  }

  return {
    discountedItems,
    totalOriginalPrice,
    totalDiscount,
    totalFinalPrice: totalOriginalPrice - totalDiscount,
  };
}

export async function getActiveDiscounts(): Promise<
  ServiceResponse<ActiveDiscount[]>
> {
  try {
    const discounts = await Discount.find({ isActive: true });

    const activeDiscounts: ActiveDiscount[] = discounts.map((discount) => {
      // Extract productId correctly - it could be an ObjectId or populated object
      let productIdString: string | undefined;
      if (discount.productId) {
        // Handle both populated (object with _id) and unpopulated (ObjectId) cases
        const productIdValue: any = discount.productId;
        productIdString = productIdValue._id
          ? productIdValue._id.toString()
          : productIdValue.toString();
      }

      return {
        _id: discount._id.toString(),
        type: discount.type,
        ruleType: discount.ruleType,
        productId: productIdString,
        category: discount.category,
        discountValue: discount.discountValue,
        minQuantity: discount.minQuantity,
        payForQuantity: discount.payForQuantity,
      };
    });

    return {
      success: true,
      message: "Active discounts retrieved successfully",
      data: activeDiscounts,
    };
  } catch (error) {
    console.error("Get active discounts error:", error);
    return {
      success: false,
      message: "Failed to retrieve active discounts",
    };
  }
}

// Admin-only: Get all discounts (including inactive)
export async function getAllDiscounts(): Promise<
  ServiceResponse<ActiveDiscount[]>
> {
  try {
    const discounts = await Discount.find({}).sort({ createdAt: -1 });

    const allDiscounts: ActiveDiscount[] = discounts.map((discount) => {
      let productIdString: string | undefined;
      if (discount.productId) {
        const productIdValue: any = discount.productId;
        productIdString = productIdValue._id
          ? productIdValue._id.toString()
          : productIdValue.toString();
      }

      return {
        _id: discount._id.toString(),
        type: discount.type,
        ruleType: discount.ruleType,
        productId: productIdString,
        category: discount.category,
        discountValue: discount.discountValue,
        minQuantity: discount.minQuantity,
        payForQuantity: discount.payForQuantity,
      };
    });

    return {
      success: true,
      message: "All discounts retrieved successfully",
      data: allDiscounts,
    };
  } catch (error) {
    console.error("Get all discounts error:", error);
    return {
      success: false,
      message: "Failed to retrieve discounts",
    };
  }
}

// Admin-only: Create a new discount
export async function createDiscount(discountData: {
  type: "BOGO" | "BUY_X_FOR_Y" | "PERCENTAGE_OFF";
  ruleType: string;
  productId?: string;
  category?: string;
  discountValue: number;
  minQuantity?: number;
  payForQuantity?: number;
  isActive: boolean;
}): Promise<ServiceResponse<ActiveDiscount>> {
  try {
    const newDiscount = new Discount(discountData);
    await newDiscount.save();

    let productIdString: string | undefined;
    if (newDiscount.productId) {
      productIdString = newDiscount.productId.toString();
    }

    const createdDiscount: ActiveDiscount = {
      _id: newDiscount._id.toString(),
      type: newDiscount.type,
      ruleType: newDiscount.ruleType,
      productId: productIdString,
      category: newDiscount.category,
      discountValue: newDiscount.discountValue,
      minQuantity: newDiscount.minQuantity,
      payForQuantity: newDiscount.payForQuantity,
    };

    return {
      success: true,
      message: "Discount created successfully",
      data: createdDiscount,
    };
  } catch (error) {
    console.error("Create discount error:", error);
    return {
      success: false,
      message: "Failed to create discount",
    };
  }
}

// Admin-only: Update a discount
export async function updateDiscount(
  discountId: string,
  updateData: Partial<{
    type: "BOGO" | "BUY_X_FOR_Y" | "PERCENTAGE_OFF";
    ruleType: string;
    productId?: string;
    category?: string;
    discountValue: number;
    minQuantity?: number;
    payForQuantity?: number;
    isActive: boolean;
  }>,
): Promise<ServiceResponse<ActiveDiscount>> {
  try {
    const discount = await Discount.findByIdAndUpdate(discountId, updateData, {
      new: true,
    });

    if (!discount) {
      return {
        success: false,
        message: "Discount not found",
      };
    }

    let productIdString: string | undefined;
    if (discount.productId) {
      productIdString = discount.productId.toString();
    }

    const updatedDiscount: ActiveDiscount = {
      _id: discount._id.toString(),
      type: discount.type,
      ruleType: discount.ruleType,
      productId: productIdString,
      category: discount.category,
      discountValue: discount.discountValue,
      minQuantity: discount.minQuantity,
      payForQuantity: discount.payForQuantity,
    };

    return {
      success: true,
      message: "Discount updated successfully",
      data: updatedDiscount,
    };
  } catch (error) {
    console.error("Update discount error:", error);
    return {
      success: false,
      message: "Failed to update discount",
    };
  }
}

// Admin-only: Delete a discount
export async function deleteDiscount(
  discountId: string,
): Promise<ServiceResponse<null>> {
  try {
    const discount = await Discount.findByIdAndDelete(discountId);

    if (!discount) {
      return {
        success: false,
        message: "Discount not found",
      };
    }

    return {
      success: true,
      message: "Discount deleted successfully",
    };
  } catch (error) {
    console.error("Delete discount error:", error);
    return {
      success: false,
      message: "Failed to delete discount",
    };
  }
}
