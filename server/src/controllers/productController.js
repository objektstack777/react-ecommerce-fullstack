import {
  createNewProduct,
  getProducts,
  removeExistingProduct,
  updateExistingProduct,
} from '../services/productService.js';

const sendProductError = (res, error) => {
  console.error(
    'Product operation error:',
    error.message
  );

  return res.status(error.statusCode || 500).json({
    message: error.statusCode
      ? error.message
      : 'Unable to process product request',
  });
};

export const listProducts = async (req, res) => {
  try {
    const { search = '', category = '' } =
      req.query;

    const products = await getProducts({
      search,
      category,
    });

    res.status(200).json(products);
  } catch (error) {
    sendProductError(res, error);
  }
};

export const createProduct = async (
  req,
  res
) => {
  try {
    const product = await createNewProduct(
      req.body
    );

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    sendProductError(res, error);
  }
};

export const updateProduct = async (
  req,
  res
) => {
  try {
    const product =
      await updateExistingProduct(
        req.params.productId,
        req.body
      );

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    sendProductError(res, error);
  }
};

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await removeExistingProduct(
        req.params.productId
      );

    res.status(200).json({
      message: 'Product deleted successfully',
      product,
    });
  } catch (error) {
    sendProductError(res, error);
  }
};