# MERN E-commerce Application

A full-featured e-commerce platform built with the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Features

### User Features
- User authentication (Register/Login)
- Product browsing and searching
- Shopping cart management
- Order placement and tracking
- User profile management
- Order history

### Admin Features
- Product management (CRUD operations)
- User management
- Order management
- Dashboard with statistics
- Inventory management

## Tech Stack

### Frontend
- React.js
- Redux Toolkit (State Management)
- React Router (Navigation)
- Axios (API calls)
- Material-UI (UI Components)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- Bcrypt (Password Hashing)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-app
```

2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
npm run install:backend

# Install frontend dependencies
npm run install:frontend
```

3. Environment Setup
- Create `.env` file in backend directory
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```
- Create `.env` file in frontend directory
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the application
```bash
# Start both frontend and backend
npm start

# Start backend only
npm run start:backend

# Start frontend only
npm run start:frontend
```

## Project Structure

```
ecommerce-app/
├── backend/         # Node.js backend
├── frontend/        # React.js frontend
└── package.json     # Root package.json
```

## API Documentation

### Auth Routes
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

### Product Routes
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (Admin)
- PUT /api/products/:id - Update product (Admin)
- DELETE /api/products/:id - Delete product (Admin)

### Order Routes
- POST /api/orders - Create order
- GET /api/orders - Get user orders
- GET /api/orders/:id - Get order details
- PUT /api/orders/:id - Update order status (Admin)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License. 