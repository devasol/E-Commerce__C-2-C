const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Check products
    const Product = require('./models/Product');
    const products = await Product.find({});
    console.log(`Total products in database: ${products.length}`);
    
    // Show first few products
    console.log('\nFirst 3 products:');
    products.slice(0, 3).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} - Images: ${product.images.length}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();