import Cart from '../models/Cart.js';

export const findOrCreateCart = async (userId) => {
  return Cart.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $setOnInsert: {
        user: userId,
        items: [],
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
};

export const saveCart = async (cart) => {
  return cart.save();
};