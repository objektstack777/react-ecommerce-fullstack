import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';

import api from './api';
import { useAuth } from './AuthStore';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState('');

  const {
    auth,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get(
          '/orders',
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        setOrders(response.data.orders);
      } catch (error) {
        console.error(
          'Order history error:',
          error
        );

        setErrorMessage(
          error.response?.data?.message ||
            'Unable to load your orders.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [auth.token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          Please <Link href="/login">log in</Link>{' '}
          to view your orders.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container my-5">
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Order History</h1>

      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}

      {!errorMessage && orders.length === 0 && (
        <div className="alert alert-info">
          You have not placed any orders yet.
        </div>
      )}

      {!errorMessage &&
        orders.map((order) => (
          <div
            key={order._id}
            className="card mb-4"
          >
            <div className="card-header d-flex justify-content-between">
              <span>
                Order #{order._id.slice(-8)}
              </span>

              <span className="badge bg-secondary text-capitalize">
                {order.status}
              </span>
            </div>

            <div className="card-body">
              <p>
                <strong>Placed:</strong>{' '}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>

              <ul className="list-group mb-3">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>

                    <span>
                      ${item.lineTotal.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <h5 className="text-end">
                Total: ${order.total.toFixed(2)}
              </h5>
            </div>
          </div>
        ))}
    </div>
  );
}

export default OrderHistoryPage;