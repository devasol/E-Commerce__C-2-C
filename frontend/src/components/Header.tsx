import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { wishlistAPI } from '../services/api';

const Header: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [wishlistCount, setWishlistCount] = React.useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const loadWishlistCount = async () => {
      if (authState.isAuthenticated) {
        try {
          const response = await wishlistAPI.get();
          setWishlistCount(response.data.data.items.length);
        } catch (error) {
          setWishlistCount(0);
        }
      } else {
        setWishlistCount(0);
      }
    };

    loadWishlistCount();
  }, [authState.isAuthenticated]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:flex space-x-6">
            <span>Free Shipping on Orders Over $50</span>
            <span>24/7 Customer Support</span>
          </div>
          <div className="flex space-x-4">
            <a href="tel:+15551234567" className="hover:text-blue-300">+1 (555) 123-4567</a>
            <a href="mailto:support@eshop.com" className="hover:text-blue-300">support@eshop.com</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo and search bar */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
                <span className="bg-blue-600 text-white rounded-lg px-2 py-1 mr-2">E</span>
                E-Shop
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Search bar - hidden on mobile until menu is open */}
          <div className={`w-full md:w-1/2 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Right side - Auth and Cart */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex items-center justify-center relative w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            >
              <FaHeart className="text-gray-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center justify-center relative w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
            >
              <FaShoppingCart className="text-gray-600" />
              {cartState.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartState.totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {authState.isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="text-gray-600" />
                  </div>
                  <span className="hidden md:inline font-medium">{authState.user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                  >
                    <FaUser className="mr-2" /> Profile
                  </Link>
                  <Link
                    to="/order-history"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                  >
                    <FaShoppingCart className="mr-2" /> Order History
                  </Link>
                  {authState.user?.role === 'seller' && (
                    <Link
                      to="/seller/products"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <FaShoppingCart className="mr-2" /> My Products
                    </Link>
                  )}
                  {authState.user?.role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                    >
                      <FaUser className="mr-2" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
                  >
                    <FaUser className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 hover:bg-gray-100 rounded-md transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className={`mt-6 ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-1 md:gap-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
              >
                Products
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
              >
                Electronics
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
              >
                Fashion
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
              >
                Home & Kitchen
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
              >
                Beauty
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
              >
                Sports
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors duration-300"
              >
                Books
              </Link>
            </div>
            <div className="flex gap-2">
              {authState.user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 hover:bg-gray-100 rounded-md transition-colors duration-300"
                >
                  Admin
                </Link>
              )}
              {authState.user?.role === 'seller' && (
                <Link
                  to="/seller/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 hover:bg-gray-100 rounded-md transition-colors duration-300"
                >
                  Seller
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;