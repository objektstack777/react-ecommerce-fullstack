import { useState } from 'react';
import { Link, useLocation } from 'wouter';

import { useAuth } from './AuthStore';
import { useFlashMessage } from './FlashMessageStore';

function Navbar() {
  const [isNavbarShowing, setIsNavbarShowing] =
    useState(false);

  const [location, setLocation] = useLocation();

  const {
    auth,
    logout,
    isAuthenticated,
  } = useAuth();

  const { showMessage } = useFlashMessage();

  const toggleNavbar = () => {
    setIsNavbarShowing((currentValue) => !currentValue);
  };

  const closeNavbar = () => {
    setIsNavbarShowing(false);
  };

  const handleLogout = () => {
    logout();
    closeNavbar();

    showMessage('Logged out successfully', 'success');
    setLocation('/');
  };

  const getNavLinkClass = (path) => {
    return location === path
      ? 'nav-link active'
      : 'nav-link';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link
          href="/"
          className="navbar-brand"
          onClick={closeNavbar}
        >
          E-Commerce Shop
        </Link>

        <button
          type="button"
          className="navbar-toggler"
          onClick={toggleNavbar}
          aria-label="Toggle navigation"
          aria-expanded={isNavbarShowing}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className={`collapse navbar-collapse ${
            isNavbarShowing ? 'show' : ''
          }`}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link
                href="/"
                className={getNavLinkClass('/')}
                onClick={closeNavbar}
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/products"
                className={getNavLinkClass('/products')}
                onClick={closeNavbar}
              >
                Products
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/cart"
                className={getNavLinkClass('/cart')}
                onClick={closeNavbar}
              >
                Cart
              </Link>
            </li>

            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link
                    href="/register"
                    className={getNavLinkClass('/register')}
                    onClick={closeNavbar}
                  >
                    Register
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/login"
                    className={getNavLinkClass('/login')}
                    onClick={closeNavbar}
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
              {isAuthenticated && (
  <>
    {auth.user?.role === 'admin' && (
      <li className="nav-item">
        <Link
          href="/admin/products"
          className={getNavLinkClass(
            '/admin/products'
          )}
          onClick={closeNavbar}
        >
          Admin
        </Link>
      </li>
    )}

    <li className="nav-item">
      <Link
        href="/orders"
        className={getNavLinkClass('/orders')}
        onClick={closeNavbar}
      >
        Orders
      </Link>
    </li>

    <li className="nav-item">
      <span className="navbar-text me-lg-3">
        Hello, {auth.user?.name}
      </span>
    </li>

    <li className="nav-item">
      <button
        type="button"
        className="btn btn-outline-light btn-sm"
        onClick={handleLogout}
      >
        Logout
      </button>
    </li>
  </>
)}        
            
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;