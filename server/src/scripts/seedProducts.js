import 'dotenv/config';
import mongoose from 'mongoose';

import { connectDatabase } from '../config/database.js';
import products from '../data/products.js';
import Product from '../models/Product.js';

const seedProducts = async () => {
  try {
    await connectDatabase();

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(
      `${products.length} products inserted successfully`
    );
  } catch (error) {
    console.error('Product seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();