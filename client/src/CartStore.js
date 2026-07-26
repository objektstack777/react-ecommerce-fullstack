import { useCallback } from 'react';
import { atom, useAtom } from 'jotai';

import api from './api';
import { useAuth } from './AuthStore';

export const cartAtom = atom({
  items: [],
  total: 0,
  isLoading: false,
});

export const useCart = () => {
  const [cartState, setCartState] = useAtom(cartAtom);
  const { auth } = useAuth();

  const getAuthConfig = useCallback(() => {
    if (!auth.token) {
      throw new Error('Authentication required');
    }

    return {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    };
  }, [auth.token]);

  const applyCartResponse = useCallback(
    (data) => {
      setCartState({
        items: data.items || [],
        total: data.total || 0,
        isLoading: false,
      });
    },
    [setCartState]
  );

  const fetchCart = useCallback(async () => {
    setCartState((currentState) => ({
      ...currentState,
      isLoading: true,
    }));

    try {
      const response = await api.get(
        '/cart',
        getAuthConfig()
      );

      applyCartResponse(response.data);

      return response.data;
    } catch (error) {
      setCartState((currentState) => ({
        ...currentState,
        isLoading: false,
      }));

      throw error;
    }
  }, [applyCartResponse, getAuthConfig, setCartState]);

  const addToCart = useCallback(
    async (productId) => {
      const response = await api.post(
        '/cart',
        { productId },
        getAuthConfig()
      );

      applyCartResponse(response.data);

      return response.data;
    },
    [applyCartResponse, getAuthConfig]
  );

  const modifyQuantity = useCallback(
    async (productId, quantity) => {
      const response = await api.patch(
        `/cart/${productId}`,
        { quantity },
        getAuthConfig()
      );

      applyCartResponse(response.data);

      return response.data;
    },
    [applyCartResponse, getAuthConfig]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      const response = await api.delete(
        `/cart/${productId}`,
        getAuthConfig()
      );

      applyCartResponse(response.data);

      return response.data;
    },
    [applyCartResponse, getAuthConfig]
  );

  const clearCart = useCallback(() => {
    setCartState({
      items: [],
      total: 0,
      isLoading: false,
    });
  }, [setCartState]);

  return {
    cart: cartState.items,
    total: cartState.total,
    isLoading: cartState.isLoading,
    fetchCart,
    addToCart,
    modifyQuantity,
    removeFromCart,
    clearCart,
  };
};