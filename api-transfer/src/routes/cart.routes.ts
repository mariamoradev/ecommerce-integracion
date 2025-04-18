import express from 'express';
import { addCartItem, deleteCartItem } from '../controllers/cart.controller';

const router = express.Router();

router.post('/items', addCartItem);
router.delete('/items/:productId', deleteCartItem);

export default router;
