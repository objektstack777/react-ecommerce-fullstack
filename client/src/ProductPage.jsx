import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'wouter';

import ProductCard from './ProductCard';
import { useCart } from './CartStore';
import { useFlashMessage } from './FlashMessageStore';

function ProductPage() {
  const [products, setProducts] = useState([]);

  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { showMessage } = useFlashMessage();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products.json');
        setProducts(response.data);
      } catch (error) {
        console.error(
          'Error fetching products:',
          error
        );
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);

    showMessage(
      'New item added to cart!',
      'success'
    );

    setLocation('/cart');
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">
        Our Products
      </h1>

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