import {
  getProducts,
} from '../services/productService.js';

export const listProducts = async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;

    const products = await getProducts({
      search,
      category,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Product retrieval error:', error);

    res.status(500).json({
      message: 'Unable to retrieve products',
    });
  }
};