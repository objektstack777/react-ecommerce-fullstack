import { Router } from 'express';

import {
  createOrderFromCart,
  getOrder,
  listOrders,
} from '../controllers/orderController.js';

import {
  authenticate,
} from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.post('/', createOrderFromCart);
router.get('/', listOrders);
router.get('/:orderId', getOrder);

export default router;