import CartItem, { ICartItem } from "../models/Cart";
import Product from "../models/Product";
import mongoose from "mongoose";
import { applyDiscounts, DiscountedItem } from "./discountService";

export interface UpdateCartData {
  productId: string;
  action: "increment" | "decrement";
}

export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export async function updateCart(
  userId: string,
  cartData: UpdateCartData,
): Promise<ServiceResponse<ICartItem | null>> {
  try {
    const { productId, action } = cartData;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Find existing cart item
    const existingItem = await CartItem.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
    }).populate("productId");

    if (action === "increment") {
      // Check stock availability for increment
      if (product.stock <= (existingItem?.quantity || 0)) {
        return {
          success: false,
          message: "Insufficient stock",
        };
      }

      if (existingItem) {
        // Update quantity
        existingItem.quantity += 1;
        await existingItem.save();
        return {
          success: true,
          message: "Item quantity updated successfully",
          data: existingItem,
        };
      } else {
        // Create new cart item
        const cartItem = new CartItem({
          userId: new mongoose.Types.ObjectId(userId),
          productId: new mongoose.Types.ObjectId(productId),
          quantity: 1,
        });
        await cartItem.save();
        await cartItem.populate("productId");
        return {
          success: true,
          message: "Item added to cart successfully",
          data: cartItem,
        };
      }
    } else if (action === "decrement") {
      if (!existingItem) {
        return {
          success: false,
          message: "Cart item not found",
        };
      }

      if (existingItem.quantity > 1) {
        // Decrease quantity
        existingItem.quantity -= 1;
        await existingItem.save();
        return {
          success: true,
          message: "Item quantity updated successfully",
          data: existingItem,
        };
      } else {
        // Remove item when quantity is 1
        await CartItem.findByIdAndDelete(existingItem._id);
        return {
          success: true,
          message: "Item removed from cart successfully",
          data: null,
        };
      }
    }

    return {
      success: false,
      message: "Invalid action",
    };
  } catch (error) {
    console.error("Update cart error:", error);
    return {
      success: false,
      message: "Failed to update cart",
    };
  }
}

export interface CartWithDiscounts {
  items: DiscountedItem[];
  summary: {
    totalOriginalPrice: number;
    totalDiscount: number;
    totalFinalPrice: number;
  };
}

export async function getCart(
  userId: string,
): Promise<ServiceResponse<CartWithDiscounts>> {
  try {
    const cartItems = await CartItem.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("productId");

    if (cartItems.length === 0) {
      return {
        success: true,
        message: "Cart is empty",
        data: {
          items: [],
          summary: {
            totalOriginalPrice: 0,
            totalDiscount: 0,
            totalFinalPrice: 0,
          },
        },
      };
    }

    // Apply discounts
    const discountResult = await applyDiscounts(cartItems);

    return {
      success: true,
      message: "Cart retrieved successfully",
      data: {
        items: discountResult.discountedItems,
        summary: {
          totalOriginalPrice: discountResult.totalOriginalPrice,
          totalDiscount: discountResult.totalDiscount,
          totalFinalPrice: discountResult.totalFinalPrice,
        },
      },
    };
  } catch (error) {
    console.error("Get cart error:", error);
    return {
      success: false,
      message: "Failed to retrieve cart",
    };
  }
}

export async function removeFromCart(
  userId: string,
  productId: string,
): Promise<ServiceResponse<ICartItem>> {
  try {
    const cartItem = await CartItem.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
    });

    if (!cartItem) {
      return {
        success: false,
        message: "Cart item not found",
      };
    }

    return {
      success: true,
      message: "Item removed from cart successfully",
      data: cartItem,
    };
  } catch (error) {
    console.error("Remove from cart error:", error);
    return {
      success: false,
      message: "Failed to remove item from cart",
    };
  }
}

export async function clearCart(
  userId: string,
): Promise<ServiceResponse<{ deletedCount: number }>> {
  try {
    const result = await CartItem.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return {
      success: true,
      message: "Cart cleared successfully",
      data: { deletedCount: result.deletedCount },
    };
  } catch (error) {
    console.error("Clear cart error:", error);
    return {
      success: false,
      message: "Failed to clear cart",
    };
  }
}
