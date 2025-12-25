import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

// Mock data for products
const mockProducts = [
  {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    images: ['https://via.placeholder.com/300x300'],
    ratings: { average: 4.5, count: 120 },
    discount: 10,
    stock: 25
  },
  {
    _id: '2',
    name: 'Smart Watch Series 5',
    price: 199.99,
    images: ['https://via.placeholder.com/300x300'],
    ratings: { average: 4.2, count: 85 },
    discount: 15,
    stock: 10
  },
  {
    _id: '3',
    name: 'Laptop Backpack',
    price: 49.99,
    images: ['https://via.placeholder.com/300x300'],
    ratings: { average: 4.7, count: 210 },
    discount: 5,
    stock: 50
  },
  {
    _id: '4',
    name: 'Wireless Charging Pad',
    price: 29.99,
    images: ['https://via.placeholder.com/300x300'],
    ratings: { average: 4.0, count: 65 },
    discount: 0,
    stock: 100
  },
  {
    _id: '5',
    name: 'Noise Cancelling Earbuds',
    price: 79.99,
    images: ['https://via.placeholder.com/300x300'],
    ratings: { average: 4.8, count: 180 },
    discount: 20,
    stock: 15
  },
  {
    _id: '6',
    name: 'Gaming Mouse RGB',
    price: 59.99,
    images: ['https://via.placeholder.com/300x300'],
    ratings: { average: 4.3, count: 90 },
    discount: 0,
    stock: 30
  }
];

const ProductList: React.FC = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setFilteredProducts(products);
    }, 1000);
  }, []);

  useEffect(() => {
    let result = products;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category (simplified)
    if (category !== 'all') {
      // In a real app, you would filter by actual categories
    }

    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(result);
  }, [searchTerm, category, priceRange, products]);

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      {/* Filters */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Kitchen</option>
              <option value="sports">Sports</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden product-card"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">OUT OF STOCK</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                
                <div className="flex items-center mb-2">
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
                      <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/product/${product._id}`} 
                    className="btn-primary py-1 px-3 text-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;