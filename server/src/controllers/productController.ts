import { Request, Response } from 'express';
import { getAllProducts, createProduct } from '../services/productService';

export async function getProducts(req: Request, res: Response) {
  try {
    const result = await getAllProducts();
    
    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export async function addProduct(req: Request, res: Response) {
  try {
    const { name, price, category, stock } = req.body;

    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, category, and stock are required'
      });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price and stock cannot be negative'
      });
    }

    const result = await createProduct({ name, price, category, stock });

    if (!result.success) {
      return res.status(500).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error('Add product error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
