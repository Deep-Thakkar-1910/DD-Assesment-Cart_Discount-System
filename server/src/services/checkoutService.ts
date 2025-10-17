import CartItem from "../models/Cart";
import Product from "../models/Product";
import mongoose from "mongoose";

export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export async function processCheckout(
  userId: string,
): Promise<ServiceResponse<{ totalAmount: number; itemsProcessed: number }>> {
  try {
    // Get user's cart items
    const cartItems = await CartItem.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("productId");

    if (cartItems.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
      };
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    const updates = [];

    for (const cartItem of cartItems) {
      const product = cartItem.productId as any;

      // Check if product exists
      if (!product) {
        return {
          success: false,
          message: `Product not found`,
        };
      }

      // Check stock availability
      if (product.stock < cartItem.quantity) {
        return {
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`,
        };
      }

      // Calculate item total
      const itemTotal = product.price * cartItem.quantity;
      totalAmount += itemTotal;

      // Prepare stock update
      updates.push({
        productId: product._id,
        quantity: cartItem.quantity,
      });
    }

    // Update stock quantities (first come first serve)
    for (const update of updates) {
      await Product.findByIdAndUpdate(update.productId, {
        $inc: { stock: -update.quantity },
      });
    }

    // Clear user's cart
    await CartItem.deleteMany({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return {
      success: true,
      message: "Checkout completed successfully",
      data: {
        totalAmount,
        itemsProcessed: cartItems.length,
      },
    };
  } catch (error: any) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message: error.message || "Checkout failed",
    };
  }
}
