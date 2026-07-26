import {
  findOrCreateCart,
  saveCart,
} from '../repositories/cartRepository.js';

import {
  findProductById,
  findProductsByIds,
} from '../repositories/productRepository.js';

const buildCartResponse = async (cart) => {
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

  const items = cart.items
    .map((item) => {
      const product = productMap.get(
        item.productId
      );

      if (!product) {
        return null;
      }

      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        category: product.category,
        quantity: item.quantity,
        lineTotal: Number(
          (product.price * item.quantity).toFixed(2)
        ),
      };
    })
    .filter(Boolean);

  const total = Number(
    items
      .reduce(
        (sum, item) => sum + item.lineTotal,
        0
      )
      .toFixed(2)
  );

  return {
    items,
    total,
  };
};

export const getUserCart = async (userId) => {
  const cart = await findOrCreateCart(userId);

  return buildCartResponse(cart);
};

export const addProductToCart = async (
  userId,
  productId
) => {
  const numericProductId = Number(productId);

  if (!Number.isInteger(numericProductId)) {
    const error = new Error(
      'A valid product ID is required'
    );
    error.statusCode = 400;
    throw error;
  }

  const product = await findProductById(
    numericProductId
  );

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  const cart = await findOrCreateCart(userId);

  const existingItem = cart.items.find(
    (item) => item.productId === numericProductId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({
      productId: numericProductId,
      quantity: 1,
    });
  }

  await saveCart(cart);

  return buildCartResponse(cart);
};

export const updateCartQuantity = async (
  userId,
  productId,
  quantity
) => {
  const numericProductId = Number(productId);
  const numericQuantity = Number(quantity);

  if (
    !Number.isInteger(numericProductId) ||
    !Number.isInteger(numericQuantity) ||
    numericQuantity < 1
  ) {
    const error = new Error(
      'Product ID and quantity must be valid'
    );
    error.statusCode = 400;
    throw error;
  }

  const cart = await findOrCreateCart(userId);

  const item = cart.items.find(
    (cartItem) =>
      cartItem.productId === numericProductId
  );

  if (!item) {
    const error = new Error(
      'Cart item not found'
    );
    error.statusCode = 404;
    throw error;
  }

  item.quantity = numericQuantity;

  await saveCart(cart);

  return buildCartResponse(cart);
};

export const removeProductFromCart = async (
  userId,
  productId
) => {
  const numericProductId = Number(productId);
  const cart = await findOrCreateCart(userId);

  const originalLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.productId !== numericProductId
  );

  if (cart.items.length === originalLength) {
    const error = new Error(
      'Cart item not found'
    );
    error.statusCode = 404;
    throw error;
  }

  await saveCart(cart);

  return buildCartResponse(cart);
};