import Product, { IProduct } from '../models/Product';

export interface CreateProductData {
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export async function getAllProducts(): Promise<ServiceResponse<IProduct[]>> {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: products
    };
  } catch (error) {
    console.error('Get products error:', error);
    return {
      success: false,
      message: 'Failed to retrieve products'
    };
  }
}

export async function createProduct(productData: CreateProductData): Promise<ServiceResponse<IProduct>> {
  try {
    const product = new Product(productData);
    await product.save();
    
    return {
      success: true,
      message: 'Product created successfully',
      data: product
    };
  } catch (error) {
    console.error('Create product error:', error);
    return {
      success: false,
      message: 'Failed to create product'
    };
  }
}
