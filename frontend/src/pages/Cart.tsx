import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const Cart: React.FC = () => {
  const { state: cartState, removeFromCart, updateQuantity, loadCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    document.title = 'Shopping Cart - E-Shop';
  }, []);

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
<<<<<<< HEAD
      // Optionally show a success message
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      alert(error?.message || 'Failed to remove item from cart. Please try again.');
=======
    } catch (error) {
      console.error('Error removing item from cart:', error);
>>>>>>> 6281576513cf78cfbb928bd30123346a6cb2908d
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(productId);
      return;
    }
<<<<<<< HEAD

    try {
      await updateQuantity(productId, newQuantity);
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      alert(error?.message || 'Failed to update quantity. Please try again.');
=======
    
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
>>>>>>> 6281576513cf78cfbb928bd30123346a6cb2908d
    }
  };

  const handleCheckout = () => {
    if (cartState.items.length > 0) {
      navigate('/checkout');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cartState.items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Link 
            to="/products" 
            className="btn-primary inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cartState.items.map((item: any, index: number) => (
                <motion.div
                  key={typeof item.product === 'object' ? item.product._id : item.product}
                  className="border-b border-gray-200 p-6 flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden mr-6">
                    <img 
                      src={typeof item.product === 'object' ? 
                        (item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/100x100') 
                        : 'https://via.placeholder.com/100x100'} 
                      alt={typeof item.product === 'object' ? item.product.name : 'Product'} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">
                      {typeof item.product === 'object' ? item.product.name : 'Product Name'}
                    </h3>
                    <p className="text-gray-600">
                      ${typeof item.product === 'object' ? item.product.price.toFixed(2) : item.price.toFixed(2)} each
                    </p>
                    
                    <div className="flex items-center mt-4">
                      <button 
                        className="border rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={() => handleUpdateQuantity(
                          typeof item.product === 'object' ? item.product._id : item.product, 
                          item.quantity - 1
                        )}
                      >
                        <FaMinus size={12} />
                      </button>
                      
                      <span className="mx-4">{item.quantity}</span>
                      
                      <button 
                        className="border rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={() => handleUpdateQuantity(
                          typeof item.product === 'object' ? item.product._id : item.product, 
                          item.quantity + 1
                        )}
                      >
                        <FaPlus size={12} />
                      </button>
                      
                      <button 
                        className="ml-6 text-red-600 hover:text-red-800 flex items-center"
                        onClick={() => handleRemoveItem(
                          typeof item.product === 'object' ? item.product._id : item.product
                        )}
                      >
                        <FaTrash className="mr-1" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartState.totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$5.99</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(cartState.totalPrice * 0.08).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(cartState.totalPrice + 5.99 + (cartState.totalPrice * 0.08)).toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;