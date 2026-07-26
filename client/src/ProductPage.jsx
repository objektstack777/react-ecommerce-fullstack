import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

import api from './api';
import ProductCard from './ProductCard';
import { useCart } from './CartStore';
import { useFlashMessage } from './FlashMessageStore';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { showMessage } = useFlashMessage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await api.get('/products');

        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);

        setErrorMessage(
          'Unable to load products from the server.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    showMessage('New item added to cart!', 'success');
    setLocation('/cart');
  };

  if (isLoading) {
    return (
      <div className="container my-5">
        <p>Loading products...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Our Products</h1>

      <div className="row">
        {products.map((product) => (
          <div
            key={product.id}
            className="col-md-4 mb-4"
          >
            <ProductCard
              imageUrl={product.imageUrl}
              productName={product.name}
              price={product.price.toFixed(2)}
              onAddToCart={() =>
                handleAddToCart(product)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductPage;