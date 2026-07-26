import {
  findAllProducts,
} from '../repositories/productRepository.js';

export const getAllProducts = () => {
  return findAllProducts();
};