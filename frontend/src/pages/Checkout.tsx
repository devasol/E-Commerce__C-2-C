import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { orderAPI, paymentAPI } from '../services/api';
import axios from 'axios';
import { FaMobileAlt, FaArrowRight, FaLock, FaShieldAlt } from 'react-icons/fa';

const Checkout: React.FC = () => {
  const { state: cartState, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const existingOrderId = searchParams.get('orderId');

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', address: '', city: '', state: '', zipCode: '', country: '', phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [existingOrder, setExistingOrder] = useState<any>(null);
  const [loadingExistingOrder, setLoadingExistingOrder] = useState(!!existingOrderId);
  const [orderLoading, setOrderLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState(false);

  const [telebirrStep, setTelebirrStep] = useState<'form' | 'initiated' | 'verifying' | 'verified'>('form');
  const [telebirrSession, setTelebirrSession] = useState<any>(null);
  const [telebirrPin, setTelebirrPin] = useState('');
  const [telebirrPhoneNumber, setTelebirrPhoneNumber] = useState('');
  const [telebirrBalance] = useState<number>(1000); 
  const [countdown, setCountdown] = useState<number>(300);

  useEffect(() => {
    document.title = 'Checkout — E-Shop';
    const saved = localStorage.getItem('shippingInfo');
    if (saved) setShippingInfo(JSON.parse(saved));

    if (existingOrderId) {
      orderAPI.getById(existingOrderId).then(res => {
        const order = res.data.data;
        setExistingOrder(order);
        setShippingInfo(order.shippingAddress);
        setPaymentMethod('telebirr');
        setLoadingExistingOrder(false);
      }).catch(err => {
        setErrorMessage('Could not load order details.');
        setLoadingExistingOrder(false);
      });
    }
  }, [existingOrderId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (telebirrStep === 'initiated' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setTelebirrStep('form');
            setTelebirrSession(null);
            setErrorMessage('Payment session expired.');
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [telebirrStep, countdown]);

  const validateForm = () => {
    const newErrors: any = {};
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Required';
    if (!shippingInfo.city.trim()) newErrors.city = 'Required';
    if (!shippingInfo.country.trim()) newErrors.country = 'Required';
    if (paymentMethod === 'telebirr' && !shippingInfo.phone.trim()) newErrors.phone = 'Required for TeleBirr';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setOrderLoading(true);

    try {
      if (existingOrderId && existingOrder) {
        const payRes = await paymentAPI.initiateTelebirrPayment(existingOrder.totalPrice, existingOrder._id, telebirrPhoneNumber || shippingInfo.phone);
        if (payRes.data.success) {
          setTelebirrSession(payRes.data.data);
          setTelebirrStep('initiated');
          setErrorMessage(null);
        } else {
          setErrorMessage(payRes.data.message || 'Payment initiation failed.');
        }
      } else {
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
        const itemsPrice = cartState.totalPrice;
        const taxPrice = parseFloat((itemsPrice * 0.08).toFixed(2));
        const shippingPrice = 5.99;
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        const orderData = {
          orderItems: cartState.items.map((item: any) => ({
            product: typeof item.product === 'object' ? item.product._id : item.product,
            name: typeof item.product === 'object' ? item.product.name : 'Product',
            quantity: item.quantity,
            price: item.price,
            image: typeof item.product === 'object' ? item.product.images?.[0] || '' : ''
          })),
          shippingAddress: shippingInfo,
          paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice
        };

        const orderRes = await orderAPI.create(orderData);
        const order = orderRes.data.data.order || orderRes.data.data;
        
        const payRes = await paymentAPI.initiateTelebirrPayment(order.totalPrice, order._id, telebirrPhoneNumber || shippingInfo.phone);
        if (payRes.data.success) {
          setTelebirrSession(payRes.data.data);
          setTelebirrStep('initiated');
          setErrorMessage(null);
        } else {
          setErrorMessage(payRes.data.message || 'Payment initiation failed.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to process order.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!telebirrPin || telebirrPin.length !== 4) { setErrorMessage('Enter valid 4-digit PIN'); return; }
    if (!telebirrSession) return;

    const orderTotal = existingOrder ? existingOrder.totalPrice : (cartState.totalPrice + 5.99 + (cartState.totalPrice * 0.08));
    if (telebirrBalance < orderTotal) {
      setErrorMessage(`Insufficient balance: $${telebirrBalance.toFixed(2)}`);
      return;
    }

    setOrderLoading(true);
    setTelebirrStep('verifying');

    try {
      const vRes = await paymentAPI.verifyTelebirrPayment(telebirrSession.sessionId, telebirrPin, telebirrSession.amount);
      if (vRes.data.success) {
        setTelebirrStep('verified');
        let fullUrl = null;
        if (vRes.data.data.downloadReceiptUrl) {
          try {
            setDownloadingReceipt(true);
            const base = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
            fullUrl = `${base}${vRes.data.data.downloadReceiptUrl}`;
            const res = await axios.get(fullUrl, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url; link.setAttribute('download', `receipt-${vRes.data.data.orderId}.pdf`);
            document.body.appendChild(link); link.click(); link.remove();
          } catch (e) {} finally { setDownloadingReceipt(false); }
        }
        await clearCart();
        setOrderSuccess({ orderId: vRes.data.data.orderId, message: 'Payment successful! Order confirmed.' });
        setErrorMessage(null);
      } else {
        setErrorMessage(vRes.data.message || 'Verification failed.');
        setTelebirrStep('initiated');
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Verification failed.');
      setTelebirrStep('initiated');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loadingExistingOrder) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-surface-400 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Checkout</p>
      </div>
    );
  }

  if (!existingOrderId && cartState.items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="text-center p-12 glass-card rounded-[3rem]">
          <h2 className="text-3xl font-display font-bold text-surface-900 mb-4">Your cart is empty</h2>
          <button onClick={() => navigate('/products')} className="btn-premium-primary">Start Shopping</button>
        </div>
      </div>
    );
  }

  const Input = ({ label, field, placeholder, type="text" }: any) => (
    <div>
      <label className="text-xs font-bold text-surface-600 uppercase tracking-widest mb-1.5 block">{label}</label>
      <input
        type={type}
        value={(shippingInfo as any)[field]}
        onChange={e => setShippingInfo({...shippingInfo, [field]: e.target.value})}
        className={`input-premium ${errors[field] ? '!border-red-500 ring-2 ring-red-100' : ''}`}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50 pt-10 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-4xl font-display font-bold text-surface-900 mb-10 text-center">Secure Checkout</h1>

        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="p-4 rounded-2xl mb-8 bg-red-50 border border-red-100 text-red-600 font-medium flex justify-center">
              {errorMessage}
            </motion.div>
          )}

          {orderSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-premium p-12 text-center border border-green-100">
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
              <h2 className="text-3xl font-display font-bold text-surface-900 mb-4">{orderSuccess.message}</h2>
              <p className="text-surface-500 mb-8 bg-surface-50 py-3 rounded-xl font-mono text-sm border border-surface-200">Order #{orderSuccess.orderId}</p>
              
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate(`/order/${orderSuccess.orderId}`)} className="btn-premium-primary w-full !py-4">View Order Details</button>
                <button onClick={() => navigate('/products')} className="btn-premium-outline w-full !py-4">Continue Shopping</button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column - Forms */}
              <div className="lg:col-span-7 space-y-8">
                {/* Shipping Panel */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-surface-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center">1</div>
                    <h2 className="text-2xl font-bold text-surface-900">Shipping Details</h2>
                  </div>

                  <form className="space-y-5">
                    <Input label="Full Name" field="fullName" placeholder="John Doe" />
                    <Input label="Street Address" field="address" placeholder="123 Main St" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="City" field="city" placeholder="New York" />
                      <Input label="State / Province" field="state" placeholder="NY" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="ZIP / Postal Code" field="zipCode" placeholder="10001" />
                      <Input label="Country" field="country" placeholder="United States" />
                    </div>
                    <Input label="Phone Number" field="phone" placeholder="+1234567890" type="tel" />
                  </form>
                </div>

                {/* Payment Panel */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-surface-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-surface-200 text-7xl opacity-30 pointer-events-none"><FaLock /></div>
                  
                  <div className="flex items-center gap-3 mb-8 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center">2</div>
                    <h2 className="text-2xl font-bold text-surface-900">Payment</h2>
                  </div>

                  <div className="mb-6 relative z-10">
                    <label className="flex items-center p-5 border-2 border-primary-500 bg-primary-50 rounded-2xl cursor-pointer shadow-sm">
                      <input type="radio" checked readOnly className="mr-4 w-5 h-5 text-primary-600 focus:ring-primary-500 border-surface-300" />
                      <div className="w-12 h-12 bg-white rounded-xl shadow flex items-center justify-center text-green-500 text-2xl mr-4"><FaMobileAlt /></div>
                      <div>
                        <span className="font-bold text-surface-900 block text-lg">TeleBirr Payment</span>
                        <span className="text-sm text-primary-600 font-medium">Quick & Secure mobile payment</span>
                      </div>
                    </label>
                  </div>

                  <AnimatePresence mode="wait">
                    {telebirrStep === 'initiated' ? (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-surface-50 p-6 rounded-2xl border border-surface-200">
                        <h3 className="font-bold text-surface-900 mb-2">Verification Required</h3>
                        <p className="text-sm text-surface-500 mb-4">Enter your 4-digit TeleBirr PIN to confirm ${telebirrSession?.amount?.toFixed(2) || '0.00'}</p>
                        
                        <div className="flex items-center gap-3">
                          <input type="password" maxLength={4} value={telebirrPin} onChange={e => setTelebirrPin(e.target.value.replace(/\D/g, ''))} className="input-premium w-32 text-center text-xl tracking-widest font-mono" placeholder="••••" />
                          <button onClick={handleVerify} disabled={orderLoading} className="btn-premium-primary !py-3 flex-1">{orderLoading ? 'Verifying...' : 'Confirm Payment'}</button>
                        </div>
                        <div className="mt-4 flex justify-between items-center text-sm font-bold">
                          <span className={`${countdown < 60 ? 'text-red-500 animate-pulse' : 'text-surface-400'}`}>0{Math.floor(countdown/60)}:{(countdown%60).toString().padStart(2,'0')}</span>
                          <button onClick={() => { setTelebirrStep('form'); setTelebirrSession(null); setTelebirrPin(''); }} className="text-primary-600 hover:underline">Cancel</button>
                        </div>
                      </motion.div>
                    ) : telebirrStep === 'verifying' ? (
                      <div className="bg-primary-50 p-6 rounded-2xl border border-primary-200 flex items-center justify-center gap-3 text-primary-700 font-bold">
                        <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /> Finalizing...
                      </div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column - Summary */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-premium border border-surface-100 sticky top-28">
                  <h2 className="text-xl font-bold text-surface-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {(existingOrder ? existingOrder.orderItems : cartState.items).map((item: any, i: number) => {
                      const img = existingOrder ? item.image : (typeof item.product === 'object' ? item.product.images?.[0] : null);
                      const name = existingOrder ? item.name : (typeof item.product === 'object' ? item.product.name : 'Item');
                      return (
                        <div key={i} className="flex gap-4 p-3 bg-surface-50 rounded-2xl border border-surface-100">
                          <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0">
                            <img src={img || 'https://via.placeholder.com/100'} alt={name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex flex-col justify-center flex-grow min-w-0">
                            <h3 className="font-bold text-surface-900 text-sm truncate">{name}</h3>
                            <p className="text-surface-500 text-xs">Qty: {item.quantity}</p>
                          </div>
                          <div className="flex items-center justify-end font-bold text-surface-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-surface-100 mb-8">
                    <div className="flex justify-between text-surface-500 font-medium">
                      <span>Subtotal</span>
                      <span className="text-surface-900">${(existingOrder ? existingOrder.itemsPrice : cartState.totalPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-surface-500 font-medium">
                      <span>Shipping</span>
                      <span className="text-surface-900">${(existingOrder ? existingOrder.shippingPrice : 5.99).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-surface-500 font-medium">
                      <span>Tax (8%)</span>
                      <span className="text-surface-900">${(existingOrder ? existingOrder.taxPrice : cartState.totalPrice * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-surface-100 mt-2 pt-4 flex justify-between font-bold text-xl text-surface-900">
                      <span>Total</span>
                      <span className="text-primary-600">${(existingOrder ? existingOrder.totalPrice : cartState.totalPrice * 1.08 + 5.99).toFixed(2)}</span>
                    </div>
                  </div>

                  {telebirrStep === 'form' && (
                    <button onClick={handleSubmit} disabled={orderLoading} className="btn-premium-primary w-full !py-4 shadow-xl shadow-primary-500/20">
                      {orderLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : (
                        <>Pay ${(existingOrder ? existingOrder.totalPrice : cartState.totalPrice * 1.08 + 5.99).toFixed(2)} <FaArrowRight className="ml-2" /></>
                      )}
                    </button>
                  )}
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-surface-400 text-xs font-medium">
                    <FaShieldAlt /> 256-bit secure checkout
                  </div>
                </div>
              </div>

            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;