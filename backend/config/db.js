const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Please make sure MongoDB is running and accessible.');
    console.log('Try these steps:');
    console.log('1. Open MongoDB Compass and connect to mongodb://127.0.0.1:27017');
    console.log('2. Check if MongoDB service is running in Windows Services');
    console.log('3. Try starting MongoDB manually from the installation directory');
    // Don't exit the process, let nodemon handle restart
    throw error;
  }
};

module.exports = connectDB; 