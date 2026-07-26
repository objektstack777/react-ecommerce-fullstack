import express from 'express';
import cors from 'cors';

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

export default app;