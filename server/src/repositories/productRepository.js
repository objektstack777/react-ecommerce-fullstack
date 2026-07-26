import Product from '../models/Product.js';

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const findAllProducts = async ({
  search = '',
  category = '',
} = {}) => {
  const query = {};

  const trimmedSearch = search.trim();
  const trimmedCategory = category.trim();

  if (trimmedSearch) {
    const safeSearch = escapeRegex(trimmedSearch);

    query.$or = [
      {
        name: {
          $regex: safeSearch,
          $options: 'i',
        },
      },
      {
        description: {
          $regex: safeSearch,
          $options: 'i',
        },
      },
    ];
  }

  if (trimmedCategory) {
    query.category = trimmedCategory;
  }

  return Product.find(query)
    .select('-_id -__v -createdAt -updatedAt')
    .sort({ id: 1 })
    .lean();
};