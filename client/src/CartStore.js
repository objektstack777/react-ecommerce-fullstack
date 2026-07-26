import { atom, useAtom } from 'jotai';

const initialCart = [
  {
    id: 1,
    product_id: 1,
    quantity: 10,
    name: 'Organic Green Tea',
    price: 12.99,
    imageUrl: 'https://picsum.photos/id/225/300/200',
    description:
      'Premium organic green tea leaves, rich in antioxidants and offering a smooth, refreshing taste.',
  },
];

export const cartAtom = atom(initialCart);

export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);

  const getCartTotal = () => {
    return cart
      .reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      )
      .toFixed(2);
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (item) => item.product_id === product.id
      );

      if (existingItemIndex !== -1) {
        return currentCart.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      const newCartItem = {
        id: Math.floor(Math.random() * 10000 + 1),
        product_id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
        quantity: 1,
      };

      return [...currentCart, newCartItem];
    });
  };

  const modifyQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.product_id !== productId
      )
    );
  };

  return {
    cart,
    getCartTotal,
    addToCart,
    modifyQuantity,
    removeFromCart,
  };
};