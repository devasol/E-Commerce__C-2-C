import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdTune, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdExpandMore, MdCheck, MdSearch, MdClose } from 'react-icons/md';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [availableCategories] = useState<string[]>(['All Categories', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports', 'Beauty', 'Books', 'Toys']);
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams: any = {
        page: page,
        limit: productsPerPage,
        search: searchTerm || undefined,
        category: category !== 'all' ? category : undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 2000 ? priceRange[1] : undefined,
        sort: sortBy !== 'featured' ? sortBy : undefined
      };

      const response = await productAPI.getAll(queryParams);
      setProducts(response.data.data);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalProducts(response.data.pagination?.totalProducts || (response.data.data ? response.data.data.length : 0));
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    const categoryFromUrl = searchParams.get('category') || 'all';
    
    if (searchFromUrl !== searchTerm) setSearchTerm(searchFromUrl);
    if (categoryFromUrl !== category) setCategory(categoryFromUrl);
  }, [searchParams, searchTerm, category]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, searchTerm, category, priceRange, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, category, priceRange, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (category !== 'all') params.set('category', category);
    setSearchParams(params, { replace: true });
  }, [searchTerm, category]); // eslint-disable-line react-hooks/exhaustive-deps



  return (
    <div className="min-h-screen bg-surface-50 pt-10 pb-20">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-xl text-left">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-surface-900 mb-6 leading-tight">
                Explore Our <span className="text-gradient">Collections</span>
              </h1>
              <p className="text-surface-500 text-lg font-medium">
                Find exactly what you're looking for with our advanced filtering and sorting options.
              </p>
            </motion.div>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-premium-outline bg-white flex items-center gap-2 !px-6"
          >
            {showFilters ? <MdClose /> : <MdTune />}
            {showFilters ? 'Close Filters' : 'Advanced Filters'}
          </button>
        </div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="glass-card rounded-[2.5rem] p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Search */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Product name..."
                      className="input-premium pl-12"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 text-xl" />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Category</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full text-left input-premium flex items-center justify-between"
                    >
                      <span className="truncate">{category === 'all' ? 'All Categories' : category}</span>
                      <MdExpandMore className={`transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showCategoryDropdown && (
                        <motion.ul
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute z-50 mt-2 w-full glass-card rounded-2xl py-2 shadow-2xl max-h-60 overflow-auto"
                        >
                          {availableCategories.map((cat) => {
                            const val = cat.toLowerCase().includes('all') ? 'all' : cat.toLowerCase().replace(/\s+/g, '-');
                            return (
                              <li
                                key={cat}
                                onClick={() => { setCategory(val); setShowCategoryDropdown(false); }}
                                className={`px-4 py-3 cursor-pointer hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center justify-between ${category === val ? 'text-primary-600 font-bold bg-primary-50' : 'text-surface-600'}`}
                              >
                                {cat}
                                {category === val && <MdCheck />}
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest flex justify-between">
                    Price Range <span>${priceRange[0]} - ${priceRange[1]}+</span>
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="input-premium !py-2 !px-4 text-sm"
                      placeholder="Min"
                    />
                    <div className="w-4 h-[2px] bg-surface-200 shrink-0" />
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="input-premium !py-2 !px-4 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Sorting */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Sort By</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="w-full text-left input-premium flex items-center justify-between"
                    >
                      <span>{sortBy === 'featured' ? 'Featured' : sortBy.replace('-', ' ')}</span>
                      <MdExpandMore className={`transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showSortDropdown && (
                        <motion.ul
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute z-50 mt-2 w-full glass-card rounded-2xl py-2 shadow-2xl"
                        >
                          {['featured', 'price-low', 'price-high', 'rating'].map((s) => (
                            <li
                              key={s}
                              onClick={() => { setSortBy(s); setShowSortDropdown(false); }}
                              className="px-4 py-3 cursor-pointer hover:bg-primary-50 hover:text-primary-600 transition-colors capitalize text-surface-600"
                            >
                              {s.replace('-', ' ')}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8 px-2">
          <p className="text-surface-400 font-medium">
            Showing <span className="text-surface-900 font-bold">{products.length}</span> of <span className="text-surface-900 font-bold">{totalProducts}</span> total results
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-4 shadow-premium border border-surface-100 flex flex-col h-full min-h-[400px]">
                <div className="w-full aspect-[4/5] rounded-[2rem] skeleton mb-6" />
                <div className="px-2 space-y-4">
                  <div className="w-1/3 h-3 skeleton rounded-full" />
                  <div className="w-3/4 h-5 skeleton rounded-xl" />
                  <div className="w-1/2 h-8 skeleton rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-surface-100 rounded-[2rem] flex items-center justify-center mb-6 text-surface-300 text-4xl">
               <MdSearch />
            </div>
            <h3 className="text-2xl font-bold text-surface-900 mb-2">No matches found</h3>
            <p className="text-surface-400 mb-8">Try adjusting your filters or search term.</p>
            <button className="btn-premium-primary" onClick={() => { setSearchTerm(''); setCategory('all'); setPriceRange([0, 2000]); setSortBy('featured'); }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
          >
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:bg-primary-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <MdKeyboardArrowLeft className="text-2xl" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1 ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-4 ring-primary-100' : 'glass-card hover:bg-surface-100'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center hover:bg-primary-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <MdKeyboardArrowRight className="text-2xl" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

