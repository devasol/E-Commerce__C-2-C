// Load all models to ensure they are registered with Mongoose
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const Cart = require('./Cart');
const Wishlist = require('./Wishlist');

module.exports = {
  User,
  Product,
  Category,
  Order,
  Cart,
  Wishlist
};