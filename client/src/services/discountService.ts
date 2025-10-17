import api from "./api";

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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const discountService = {
  async getActiveDiscounts(): Promise<ApiResponse<ActiveDiscount[]>> {
    const response = await api.get("/discounts");
    return response.data;
  },
};
