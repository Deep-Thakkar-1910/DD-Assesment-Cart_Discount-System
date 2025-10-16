import { Router } from 'express';
import { getProducts, addProduct } from '../controllers/productController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public route
router.get('/', getProducts);

// Admin only route
router.post('/add', authMiddleware, addProduct);

export default router;
