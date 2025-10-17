import api from "./api";

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data?: {
    totalAmount: number;
    itemsProcessed: number;
  };
}

export const checkoutService = {
  async checkout(): Promise<CheckoutResponse> {
    const response = await api.post("/checkout");
    return response.data;
  },
};
