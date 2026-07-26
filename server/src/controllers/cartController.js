import {
  addProductToCart,
  getUserCart,
  removeProductFromCart,
  updateCartQuantity,
} from '../services/cartService.js';

const sendError = (res, error) => {
  console.error('Cart error:', error.message);

  return res.status(error.statusCode || 500).json({
    message: error.statusCode
      ? error.message
      : 'Unable to process cart request',
  });
};

export const getCart = async (req, res) => {
  try {
    const cart = await getUserCart(
      req.user.userId
    );

    res.status(200).json(cart);
  } catch (error) {
    sendError(res, error);
  }
};

export const addCartItem = async (req, res) => {
  try {
    const cart = await addProductToCart(
      req.user.userId,
      req.body.productId
    );

    res.status(200).json({
      message: 'Product added to cart',
      ...cart,
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const updateCartItem = async (
  req,
  res
) => {
  try {
    const cart = await updateCartQuantity(
      req.user.userId,
      req.params.productId,
      req.body.quantity
    );

    res.status(200).json({
      message: 'Cart quantity updated',
      ...cart,
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const deleteCartItem = async (
  req,
  res
) => {
  try {
    const cart = await removeProductFromCart(
      req.user.userId,
      req.params.productId
    );

    res.status(200).json({
      message: 'Product removed from cart',
      ...cart,
    });
  } catch (error) {
    sendError(res, error);
  }
};