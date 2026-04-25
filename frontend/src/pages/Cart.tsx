import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight, FaShieldAlt, FaTruck } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';

interface CartItemProps {
  item: any;
  index: number;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
}

const CartItem: React.FC<CartItemProps> = ({ item, index, removeFromCart, updateQuantity }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { showError } = useNotification();
  const productId = typeof item.product === 'object' ? item.product._id : (typeof item.product === 'string' ? item.product : item._id);
  const productName = typeof item.product === 'object' ? item.product.name : 'Product';
  const productImage = typeof item.product === 'object' && item.product.images?.length > 0 ? item.product.images[0] : 'https://via.placeholder.com/100x100';
  const productPrice = typeof item.product === 'object' ? item.product.price : item.price;

  const handleRemove = async () => {
    setIsLoading(true);
    try { await removeFromCart(productId); }
    catch (e: any) { showError(e?.message || 'Failed to remove item.'); }
    finally { setIsLoading(false); }
  };

  const handleQty = async (qty: number) => {
    if (qty < 1) { await handleRemove(); return; }
    setIsLoading(true);
    try { await updateQuantity(productId, qty); }
    catch (e: any) { showError(e?.message || 'Failed to update quantity.'); }
    finally { setIsLoading(false); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="flex items-center gap-6 p-6 border-b border-surface-100 last:border-0 group"
    >
      {/* Image */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-100 shrink-0 shadow-sm">
        <img src={productImage} alt={productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>

      {/* Info */}
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-surface-900 text-lg truncate mb-1">{productName}</h3>
        <p className="text-primary-600 font-semibold">${productPrice?.toFixed(2)} each</p>

        {/* Qty Controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => handleQty(item.quantity - 1)}
            disabled={isLoading}
            className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-primary-100 hover:text-primary-600 flex items-center justify-center transition-all disabled:opacity-40"
          >
            {isLoading ? <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> : <FaMinus size={10} />}
          </button>
          <span className="font-bold text-surface-900 w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => handleQty(item.quantity + 1)}
            disabled={isLoading}
            className="w-9 h-9 rounded-xl bg-surface-100 hover:bg-primary-100 hover:text-primary-600 flex items-center justify-center transition-all disabled:opacity-40"
          >
            {isLoading ? <div className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /> : <FaPlus size={10} />}
          </button>
        </div>
      </div>

      {/* Price + Remove */}
      <div className="text-right shrink-0 flex flex-col items-end gap-4">
        <p className="text-2xl font-extrabold text-surface-900">${(productPrice * item.quantity).toFixed(2)}</p>
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-red-500 transition-colors disabled:opacity-40"
        >
          <FaTrash size={12} />
          <span>Remove</span>
        </button>
      </div>
    </motion.div>
  );
};

const Cart: React.FC = () => {
  const { state: cartState, removeFromCart, updateQuantity, loadCart } = useCart();
  const navigate = useNavigate();
  const shipping = 5.99;
  const tax = cartState.totalPrice * 0.08;
  const total = cartState.totalPrice + shipping + tax;

  useEffect(() => {
    loadCart();
    document.title = 'Shopping Cart — E-Shop';
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-surface-50 pt-10 pb-20">
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl font-display font-bold text-surface-900">
            Your <span className="text-gradient">Cart</span>
          </h1>
          <p className="text-surface-500 mt-2 text-lg">{cartState.items.length} item{cartState.items.length !== 1 ? 's' : ''} in your cart</p>
        </motion.div>

        {cartState.items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 glass-card rounded-[3rem]"
          >
            <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-primary-300 text-5xl">
              <FaShoppingBag />
            </div>
            <h2 className="text-3xl font-bold text-surface-900 mb-3">Your cart is empty</h2>
            <p className="text-surface-500 mb-10 text-lg max-w-sm mx-auto">Explore our premium collections and find something you love.</p>
            <Link to="/products" className="btn-premium-primary text-base !px-10 !py-4 inline-flex">
              Start Shopping <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] shadow-premium overflow-hidden border border-surface-100">
                <AnimatePresence>
                  {cartState.items.map((item: any, index: number) => (
                    <CartItem
                      key={typeof item.product === 'object' ? item.product._id : item._id}
                      item={item}
                      index={index}
                      removeFromCart={removeFromCart}
                      updateQuantity={updateQuantity}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <FaTruck />, text: 'Free shipping over $100' },
                  { icon: <FaShieldAlt />, text: '100% secure checkout' },
                  { icon: <FaArrowRight />, text: 'Easy 30-day returns' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 glass-card rounded-2xl text-sm font-medium text-surface-600">
                    <span className="text-primary-500">{f.icon}</span>
                    {f.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-[2.5rem] shadow-premium border border-surface-100 p-8 sticky top-28"
              >
                <h2 className="text-2xl font-bold text-surface-900 mb-8">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-surface-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-surface-900">${cartState.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-surface-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-surface-900">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-surface-600">
                    <span>Tax (8%)</span>
                    <span className="font-semibold text-surface-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-surface-100 pt-4 flex justify-between">
                    <span className="text-xl font-bold text-surface-900">Total</span>
                    <span className="text-xl font-extrabold text-primary-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-premium-primary w-full !py-4 text-base"
                >
                  Proceed to Checkout <FaArrowRight className="ml-2" />
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="btn-premium-outline w-full !py-4 text-base mt-4"
                >
                  Continue Shopping
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;