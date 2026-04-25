import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaShoppingCart, FaHeart, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { wishlistAPI } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';

const Wishlist: React.FC = () => {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.get();
      setWishlistItems(response.data.data.items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setLoadingItems(prev => ({ ...prev, [productId]: true }));
    try {
      await wishlistAPI.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setLoadingItems(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  };

  const handleAddToCart = async (product: any) => {
    setLoadingItems(prev => ({ ...prev, [product._id]: true }));
    try {
      await addToCart(product._id, 1);
      alert(`${product.name} added to cart successfully!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setLoadingItems(prev => {
        const newState = { ...prev };
        delete newState[product._id];
        return newState;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-surface-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Wishlist</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-10 pb-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-display font-bold text-surface-900">
            Your <span className="text-gradient">Wishlist</span>
          </h1>
          <p className="text-surface-500 mt-2 text-lg">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later</p>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 glass-card rounded-[3rem]"
          >
            <div className="w-24 h-24 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-red-300 text-5xl">
              <FaHeart />
            </div>
            <h2 className="text-3xl font-bold text-surface-900 mb-3">Your wishlist is empty</h2>
            <p className="text-surface-500 mb-10 text-lg max-w-sm mx-auto">Found something you like? Tap the heart icon to save it here for later.</p>
            <Link to="/products" className="btn-premium-primary text-base !px-10 !py-4 inline-flex">
              Discover Products <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {wishlistItems.map((item: any, index: number) => {
                const product = typeof item.product === 'object' ? item.product : {};
                const productId = product._id;
                const isItemLoading = loadingItems[productId];

                return (
                  <motion.div
                    key={productId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="premium-card group flex flex-col"
                  >
                    <div className="relative aspect-square bg-surface-100 p-6 overflow-hidden rounded-t-2xl">
                      <ImageWithFallback
                        src={product.images?.[0] || 'https://via.placeholder.com/400'}
                        alt={product.name || 'Product'}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                      />
                      <button
                        onClick={() => removeFromWishlist(productId)}
                        disabled={isItemLoading}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        {isItemLoading ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <FaTrash />}
                      </button>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-bold text-surface-900 text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.name || 'Unknown Product'}
                      </h3>
                      <div className="text-2xl font-extrabold text-primary-600 mb-6">
                        ${(product.price || 0).toFixed(2)}
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isItemLoading}
                          className="w-full btn-premium-primary !py-3"
                        >
                          {isItemLoading ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" /> Working...</>
                          ) : (
                            <><FaShoppingCart className="mr-2" /> Add to Cart</>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;