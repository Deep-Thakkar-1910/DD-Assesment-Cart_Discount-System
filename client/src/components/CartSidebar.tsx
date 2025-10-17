import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import type { Product } from "../services/productService";

interface CartSidebarProps {
  onCheckoutSuccess?: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ onCheckoutSuccess }) => {
  const {
    cartItems,
    updateCart,
    removeFromCart,
    removeItemCompletely,
    clearCart,
    checkout,
  } = useCart();
  const [buttonLoading, setButtonLoading] = useState<{
    [key: string]: boolean;
  }>({});

  const handleAddItem = async (product: Product, quantityAction?: boolean) => {
    const key = `add-${product._id}`;
    setButtonLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await updateCart(product, quantityAction);
    } finally {
      setButtonLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const key = `remove-${productId}`;
    setButtonLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await removeFromCart(productId);
    } finally {
      setButtonLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRemoveItemCompletely = async (productId: string) => {
    const key = `delete-${productId}`;
    setButtonLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await removeItemCompletely(productId);
    } finally {
      setButtonLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleClearCart = async () => {
    setButtonLoading((prev) => ({ ...prev, clear: true }));
    try {
      await clearCart();
    } finally {
      setButtonLoading((prev) => ({ ...prev, clear: false }));
    }
  };

  const handleCheckout = async () => {
    setButtonLoading((prev) => ({ ...prev, checkout: true }));
    try {
      await checkout(onCheckoutSuccess);
    } finally {
      setButtonLoading((prev) => ({ ...prev, checkout: false }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center text-gray-500">
        <p>Your cart is empty</p>
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.product._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">
                      {item.product.category}
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      ${item.product.price}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveItem(item.product._id)}
                      disabled={buttonLoading[`remove-${item.product._id}`]}
                    >
                      {buttonLoading[`remove-${item.product._id}`] ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-gray-900"></div>
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                    </Button>
                    <Badge
                      variant="secondary"
                      className="min-w-[2rem] text-center"
                    >
                      {item.quantity}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddItem(item.product, true)}
                      disabled={buttonLoading[`add-${item.product._id}`]}
                    >
                      {buttonLoading[`add-${item.product._id}`] ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-gray-900"></div>
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleRemoveItemCompletely(item.product._id)
                      }
                      disabled={buttonLoading[`delete-${item.product._id}`]}
                    >
                      {buttonLoading[`delete-${item.product._id}`] ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-gray-900"></div>
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Footer */}
      <div className="mt-4 border-t pt-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-bold">Total:</span>
          <span className="text-lg font-bold text-green-600">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={
              buttonLoading.checkout ||
              Object.values(buttonLoading).some(Boolean)
            }
          >
            {buttonLoading.checkout ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Checkout"
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearCart}
            disabled={buttonLoading.clear}
          >
            {buttonLoading.clear ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-900"></div>
                <span>Clearing...</span>
              </div>
            ) : (
              "Clear Cart"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
