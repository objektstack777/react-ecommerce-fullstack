import express from 'express';
import cors from 'cors';

import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
    ],
  })
);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'E-commerce API is running',
  });
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

export default app;