import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';

import api from './api';
import { useAuth } from './AuthStore';
import { useCart } from './CartStore';
import { useFlashMessage } from './FlashMessageStore';

function ShoppingCart() {
  const [errorMessage, setErrorMessage] =
    useState('');

  const [isCheckingOut, setIsCheckingOut] =
    useState(false);

  const [, setLocation] = useLocation();

  const {
    auth,
    isAuthenticated,
  } = useAuth();

  const {
    cart,
    total,
    isLoading,
    fetchCart,
    modifyQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { showMessage } = useFlashMessage();

  useEffect(() => {
    const loadCart = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        setErrorMessage('');
        await fetchCart();
      } catch (error) {
        console.error('Cart loading error:', error);

        setErrorMessage(
          error.response?.data?.message ||
            'Unable to load your cart.'
        );
      }
    };

    loadCart();
  }, [fetchCart, isAuthenticated]);

  const handleQuantityChange = async (
    productId,
    quantity
  ) => {
    try {
      await modifyQuantity(productId, quantity);
    } catch (error) {
      console.error('Quantity update error:', error);

      showMessage(
        error.response?.data?.message ||
          'Unable to update the quantity.',
        'danger'
      );
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);

      showMessage(
        'Product removed from cart.',
        'success'
      );
    } catch (error) {
      console.error('Cart removal error:', error);

      showMessage(
        error.response?.data?.message ||
          'Unable to remove the product.',
        'danger'
      );
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);

      await api.post(
        '/orders',
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      clearCart();

      showMessage(
        'Order created successfully!',
        'success'
      );

      setLocation('/orders');
    } catch (error) {
      console.error('Checkout error:', error);

      showMessage(
        error.response?.data?.message ||
          'Unable to complete checkout.',
        'danger'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Please <Link href="/login">log in</Link>{' '}
          to view your saved cart.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container my-5">
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Shopping Cart</h2>

      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}

      {!errorMessage && cart.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty.
        </div>
      ) : (
        !errorMessage && (
          <>
            <ul className="list-group">
              {cart.map((item) => (
                <li
                  key={item.productId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-image me-3"
                    />

                    <div>
                      <h5>{item.name}</h5>

                      <div className="d-flex align-items-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary me-2"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>

                        <p className="mb-0">
                          Quantity: {item.quantity}
                        </p>

                        <button
                          type="button"
                          className="btn btn-sm btn-secondary ms-2"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <p className="mb-2">
                      ${item.lineTotal.toFixed(2)}
                    </p>

                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleRemove(item.productId)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 mb-4 text-end">
              <h4>
                Total: ${Number(total).toFixed(2)}
              </h4>

              <button
                type="button"
                className="btn btn-success mt-2"
                disabled={isCheckingOut}
                onClick={handleCheckout}
              >
                {isCheckingOut
                  ? 'Processing order...'
                  : 'Checkout'}
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default ShoppingCart;