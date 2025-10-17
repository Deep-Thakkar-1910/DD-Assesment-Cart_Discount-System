import api from "./api";

export interface CartItem {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const cartService = {
  async updateCart(
    productId: string,
    action: "increment" | "decrement",
  ): Promise<ApiResponse<CartItem | null>> {
    const response = await api.post("/cart/update", { productId, action });
    return response.data;
  },

  async getCart(): Promise<ApiResponse<CartItem[]>> {
    const response = await api.get("/cart");
    return response.data;
  },

  async removeFromCart(productId: string): Promise<ApiResponse<CartItem>> {
    const response = await api.post("/cart/remove", { productId });
    return response.data;
  },

  async clearCart(): Promise<ApiResponse<{ deletedCount: number }>> {
    const response = await api.post("/cart/clear");
    return response.data;
  },
};
