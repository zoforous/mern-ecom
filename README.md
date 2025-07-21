# ShopEasy - Modern E-commerce Platform

ShopEasy is a full-featured e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) and Material-UI. It provides a seamless shopping experience with features like product search, cart management, user authentication, and order tracking.

## Features

### User Features
- 🛍️ Browse and search products
- 🔍 Advanced search functionality
- 🛒 Cart management
- 📦 Order tracking
- 👤 User profile management
- 📍 Multiple shipping addresses
- 💳 Multiple payment options
- 📱 Responsive design

### Admin Features
- 📊 Dashboard with sales analytics
- 📝 Product management
- 🏷️ Category management
- 📦 Order management
- 👥 User management
- 📈 Sales reports

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- Material-UI for UI components
- React Router for navigation
- Formik & Yup for form handling
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Express Validator for validation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shopeasy.git
cd shopeasy
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

## Project Structure

```
shopeasy/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── features/
│       ├── pages/
│       ├── redux/
│       └── utils/
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)
Project Link: [https://github.com/yourusername/shopeasy](https://github.com/yourusername/shopeasy)

## Acknowledgments
- Material-UI for the amazing UI components
- React and Redux teams for the excellent documentation
- MongoDB team for the great database solution 