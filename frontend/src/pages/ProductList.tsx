import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdStar, MdFilterList, MdTune, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdExpandMore, MdExpandLess, MdCheck } from 'react-icons/md';
import ImageWithFallback from '../components/ImageWithFallback';
import { productAPI } from '../services/api';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [availableCategories] = useState<string[]>(['All Categories','Electronics','Fashion','Home & Kitchen','Sports','Beauty','Books','Toys']);
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination state - now using backend pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 60; // Display 60 products per page

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

  // Fetch products with pagination, filters, and search
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      // Build query parameters
      const queryParams: any = {
        page: page,
        limit: productsPerPage,
        search: searchTerm || undefined,
        category: category !== 'all' ? category : undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined
      };

      // Map sort options to backend sort parameters
      if (sortBy) {
        switch (sortBy) {
          case 'price-low':
            queryParams.sort = 'price-low';
            break;
          case 'price-high':
            queryParams.sort = 'price-high';
            break;
          case 'rating':
            queryParams.sort = 'rating';
            break;
          case 'featured':
          default:
            queryParams.sort = 'featured';
            break;
        }
      }

      const response = await productAPI.getAll(queryParams);

      setProducts(response.data.data);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalProducts(response.data.pagination?.totalProducts || (response.data.data ? response.data.data.length : 0));

    } catch (error) {
      console.error('Error fetching products:', error);
      // Even if API fails, we should still handle the error gracefully
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get search term from URL params
    const searchFromUrl = searchParams.get('search') || '';
    setSearchTerm(searchFromUrl);

    // Fetch products from API
    fetchProducts(currentPage);
  }, [searchParams, currentPage, category, priceRange, sortBy]);

  // When filters change, fetch new products from the backend
  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
    // This will trigger the fetchProducts call in the other useEffect
  }, [searchTerm, category, priceRange, sortBy]);


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

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  // With backend pagination, products are already paginated
  // So currentProducts is just the products state
  const currentProducts = products;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.round(rating); // simplified: round to nearest

    for (let i = 0; i < 5; i++) {
      const filled = i < fullStars;
      stars.push(
        <MdStar
          key={i}
          className={`${filled ? 'text-yellow-400' : 'text-gray-300'} h-4 w-4`}
          aria-hidden="true"
        />
      );
    }

    return <div className="flex items-center gap-1">{stars}</div>;
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
          className="mb-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <MdFilterList className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
            </div>
            <button
              className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <MdTune className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-4 gap-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            {/* Search Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Dropdown - custom */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full text-left pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                aria-haspopup="listbox"
                aria-expanded={showCategoryDropdown}
              >
                <span className="truncate text-gray-700">{category === 'all' ? 'All Categories' : category}</span>
                <span className="ml-2 text-gray-400">
                  {showCategoryDropdown ? <MdExpandLess /> : <MdExpandMore />}
                </span>
              </button>

              {showCategoryDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-auto"
                  role="listbox"
                >
                  {availableCategories.map((cat) => {
                    const val = cat.toLowerCase().includes('all') ? 'all' : cat.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <li
                        key={cat}
                        onClick={() => { setCategory(val); setShowCategoryDropdown(false); setCurrentPage(1); }}
                        className={`px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center justify-between ${category === val ? 'bg-blue-50 text-blue-700' : ''}`}
                        role="option"
                        aria-selected={category === val}
                      >
                        <span className={`${category === val ? 'font-medium' : 'font-normal'}`}>{cat}</span>
                        {category === val && <MdCheck className="text-blue-600" />}
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </div>

            {/* Price Range - min / max inputs */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Math.max(0, Number(e.target.value)), priceRange[1]])}
                  className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Min"
                />
                <span className="text-gray-500 font-medium">to</span>
                <input
                  type="number"
                  min={priceRange[0]}
                  max={10000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], Number(e.target.value))])}
                  className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Max"
                />
              </div>
              <div className="text-xs text-gray-500 text-center">Price: <span className="font-medium text-gray-700">${priceRange[0]} - ${priceRange[1]}</span></div>
            </div>

            {/* Sort Dropdown - custom */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="w-full text-left pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                aria-haspopup="listbox"
                aria-expanded={showSortDropdown}
              >
                <span className="text-gray-700">{sortBy === 'featured' ? 'Featured' : (sortBy === 'price-low' ? 'Price: Low to High' : (sortBy === 'price-high' ? 'Price: High to Low' : 'Top Rated'))}</span>
                <span className="ml-2 text-gray-400">{showSortDropdown ? <MdExpandLess /> : <MdExpandMore />}</span>
              </button>

              {showSortDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-44 overflow-auto"
                  role="listbox"
                >
                  {[{label:'Featured',val:'featured'},{label:'Price: Low to High',val:'price-low'},{label:'Price: High to Low',val:'price-high'},{label:'Top Rated',val:'rating'}].map(opt => (
                    <li
                      key={opt.val}
                      onClick={() => { setSortBy(opt.val); setShowSortDropdown(false); setCurrentPage(1); }}
                      className={`px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center justify-between ${sortBy === opt.val ? 'bg-blue-50 text-blue-700' : ''}`}
                      role="option"
                      aria-selected={sortBy === opt.val}
                    >
                      <span className={`${sortBy === opt.val ? 'font-medium' : 'font-normal'}`}>{opt.label}</span>
                      {sortBy === opt.val && <MdCheck className="text-blue-600" />}
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setCategory('all');
                setPriceRange([0,500]);
                setSortBy('featured');
                setCurrentPage(1);
              }}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors duration-200"
            >
              Reset Filters
            </button>
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
            Showing <span className="font-semibold">{products.length}</span> of <span className="font-semibold">{totalProducts}</span> products
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 && !loading ? (
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
                setCurrentPage(1); // Reset to first page
              }}
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentProducts.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  className="block"
                  key={product._id}
                >
                  <motion.div
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 card-hover"
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={product.images[0]}
                        alt={typeof product.name === 'string' ? product.name : 'Product Image'}
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
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2">{typeof product.name === 'string' ? product.name : 'Product Name'}</h3>

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
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <MdKeyboardArrowLeft className="inline mr-1" /> Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {/* Show first page */}
                    {totalPages > 5 && currentPage > 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className={`px-3 py-2 rounded-lg ${
                            currentPage === 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          1
                        </button>
                        {currentPage > 4 && <span className="px-2 py-2">...</span>}
                      </>
                    )}

                    {/* Show pages around current page */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1) ||
                        (totalPages <= 5)
                      )
                      .map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                    {/* Show last page */}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="px-2 py-2">...</span>}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className={`px-3 py-2 rounded-lg ${
                            currentPage === totalPages
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Next <MdKeyboardArrowRight className="inline ml-1" />
                  </button>
                </div>

                <div className="mt-4 text-gray-600">
                  Page {currentPage} of {totalPages} ({totalProducts} total products)
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
