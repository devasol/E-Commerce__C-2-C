import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { wishlistAPI } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';

const Wishlist: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="text-5xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your wishlist yet</p>
          <Link
            to="/products"
            className="btn-primary inline-block"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item: any, index: number) => (
            <motion.div
              key={item.product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-1/3">
                <ImageWithFallback
                  src={typeof item.product === 'object' && item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/200x200'}
                  alt={typeof item.product === 'object' ? item.product.name : 'Product Image'}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              
              <div className="w-2/3 p-4 flex flex-col">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{typeof item.product === 'object' ? item.product.name : 'Product Name'}</h3>
                
                <div className="text-xl font-bold text-blue-600 mb-2">
                  ${typeof item.product === 'object' ? (item.product.price?.toFixed(2) || '0.00') : '0.00'}
                </div>
                
                <div className="mt-auto flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                    disabled={loadingItems[item.product._id]}
                  >
                    {loadingItems[item.product._id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Adding...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-2" /> Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => removeFromWishlist(item.product._id)}
                    className="flex items-center justify-center w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-md"
                    title="Remove from wishlist"
                    disabled={loadingItems[item.product._id]}
                  >
                    {loadingItems[item.product._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;