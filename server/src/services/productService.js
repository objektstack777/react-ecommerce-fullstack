import {
  createProductRecord,
  deleteProductRecord,
  findAllProducts,
  findHighestProductId,
  updateProductRecord,
} from '../repositories/productRepository.js';

const validateProductId = (productId) => {
  const numericProductId = Number(productId);

  if (
    !Number.isInteger(numericProductId) ||
    numericProductId < 1
  ) {
    const error = new Error(
      'A valid product ID is required'
    );
    error.statusCode = 400;
    throw error;
  }

  return numericProductId;
};

const prepareProductData = (
  productData,
  partial = false
) => {
  const result = {};

  const stringFields = [
    'name',
    'imageUrl',
    'description',
    'category',
  ];

  stringFields.forEach((field) => {
    if (productData[field] !== undefined) {
      if (
        typeof productData[field] !== 'string' ||
        !productData[field].trim()
      ) {
        const error = new Error(
          `${field} must contain a value`
        );
        error.statusCode = 400;
        throw error;
      }

      result[field] = productData[field].trim();
    }
  });

  if (productData.price !== undefined) {
    const numericPrice = Number(
      productData.price
    );

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      const error = new Error(
        'Price must be a valid positive number'
      );
      error.statusCode = 400;
      throw error;
    }

    result.price = numericPrice;
  }

  if (!partial) {
    const requiredFields = [
      'name',
      'price',
      'imageUrl',
      'description',
      'category',
    ];

    const missingField = requiredFields.find(
      (field) => result[field] === undefined
    );

    if (missingField) {
      const error = new Error(
        `${missingField} is required`
      );
      error.statusCode = 400;
      throw error;
    }
  }

  return result;
};

export const getProducts = async ({
  search = '',
  category = '',
} = {}) => {
  return findAllProducts({
    search,
    category,
  });
};

export const createNewProduct = async (
  productData
) => {
  const cleanedData = prepareProductData(
    productData
  );

  const highestProduct =
    await findHighestProductId();

  const nextId = (highestProduct?.id || 0) + 1;

  return createProductRecord({
    id: nextId,
    ...cleanedData,
  });
};

export const updateExistingProduct = async (
  productId,
  productData
) => {
  const numericProductId =
    validateProductId(productId);

  const cleanedData = prepareProductData(
    productData,
    true
  );

  if (Object.keys(cleanedData).length === 0) {
    const error = new Error(
      'Provide at least one product field to update'
    );
    error.statusCode = 400;
    throw error;
  }

  const product = await updateProductRecord(
    numericProductId,
    cleanedData
  );

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const removeExistingProduct = async (
  productId
) => {
  const numericProductId =
    validateProductId(productId);

  const product = await deleteProductRecord(
    numericProductId
  );

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};