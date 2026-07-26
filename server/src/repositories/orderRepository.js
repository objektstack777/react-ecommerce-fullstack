import Order from '../models/Order.js';

export const createOrder = async (orderData) => {
  return Order.create(orderData);
};

export const findOrdersByUser = async (userId) => {
  return Order.find({
    user: userId,
  })
    .select('-__v')
    .sort({
      createdAt: -1,
    })
    .lean();
};

export const findOrderByIdAndUser = async (
  orderId,
  userId
) => {
  return Order.findOne({
    _id: orderId,
    user: userId,
  })
    .select('-__v')
    .lean();
};