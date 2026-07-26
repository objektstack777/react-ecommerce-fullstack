import {
  checkoutCart,
  getOrderForUser,
  getOrdersForUser,
} from '../services/orderService.js';

const sendError = (res, error) => {
  console.error('Order error:', error.message);

  return res.status(error.statusCode || 500).json({
    message: error.statusCode
      ? error.message
      : 'Unable to process order request',
  });
};

export const createOrderFromCart = async (
  req,
  res
) => {
  try {
    const order = await checkoutCart(
      req.user.userId
    );

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const listOrders = async (req, res) => {
  try {
    const orders = await getOrdersForUser(
      req.user.userId
    );

    res.status(200).json({
      orders,
    });
  } catch (error) {
    sendError(res, error);
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await getOrderForUser(
      req.params.orderId,
      req.user.userId
    );

    res.status(200).json({
      order,
    });
  } catch (error) {
    sendError(res, error);
  }
};