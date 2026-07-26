import React from 'react';
import { Route, Switch } from 'wouter';
import ShoppingCart from './ShoppingCart';
import FlashMessage from './FlashMessage';
import Navbar from './Navbar';
import HomePage from './HomePage';
import ProductPage from './ProductPage';
import RegisterPage from './RegisterPage';

function App() {
  return (
    <>
      <Navbar />
      <FlashMessage />

      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/cart" component={ShoppingCart} />
      </Switch>

      <footer className="bg-dark text-white text-center py-3">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;