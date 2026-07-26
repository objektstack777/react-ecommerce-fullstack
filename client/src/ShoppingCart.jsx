import React from 'react';
import { useCart } from './CartStore';

function ShoppingCart() {
  const {
    cart,
    getCartTotal,
    modifyQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="container mt-4">
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group">
            {cart.map((item) => (
              <li
                key={item.id}
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
                        onClick={() =>
                          modifyQuantity(
                            item.product_id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
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
                          modifyQuantity(
                            item.product_id,
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
                    $
                    {(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      removeFromCart(item.product_id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3 mb-3 text-end">
            <h4>Total: ${getCartTotal()}</h4>
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingCart;