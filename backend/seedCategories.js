// Script to add default categories to the database
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
const connectDB = require('./config/database');
connectDB();

const Category = require('./models/Category');

// Default categories to add
const defaultCategories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    isActive: true
  },
  {
    name: 'Clothing',
    description: 'Apparel and fashion items',
    isActive: true
  },
  {
    name: 'Books',
    description: 'Books and educational materials',
    isActive: true
  },
  {
    name: 'Home & Garden',
    description: 'Home improvement and gardening supplies',
    isActive: true
  },
  {
    name: 'Sports & Outdoors',
    description: 'Sports equipment and outdoor gear',
    isActive: true
  },
  {
    name: 'Beauty & Personal Care',
    description: 'Beauty products and personal care items',
    isActive: true
  },
  {
    name: 'Toys & Games',
    description: 'Toys, games and entertainment',
    isActive: true
  },
  {
    name: 'Automotive',
    description: 'Automotive parts and accessories',
    isActive: true
  },
  {
    name: 'Health & Wellness',
    description: 'Health and wellness products',
    isActive: true
  },
  {
    name: 'Food & Grocery',
    description: 'Food items and grocery products',
    isActive: true
  }
];

const addDefaultCategories = async () => {
  try {
    console.log('Adding default categories to the database...');
    
    for (const categoryData of defaultCategories) {
      // Check if category already exists
      const existingCategory = await Category.findOne({ name: categoryData.name });
      
      if (!existingCategory) {
        const category = await Category.create(categoryData);
        console.log(`Added category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${categoryData.name}`);
      }
    }
    
    console.log('Default categories setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding categories:', error);
    process.exit(1);
  }
};

addDefaultCategories();