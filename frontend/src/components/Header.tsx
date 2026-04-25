import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaHeart, FaRegHeart, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { wishlistAPI } from '../services/api';

const Header: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Electronics', path: '/products?category=electronics' },
    { name: 'Fashion', path: '/products?category=fashion' },
    { name: 'Home & Kitchen', path: '/products?category=home' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'py-2 px-4' : 'py-0'}`}>
      <div className={`mx-auto max-w-7xl transition-all duration-500 ${isScrolled ? 'glass-card rounded-2xl' : 'bg-white shadow-sm'}`}>
        {/* Top bar (Hidden when scrolled for a cleaner look) */}
        {!isScrolled && (
          <div className="bg-surface-900 text-white/80 text-[10px] sm:text-xs py-1.5 px-4 rounded-t-lg hidden md:block transition-all duration-300">
            <div className="flex justify-between items-center opacity-80">
              <div className="flex space-x-6">
                <span className="hover:text-white transition-colors cursor-default">Free Shipping on Orders Over $50</span>
                <span className="hover:text-white transition-colors cursor-default">24/7 Customer Support</span>
              </div>
              <div className="flex space-x-4">
                <a href="tel:+15551234567" className="hover:text-primary-400 transition-colors">+1 (555) 123-4567</a>
                <a href="mailto:support@eshop.com" className="hover:text-primary-400 transition-colors">support@eshop.com</a>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <motion.div 
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="bg-primary-600 text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold text-xl mr-3 shadow-lg shadow-primary-500/20 group-hover:bg-primary-500 transition-colors"
              >
                E
              </motion.div>
              <span className="text-2xl font-display font-bold text-surface-900 group-hover:text-primary-600 transition-colors">
                E-Shop
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands and categories..."
                  className="w-full pl-12 pr-4 py-2.5 bg-surface-100 border-none rounded-xl focus:ring-2 focus:ring-primary-500/50 transition-all duration-300 text-surface-900 placeholder:text-surface-400"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-white text-primary-600 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all">
                  Search
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/wishlist" className="relative p-2.5 text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all group">
                <FaHeart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative p-2.5 text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all group border border-transparent hover:border-primary-100">
                <FaShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartState.totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-primary-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white animate-pulse">
                    {cartState.totalItems}
                  </span>
                )}
              </Link>

              <div className="h-8 w-[1px] bg-surface-200 mx-2 hidden sm:block"></div>

              {authState.isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1.5 pr-3 hover:bg-surface-50 rounded-xl transition-all border border-transparent hover:border-surface-200">
                    <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                      {authState.user?.name?.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-medium text-surface-700">{authState.user?.name}</span>
                    <FaChevronDown className="w-3 h-3 text-surface-400 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl py-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-50">
                    <div className="px-4 py-2 border-b border-surface-100 mb-1">
                      <p className="text-xs text-surface-400 uppercase tracking-wider font-bold">Account</p>
                    </div>
                    <Link to="/profile" className="flex items-center px-4 py-2.5 text-surface-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <FaUser className="mr-3 w-4 h-4" /> Profile
                    </Link>
                    <Link to="/order-history" className="flex items-center px-4 py-2.5 text-surface-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <FaShoppingCart className="mr-3 w-4 h-4" /> Order History
                    </Link>
                    {authState.user?.role === 'seller' && (
                      <Link to="/seller/dashboard" className="flex items-center px-4 py-2.5 text-surface-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-semibold">
                        <div className="w-2 h-2 rounded-full bg-primary-500 mr-3 animate-pulse"></div>
                        Seller Dashboard
                      </Link>
                    )}
                    {authState.user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="flex items-center px-4 py-2.5 text-surface-700 hover:bg-primary-50 hover:text-primary-600 transition-colors font-semibold">
                        <div className="w-2 h-2 rounded-full bg-accent-500 mr-3 animate-pulse"></div>
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="my-1 border-t border-surface-100"></div>
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors">
                       Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="px-4 py-2 text-surface-600 font-semibold hover:text-primary-600 transition-colors hidden sm:block">
                    Login
                  </Link>
                  <Link to="/register" className="btn-premium-primary !px-5 !py-2 !rounded-xl !text-sm">
                    Join Now
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2.5 text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="mt-6 hidden lg:flex items-center justify-between border-t border-surface-100 pt-4">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`nav-link-premium ${location.pathname + location.search === link.path ? 'text-primary-600 font-bold after:w-full' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex space-x-6 text-sm text-surface-400 font-medium">
              <span className="hover:text-primary-500 transition-colors cursor-pointer">Gift Cards</span>
              <span className="hover:text-primary-500 transition-colors cursor-pointer">Weekly Deals</span>
              <span className="hover:text-primary-500 transition-colors cursor-pointer">New Arrivals</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-surface-100 overflow-hidden shadow-2xl"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              <form onSubmit={handleSearch} className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 bg-surface-100 border-none rounded-xl focus:ring-2 focus:ring-primary-500/50"
                />
                <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400" />
              </form>
              <div className="grid grid-cols-1 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-3 text-surface-700 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t border-surface-100 flex flex-col gap-2">
                {!authState.isAuthenticated && (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center text-surface-700 font-bold">Login</Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="btn-premium-primary w-full">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;