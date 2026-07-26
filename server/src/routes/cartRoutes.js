import { Router } from 'express';

import {
  addCartItem,
  deleteCartItem,
  getCart,
  updateCartItem,
} from '../controllers/cartController.js';

import {
  authenticate,
} from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/', addCartItem);
router.patch('/:productId', updateCartItem);
router.delete('/:productId', deleteCartItem);

export default router;