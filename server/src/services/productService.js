import {
  findAllProducts,
} from '../repositories/productRepository.js';

export const getProducts = async ({
  search = '',
  category = '',
} = {}) => {
  return findAllProducts({
    search,
    category,
  });
};