import React from 'react';
import { Route, Switch } from 'wouter';
import ShoppingCart from './ShoppingCart';
import FlashMessage from './FlashMessage';
import Navbar from './Navbar';
import HomePage from './HomePage';
import ProductPage from './ProductPage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import OrderHistoryPage from './OrderHistoryPage';
import AdminProductsPage from './AdminProductsPage';

function App() {
  return (
    <>
      <Navbar />
      <FlashMessage />

      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductPage} />
        <Route path="/admin/products">
          <AdminProductsPage />
        </Route>
        <Route path="/register" component={RegisterPage} />
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/cart" component={ShoppingCart} />
        <Route path="/orders">
          <OrderHistoryPage />
        </Route>
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