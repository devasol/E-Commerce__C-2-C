const mongoose = require('mongoose');
// Load all models to ensure they are registered with Mongoose
require('../models');

const connectDB = async () => {
  try {
    // Use local MongoDB if MONGODB_URI is not set or if we want to use local for testing
    const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

    console.log('Attempting to connect to MongoDB...');

    const conn = await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Add connection event listeners for better debugging
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Please check your MongoDB connection string and network connectivity');
    process.exit(1);
  }
};

module.exports = connectDB;