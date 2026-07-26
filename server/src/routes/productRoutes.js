import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from '../controllers/productController.js';

import {
  authenticate,
} from '../middleware/authenticate.js';

import {
  authoriseRoles,
} from '../middleware/authorise.js';

const router = Router();

router.get('/', listProducts);

router.post(
  '/',
  authenticate,
  authoriseRoles('admin'),
  createProduct
);

router.patch(
  '/:productId',
  authenticate,
  authoriseRoles('admin'),
  updateProduct
);

router.delete(
  '/:productId',
  authenticate,
  authoriseRoles('admin'),
  deleteProduct
);

export default router;