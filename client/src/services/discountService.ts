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
  isActive?: boolean;
}

export interface CreateDiscountData {
  type: "BOGO" | "BUY_X_FOR_Y" | "PERCENTAGE_OFF";
  ruleType: string;
  productId?: string;
  category?: string;
  discountValue: number;
  minQuantity?: number;
  payForQuantity?: number;
  isActive: boolean;
}

export interface UpdateDiscountData {
  type?: "BOGO" | "BUY_X_FOR_Y" | "PERCENTAGE_OFF";
  ruleType?: string;
  productId?: string;
  category?: string;
  discountValue?: number;
  minQuantity?: number;
  payForQuantity?: number;
  isActive?: boolean;
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

  // Admin-only methods
  async getAllDiscounts(): Promise<ApiResponse<ActiveDiscount[]>> {
    const response = await api.get("/discounts/admin/all");
    return response.data;
  },

  async createDiscount(
    discountData: CreateDiscountData,
  ): Promise<ApiResponse<ActiveDiscount>> {
    const response = await api.post("/discounts/admin", discountData);
    return response.data;
  },

  async updateDiscount(
    discountId: string,
    updateData: UpdateDiscountData,
  ): Promise<ApiResponse<ActiveDiscount>> {
    const response = await api.put(
      `/discounts/admin/${discountId}`,
      updateData,
    );
    return response.data;
  },

  async deleteDiscount(discountId: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/discounts/admin/${discountId}`);
    return response.data;
  },
};
