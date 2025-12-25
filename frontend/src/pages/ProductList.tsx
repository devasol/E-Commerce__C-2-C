import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaStarHalfAlt, FaFilter, FaSlidersH, FaEye, FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa';
import ImageWithFallback from '../components/ImageWithFallback';
import { productAPI, wishlistAPI } from '../services/api';

// Mock data for products
const mockProducts = [
  {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Experience premium sound quality with these wireless Bluetooth headphones. Featuring noise cancellation, long battery life, and comfortable over-ear design for extended listening sessions.',
    price: 99.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1546813788-4a1a2f7c9f87?auto=format&fit=crop&w=500'
    ],
    ratings: { average: 4.5, count: 120 },
    discount: 10,
    stock: 25,
    brand: 'AudioTech',
    category: 'Electronics',
    subcategory: 'Headphones',
    tags: ['wireless', 'bluetooth', 'noise-cancelling', 'premium']
  },
  {
    _id: '2',
    name: 'Smart Watch Series 5',
    description: 'Stay connected with this advanced smartwatch. Features heart rate monitoring, GPS, water resistance, and a vibrant display that works in bright sunlight.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1593305841991-0173b693e8d4?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500'
    ],
    ratings: { average: 4.2, count: 85 },
    discount: 15,
    stock: 10,
    brand: 'TechWear',
    category: 'Electronics',
    subcategory: 'Wearables',
    tags: ['smartwatch', 'fitness', 'health', 'GPS']
  },
  {
    _id: '3',
    name: 'Laptop Backpack',
    description: 'Durable and spacious backpack designed for laptops up to 15.6 inches. Features multiple compartments, water bottle holder, and padded laptop sleeve.',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1554982338-30eec5d015b7?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500'
    ],
    ratings: { average: 4.7, count: 210 },
    discount: 5,
    stock: 50,
    brand: 'TravelPro',
    category: 'Fashion',
    subcategory: 'Bags',
    tags: ['backpack', 'laptop', 'travel', 'durable']
  },
  {
    _id: '4',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Features foreign object detection and over-temperature protection.',
    price: 29.99,
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500'
    ],
    ratings: { average: 4.0, count: 65 },
    discount: 0,
    stock: 100,
    brand: 'ChargeTech',
    category: 'Electronics',
    subcategory: 'Chargers',
    tags: ['wireless', 'charger', 'fast', 'Qi']
  },
  {
    _id: '5',
    name: 'Noise Cancelling Earbuds',
    description: 'True wireless earbuds with active noise cancellation. 24-hour battery life, water-resistant, and perfect for workouts and travel.',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500'
    ],
    ratings: { average: 4.8, count: 180 },
    discount: 20,
    stock: 15,
    brand: 'AudioTech',
    category: 'Electronics',
    subcategory: 'Earbuds',
    tags: ['wireless', 'earbuds', 'noise-cancelling', 'water-resistant']
  },
  {
    _id: '6',
    name: 'Gaming Mouse RGB',
    description: 'High-precision gaming mouse with customizable RGB lighting, programmable buttons, and adjustable DPI settings for optimal performance.',
    price: 59.99,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500'
    ],
    ratings: { average: 4.3, count: 90 },
    discount: 0,
    stock: 30,
    brand: 'GamePro',
    category: 'Electronics',
    subcategory: 'Accessories',
    tags: ['gaming', 'mouse', 'RGB', 'programmable']
  },
  {
    _id: '7',
    name: '4K Ultra HD Smart TV',
    description: 'Immerse yourself in stunning 4K resolution with HDR technology. Built-in streaming apps, voice control, and sleek design.',
    price: 599.99,
    images: [
      'https://images.unsplash.com/photo-1593305841991-0173b693e8d4?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500'
    ],
    ratings: { average: 4.6, count: 150 },
    discount: 25,
    stock: 8,
    brand: 'VisionTech',
    category: 'Electronics',
    subcategory: 'TVs',
    tags: ['4K', 'smart TV', 'HDR', 'streaming']
  },
  {
    _id: '8',
    name: 'Wireless Keyboard',
    description: 'Ergonomic wireless keyboard with quiet keys, long battery life, and compatibility with multiple devices via Bluetooth.',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1546813788-4a1a2f7c9f87?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500'
    ],
    ratings: { average: 4.4, count: 75 },
    discount: 12,
    stock: 40,
    brand: 'TypePro',
    category: 'Electronics',
    subcategory: 'Accessories',
    tags: ['wireless', 'keyboard', 'ergonomic', 'Bluetooth']
  }
];

const ProductList: React.FC = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  useEffect(() => {
    // Get search term from URL params
    const searchFromUrl = searchParams.get('search') || '';
    setSearchTerm(searchFromUrl);

    // Fetch products from API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll({ search: searchFromUrl });
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);

        // Load wishlist items
        try {
          const wishlistRes = await wishlistAPI.get();
          const wishlistIds = new Set<string>(wishlistRes.data.data.items.map((item: any) => item.product));
          setWishlistItems(wishlistIds);
        } catch (err) {
          // If user is not authenticated or wishlist doesn't exist, just continue
          setWishlistItems(new Set<string>());
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data if API fails
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];

    // Filter by search term (from URL or local state)
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category (simplified)
    if (category !== 'all') {
      result = result.filter(product =>
        product.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by price range
    result = result.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.ratings.average - a.ratings.average);
        break;
      case 'featured':
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(result);
  }, [searchTerm, category, priceRange, sortBy, products]);

  // Update URL when search term changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  }, [searchTerm, setSearchParams]);

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 fill-current" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 fill-current" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0); // Reset to first image
    setShowModal(true);
  };

  const toggleWishlist = async (productId: string) => {
    try {
      if (wishlistItems.has(productId)) {
        // Remove from wishlist
        await wishlistAPI.removeFromWishlist(productId);
        setWishlistItems(prev => {
          const newSet = new Set<string>(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        // Add to wishlist
        await wishlistAPI.addToWishlist(productId);
        setWishlistItems(prev => {
          const newSet = new Set<string>(prev);
          newSet.add(productId);
          return newSet;
        });
      }
    } catch (error: any) {
      console.error('Error updating wishlist:', error);
      alert(error?.message || 'Failed to update wishlist. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl">
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Products
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover amazing products at unbeatable prices
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <motion.div
          className="mb-8 bg-white rounded-xl shadow-md p-6 max-w-6xl mx-auto border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center">
              <FaFilter className="text-blue-600 text-xl mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            </div>
            <button
              className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaSlidersH className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <select
                className="w-full pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Kitchen</option>
                <option value="sports">Sports</option>
                <option value="beauty">Beauty</option>
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span className="font-medium">${priceRange[0]}</span>
                <span className="font-medium">${priceRange[1]}</span>
              </div>
              <div className="pt-1">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                className="w-full pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> products
          </p>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No products found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              className="btn-primary-modern"
              onClick={() => {
                setSearchTerm('');
                setCategory('all');
                setPriceRange([0, 500]);
                setSortBy('featured');
              }}
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 card-hover"
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-56 object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">OUT OF STOCK</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center mb-3">
                    {renderRating(product.ratings.average)}
                    <span className="text-gray-500 text-sm ml-2">({product.ratings.count})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {product.discount > 0 ? (
                        <div className="flex items-center">
                          <span className="text-xl font-bold text-red-600">
                            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                          </span>
                          <span className="text-gray-500 line-through ml-2">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 transition-colors duration-300"
                        title="View Details"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className={`rounded-full p-2 transition-colors duration-300 ${
                          wishlistItems.has(product._id)
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        title={wishlistItems.has(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        {wishlistItems.has(product._id) ? <FaHeart className="h-5 w-5" /> : <FaRegHeart className="h-5 w-5" />}
                      </button>
                      <Link
                        to={`/product/${product._id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 transition-colors duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageWithFallback
                    src={selectedProduct.images[selectedImageIndex]}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-contain rounded-lg mb-4"
                  />
                  {selectedProduct.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2 pt-1">
                      {selectedProduct.images.map((img: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                            selectedImageIndex === index
                              ? 'border-blue-500 ring-2 ring-blue-300 scale-105'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                          aria-label={`View image ${index + 1} of ${selectedProduct.name}`}
                        >
                          <ImageWithFallback
                            src={img}
                            alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      {renderRating(selectedProduct.ratings.average)}
                      <span className="text-gray-600 ml-2">({selectedProduct.ratings.count} reviews)</span>
                    </div>

                    <div className="flex items-center mb-4">
                      {selectedProduct.discount > 0 ? (
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-red-600">
                            ${(selectedProduct.price * (1 - selectedProduct.discount / 100)).toFixed(2)}
                          </span>
                          <span className="text-gray-500 line-through ml-2">
                            ${selectedProduct.price.toFixed(2)}
                          </span>
                          <span className="bg-red-100 text-red-800 text-sm font-semibold ml-2 px-2 py-1 rounded">
                            {selectedProduct.discount}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">${selectedProduct.price.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">Description:</h3>
                      <p className="text-gray-700">{selectedProduct.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <span className="text-gray-600">Brand: </span>
                        <span className="font-semibold">{selectedProduct.brand}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category: </span>
                        <span className="font-semibold">{selectedProduct.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Subcategory: </span>
                        <span className="font-semibold">{selectedProduct.subcategory}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Availability: </span>
                        <span className={selectedProduct.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-gray-600">Tags: </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProduct.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/product/${selectedProduct._id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors duration-300"
                    >
                      View Full Details
                    </Link>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;