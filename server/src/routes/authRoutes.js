import { Router } from 'express';

import {
  getProfile,
  login,
  register,
} from '../controllers/authController.js';

import {
  authenticate,
} from '../middleware/authenticate.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticate, getProfile);

export default router;