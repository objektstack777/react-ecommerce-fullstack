import Product from '../models/Product.js';

const publicFields =
  '-_id -__v -createdAt -updatedAt';

const escapeRegex = (value) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );
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
    .select(publicFields)
    .sort({ id: 1 })
    .lean();
};

export const findProductById = async (
  productId
) => {
  return Product.findOne({
    id: Number(productId),
  })
    .select(publicFields)
    .lean();
};

export const findProductsByIds = async (
  productIds
) => {
  return Product.find({
    id: {
      $in: productIds,
    },
  })
    .select(publicFields)
    .lean();
};

export const findHighestProductId = async () => {
  return Product.findOne()
    .sort({ id: -1 })
    .select('id -_id')
    .lean();
};

export const createProductRecord = async (
  productData
) => {
  const product = await Product.create(
    productData
  );

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    description: product.description,
    category: product.category,
  };
};

export const updateProductRecord = async (
  productId,
  updates
) => {
  return Product.findOneAndUpdate(
    {
      id: Number(productId),
    },
    {
      $set: updates,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    }
  )
    .select(publicFields)
    .lean();
};

export const deleteProductRecord = async (
  productId
) => {
  return Product.findOneAndDelete({
    id: Number(productId),
  })
    .select(publicFields)
    .lean();
};