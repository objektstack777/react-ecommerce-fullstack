import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

import api from './api';
import ProductCard from './ProductCard';
import { useCart } from './CartStore';
import { useFlashMessage } from './FlashMessageStore';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { showMessage } = useFlashMessage();

  const fetchProducts = async (filters = {}) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await api.get('/products', {
        params: filters,
      });

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterSubmit = (event) => {
    event.preventDefault();

    fetchProducts({
      search: searchTerm,
      category,
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showMessage('New item added to cart!', 'success');
    setLocation('/cart');
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Our Products</h1>

      <form
        className="row g-3 mb-4"
        onSubmit={handleFilterSubmit}
      >
        <div className="col-md-5">
          <label
            htmlFor="productSearch"
            className="form-label"
          >
            Search products
          </label>

          <input
            id="productSearch"
            type="text"
            className="form-control"
            placeholder="Search by name or description"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="col-md-4">
          <label
            htmlFor="productCategory"
            className="form-label"
          >
            Category
          </label>

          <select
            id="productCategory"
            className="form-select"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option value="">All categories</option>
            <option value="Beverages">Beverages</option>
            <option value="Groceries">Groceries</option>
            <option value="Cooking">Cooking</option>
            <option value="Snacks">Snacks</option>
          </select>
        </div>

        <div className="col-md-3 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-primary me-2"
          >
            Filter
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>

      {isLoading && <p>Loading products...</p>}

      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}

      {!isLoading &&
        !errorMessage &&
        products.length === 0 && (
          <div className="alert alert-info">
            No products match your filters.
          </div>
        )}

      {!isLoading && !errorMessage && (
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
      )}
    </div>
  );
}

export default ProductPage;