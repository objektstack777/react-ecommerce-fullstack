# React E-Commerce Full-Stack Application

A full-stack e-commerce application built with React, Express, Node.js and MongoDB.

The application allows customers to register, log in, browse and filter products, manage a persistent shopping cart, place orders and view their order history. Administrators can create, update and delete products through a protected product-management interface.

## Main Features

### Customer Features

- User registration
- User login and logout
- JWT-based authentication
- Product catalogue
- Product search
- Category filtering
- Persistent shopping cart
- Cart quantity updates
- Product removal from cart
- Checkout and order creation
- Order history
- Responsive Bootstrap interface

### Administrator Features

- Role-based authorisation
- Protected administrator routes
- Create new products
- Edit existing products
- Delete products
- View all products in an administration table

## Technology Stack

### Frontend

- React
- Vite
- Wouter
- Axios
- Formik
- Yup
- Jotai
- Bootstrap

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Tokens
- bcryptjs
- CORS
- dotenv

## Application Architecture

The application follows a client-server architecture.

- The React client provides the user interface and sends HTTP requests.
- The Express server exposes REST API endpoints.
- MongoDB Atlas stores users, products, carts and orders.
- JSON Web Tokens authenticate users.
- Role-based middleware protects administrator operations.

The backend uses a layered architecture:

1. **Routes** define the REST API endpoints.
2. **Controllers** handle HTTP requests and responses.
3. **Services** contain business logic and validation.
4. **Repositories** communicate with MongoDB.
5. **Models** define the Mongoose database schemas.
6. **Middleware** handles authentication, authorisation and request processing.

## Project Structure

```text
react-ecommerce-fullstack/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── AdminProductsPage.jsx
│   │   ├── App.jsx
│   │   ├── AuthStore.js
│   │   ├── CartStore.js
│   │   ├── FlashMessageStore.js
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── Navbar.jsx
│   │   ├── OrderHistoryPage.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ShoppingCart.jsx
│   │   └── api.js
│   ├── .env
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

Before running the application, install:

- Node.js
- npm
- Git
- A MongoDB Atlas account
- A code editor such as Visual Studio Code

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd react-ecommerce-fullstack
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the URL of the GitHub repository.

Install the frontend dependencies:

```bash
cd client
npm install
```

Install the backend dependencies:

```bash
cd ../server
npm install
```

## Environment Variables

Environment files contain private configuration and must not be committed to GitHub.

### Frontend Environment

Create the following file:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5001
```

### Backend Environment

Create the following file:

```text
server/.env
```

Add:

```env
PORT=5001
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=YOUR_SECURE_RANDOM_SECRET
```

Replace the placeholder values with the correct MongoDB Atlas connection string and a secure JWT secret.

A safe environment-variable template is also available at:

```text
server/.env.example
```

Never place a real MongoDB connection string, database password, authentication token or JWT secret inside the README or commit it to GitHub.

## Running the Application

The frontend and backend must run in separate terminal windows.

### Start the Backend

From the repository root:

```bash
cd server
npm run dev
```

The Express API runs at:

```text
http://localhost:5001
```

A successful startup should confirm that the Express server is running and MongoDB is connected.

### Start the Frontend

Open a second terminal from the repository root:

```bash
cd client
npm run dev
```

The React application runs at:

```text
http://localhost:5173
```

Open this address in a web browser.

## Frontend Routes

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/products` | Product catalogue |
| `/register` | Customer registration |
| `/login` | Customer login |
| `/cart` | Persistent shopping cart |
| `/orders` | Customer order history |
| `/admin/products` | Administrator product management |

The administrator page is protected and is only available to users with the `admin` role.

## REST API Endpoints

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Retrieve the authenticated user |

### Products

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve products | Public |
| `POST` | `/api/products` | Create a product | Administrator |
| `PATCH` | `/api/products/:productId` | Update a product | Administrator |
| `DELETE` | `/api/products/:productId` | Delete a product | Administrator |

Products can be filtered using query parameters:

```text
/api/products?search=coffee
```

```text
/api/products?category=Beverages
```

### Shopping Cart

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/cart` | Retrieve the authenticated user's cart |
| `POST` | `/api/cart` | Add a product to the cart |
| `PATCH` | `/api/cart/:productId` | Update a product quantity |
| `DELETE` | `/api/cart/:productId` | Remove a product from the cart |

All cart endpoints require authentication.

### Orders

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/orders` | Create an order from the shopping cart |
| `GET` | `/api/orders` | Retrieve the authenticated user's orders |
| `GET` | `/api/orders/:orderId` | Retrieve a specific order |

All order endpoints require authentication.

## Authentication and Authorisation

After a successful login, the backend returns a JSON Web Token.

The React application stores the authenticated user's details and token using Jotai persistent state. The token is sent to protected API endpoints using an HTTP header:

```text
Authorization: Bearer USER_TOKEN
```

The backend verifies the token using authentication middleware.

Administrator product-management operations also pass through role-based authorisation middleware.

Typical responses are:

```text
401 Unauthorized
```

Returned when the token is missing or invalid.

```text
403 Forbidden
```

Returned when the user is authenticated but does not have the administrator role.

## Creating an Administrator

Register a normal user through the application first.

From the `server` directory, run:

```bash
npm run make-admin -- user@example.com
```

Replace `user@example.com` with the registered user's email address.

After promotion, log out of the React application and log in again so that a new token containing the administrator role is issued.

## Seeding Products

To insert the initial product data into MongoDB, run the following command from the `server` directory:

```bash
npm run seed
```

The seed script loads the sample product data into the products collection.

## Available Frontend Scripts

Run these commands from the `client` directory.

### Development Server

```bash
npm run dev
```

Starts the Vite development server.

### Production Build

```bash
npm run build
```

Creates an optimised production build inside:

```text
client/dist
```

### Code Quality Check

```bash
npm run lint
```

Checks the React source code using ESLint.

### Production Preview

```bash
npm run preview
```

Previews the compiled production build locally.

## Available Backend Scripts

Run these commands from the `server` directory.

### Development Server

```bash
npm run dev
```

Starts the Express server in development mode.

### Standard Server

```bash
npm start
```

Starts the Express server normally.

### Seed Products

```bash
npm run seed
```

Seeds MongoDB with the initial product data.

### Promote an Administrator

```bash
npm run make-admin -- user@example.com
```

Promotes an existing registered user to the administrator role.

## Testing Checklist

The following functions should be tested before submission:

### Authentication

- Register a new user
- Log in with valid credentials
- Reject invalid login credentials
- Retrieve the authenticated user
- Log out successfully

### Product Catalogue

- Display all products
- Search products by name or description
- Filter products by category
- Reset the product filters

### Shopping Cart

- Add products to the cart
- Preserve the cart after refreshing the browser
- Increase a product quantity
- Decrease a product quantity
- Remove a product
- Display the correct cart total

### Checkout and Orders

- Create an order from the cart
- Clear the cart after checkout
- Redirect to the order-history page
- Display the completed order

### Administrator Functions

- Display the Admin navigation link for an administrator
- Hide the Admin link from normal customers
- Create a product
- Edit a product
- Delete a product
- Return `403 Forbidden` when a customer attempts an administrator operation
- Return `401 Unauthorized` when a protected request has no valid token

## Production Checks

The frontend has been checked using:

```bash
npm run lint
```

and:

```bash
npm run build
```

Both commands should complete without errors before submission.

## Security Notes

- Passwords are hashed using `bcryptjs`.
- Passwords are never stored as plain text.
- JWT authentication protects customer data.
- Role-based middleware protects administrator operations.
- MongoDB credentials and JWT secrets are stored in environment variables.
- Environment files are excluded from Git using `.gitignore`.
- Public API responses exclude unnecessary database fields where appropriate.

## Future Improvements

Possible future enhancements include:

- Online payment-gateway integration
- Inventory and stock management
- Product reviews and ratings
- Order tracking
- Product image uploads
- Customer profile management
- Password-reset functionality
- Administrator analytics dashboard
- Automated frontend and backend tests
- Cloud deployment of the complete application

## Author

Developed as a full-stack software engineering e-commerce project.