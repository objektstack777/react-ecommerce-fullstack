import {
  findAllProducts,
} from '../repositories/productRepository.js';

export const getProducts = ({
  search = '',
  category = '',
} = {}) => {
  let products = findAllProducts();

  const normalisedSearch = search.trim().toLowerCase();
  const normalisedCategory = category
    .trim()
    .toLowerCase();

  if (normalisedSearch) {
    products = products.filter((product) => {
      return (
        product.name
          .toLowerCase()
          .includes(normalisedSearch) ||
        product.description
          .toLowerCase()
          .includes(normalisedSearch)
      );
    });
  }

  if (normalisedCategory) {
    products = products.filter((product) => {
      return (
        product.category.toLowerCase() ===
        normalisedCategory
      );
    });
  }

  return products;
};