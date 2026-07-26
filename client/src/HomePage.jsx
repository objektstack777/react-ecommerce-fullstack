import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('/featured.json');
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const renderFeaturedProducts = () => {
    const productElements = [];

    for (const product of featuredProducts) {
      productElements.push(
        <div key={product.id} className="col-md-3 mb-4">
          <ProductCard
            imageUrl={product.imageUrl}
            productName={product.name}
            price={product.price.toFixed(2)}
          />
        </div>
      );
    }

    return productElements;
  };

  return (
    <>
      <header className="bg-primary text-white text-center py-5">
        <div className="container">
          <h1 className="display-4">Welcome to E-Shop</h1>

          <p className="lead">
            Discover amazing products at unbeatable prices!
          </p>

          <a href="#" className="btn btn-light btn-lg">
            Shop Now
          </a>
        </div>
      </header>

      <main className="container my-5">
        <h2 className="text-center mb-4">Featured Products</h2>

        <div className="row">
          {renderFeaturedProducts()}
        </div>
      </main>
    </>
  );
}

export default HomePage;