import mongoose from 'mongoose';

import {
  findOrCreateCart,
  saveCart,
} from '../repositories/cartRepository.js';

import {
  createOrder,
  findOrderByIdAndUser,
  findOrdersByUser,
} from '../repositories/orderRepository.js';

import {
  findProductsByIds,
} from '../repositories/productRepository.js';

export const checkoutCart = async (userId) => {
  const cart = await findOrCreateCart(userId);

  if (cart.items.length === 0) {
    const error = new Error(
      'Your cart is empty'
    );
    error.statusCode = 400;
    throw error;
  }

  const productIds = cart.items.map(
    (item) => item.productId
  );

  const products = await findProductsByIds(
    productIds
  );

  const productMap = new Map(
    products.map((product) => [
      product.id,
      product,
    ])
  );

  const orderItems = cart.items.map((cartItem) => {
    const product = productMap.get(
      cartItem.productId
    );

    if (!product) {
      const error = new Error(
        `Product ${cartItem.productId} is unavailable`
      );
      error.statusCode = 409;
      throw error;
    }

    const lineTotal = Number(
      (
        product.price * cartItem.quantity
      ).toFixed(2)
    );

    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: cartItem.quantity,
      lineTotal,
    };
  });

  const total = Number(
    orderItems
      .reduce(
        (sum, item) => sum + item.lineTotal,
        0
      )
      .toFixed(2)
  );

  const order = await createOrder({
    user: userId,
    items: orderItems,
    total,
    status: 'pending',
  });

  cart.items = [];
  await saveCart(cart);

  return order;
};

export const getOrdersForUser = async (
  userId
) => {
  return findOrdersByUser(userId);
};

export const getOrderForUser = async (
  orderId,
  userId
) => {
  if (!mongoose.isValidObjectId(orderId)) {
    const error = new Error(
      'Invalid order ID'
    );
    error.statusCode = 400;
    throw error;
  }

  const order = await findOrderByIdAndUser(
    orderId,
    userId
  );

  if (!order) {
    const error = new Error(
      'Order not found'
    );
    error.statusCode = 404;
    throw error;
  }

  return order;
};