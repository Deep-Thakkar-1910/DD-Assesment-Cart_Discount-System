import api from './api';

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const productService = {
  async getProducts(): Promise<ApiResponse<Product[]>> {
    const response = await api.get('/products');
    return response.data;
  },

  async addProduct(productData: CreateProductData): Promise<ApiResponse<Product>> {
    const response = await api.post('/products/add', productData);
    return response.data;
  }
};
