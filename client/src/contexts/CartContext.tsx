import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type Product } from "../services/productService";
import {
  cartService,
  type CartSummary,
  type DiscountedCartItem,
} from "../services/cartService";
import { checkoutService } from "../services/checkoutService";
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartSummary: CartSummary | null;
  discountedItems: DiscountedCartItem[];
  updateCart: (product: Product, quantityAction?: boolean) => void;
  removeFromCart: (productId: string) => void;
  removeItemCompletely: (productId: string) => void;
  clearCart: () => void;
  checkout: (onCheckoutSuccess?: () => void) => Promise<void>;
  syncCartFromBackend: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [discountedItems, setDiscountedItems] = useState<DiscountedCartItem[]>(
    [],
  );

  // Sync cart from backend on app mount
  useEffect(() => {
    syncCartFromBackend();
  }, []);

  const updateCart = async (product: Product, quantityAction?: boolean) => {
    try {
      // Update local state immediately for better UX
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.product._id === product._id,
        );
        if (existingItem) {
          return prevItems.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          return [...prevItems, { product, quantity: 1 }];
        }
      });

      // Then sync with backend
      const response = await cartService.updateCart(product._id, "increment");
      if (!response.success) {
        // If backend fails, revert local state
        await syncCartFromBackend();
        toast.error(response.message || "Failed to add item to cart");
      } else {
        // Sync cart to get updated discounts and prices
        await syncCartFromBackend();
      }
      if (!quantityAction) {
        toast.success("Item added to cart successfully");
      }
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      // If backend fails, revert local state
      await syncCartFromBackend();
      const errorMessage =
        error.response?.data?.message || "Failed to add item to cart";
      toast.error(errorMessage);
    }
  };

  // Sync cart from backend
  const syncCartFromBackend = async () => {
    try {
      const response = await cartService.getCart();
      if (response.success && response.data) {
        // Map discounted items to CartItem format
        const backendItems: CartItem[] = response.data.items.map((item) => ({
          product: {
            _id: item.productId,
            name: item.productName,
            price: item.originalPrice,
            createdAt: "",
            updatedAt: "",
            category: item.category,
            stock: 0,
          },
          quantity: item.quantity,
        }));
        setCartItems(backendItems);
        setCartSummary(response.data.summary);
        setDiscountedItems(response.data.items);
      }
    } catch (error) {
      console.error("Failed to sync cart from backend:", error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      // Update local state immediately for better UX
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.product._id === productId,
        );
        if (existingItem) {
          if (existingItem.quantity > 1) {
            // Decrease quantity
            return prevItems.map((item) =>
              item.product._id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            );
          } else {
            // Remove item completely
            return prevItems.filter((item) => item.product._id !== productId);
          }
        }
        return prevItems;
      });

      // Then sync with backend
      const response = await cartService.updateCart(productId, "decrement");
      if (!response.success) {
        // If backend fails, revert local state
        await syncCartFromBackend();
        toast.error(response.message || "Failed to update cart");
      } else {
        // Sync cart to get updated discounts and prices
        await syncCartFromBackend();
      }
    } catch (error: any) {
      console.error("Failed to remove from cart:", error);
      // If backend fails, revert local state
      await syncCartFromBackend();
      const errorMessage =
        error.response?.data?.message || "Failed to update cart";
      toast.error(errorMessage);
    }
  };

  const removeItemCompletely = async (productId: string) => {
    try {
      // Update local state immediately for better UX
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product._id !== productId),
      );

      // Then sync with backend
      const response = await cartService.removeFromCart(productId);
      if (!response.success) {
        // If backend fails, revert local state
        await syncCartFromBackend();
        toast.error(response.message || "Failed to remove item");
      } else {
        // Sync cart to get updated discounts and prices
        await syncCartFromBackend();
        toast.success("Item removed from cart");
      }
    } catch (error: any) {
      console.error("Failed to remove item completely:", error);
      // If backend fails, revert local state
      await syncCartFromBackend();
      const errorMessage =
        error.response?.data?.message || "Failed to remove item";
      toast.error(errorMessage);
    }
  };

  const clearCart = async () => {
    try {
      // Update local state immediately for better UX
      setCartItems([]);
      setCartSummary(null);
      setDiscountedItems([]);

      // Then sync with backend
      const response = await cartService.clearCart();
      if (!response.success) {
        // If backend fails, revert local state
        await syncCartFromBackend();
        toast.error(response.message || "Failed to clear cart");
      } else {
        toast.success("Cart cleared successfully");
      }
    } catch (error: any) {
      console.error("Failed to clear cart:", error);
      // If backend fails, revert local state
      await syncCartFromBackend();
      const errorMessage =
        error.response?.data?.message || "Failed to clear cart";
      toast.error(errorMessage);
    }
  };

  const checkout = async (onCheckoutSuccess?: () => void) => {
    try {
      if (cartItems.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      const response = await checkoutService.checkout();
      if (response.success) {
        // Clear local cart state
        setCartItems([]);
        setCartSummary(null);
        setDiscountedItems([]);

        // Call the callback if provided
        if (onCheckoutSuccess) {
          onCheckoutSuccess();
        }

        toast.success(
          `Checkout successful! Total: $${response.data?.totalAmount.toFixed(2)}`,
        );
      } else {
        toast.error(response.message || "Checkout failed");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage = error.response?.data?.message || "Checkout failed";
      toast.error(errorMessage);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  const value: CartContextType = {
    cartItems,
    cartSummary,
    discountedItems,
    updateCart,
    removeFromCart,
    removeItemCompletely,
    clearCart,
    checkout,
    syncCartFromBackend,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
