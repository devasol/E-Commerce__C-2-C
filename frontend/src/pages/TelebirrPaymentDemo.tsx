import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const TelebirrPaymentDemo = () => {
    const [seconds, setSeconds] = useState(5);
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending -> processing -> success
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();

    const query = new URLSearchParams(location.search);
    const orderId = query.get('orderId');
    const amount = query.get('amount');

    useEffect(() => {
        if (paymentStatus === 'success' && seconds > 0) {
            const timer = setTimeout(() => {
                setSeconds(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (paymentStatus === 'success' && seconds === 0) {
            navigate('/order-history');
        }
    }, [seconds, paymentStatus, navigate]);

    const handlePayment = () => {
        setPaymentStatus('processing');
        setTimeout(() => {
            setPaymentStatus('success');
            clearCart(); // Clear the cart after successful payment simulation
        }, 2000); // Simulate a 2-second payment processing time
    };

    return (
        <div className="container mx-auto p-8 flex justify-center items-center" style={{ minHeight: '70vh' }}>
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Telebirr Payment</h1>
                    <p className="text-gray-600 mt-2">Complete your payment securely.</p>
                </div>

                {paymentStatus === 'pending' && (
                    <div className="mt-8">
                        <div className="mb-4">
                            <p className="text-gray-700">Order ID: <span className="font-semibold">{orderId}</span></p>
                            <p className="text-gray-700">Amount: <span className="font-semibold">${parseFloat(amount || '0').toFixed(2)}</span></p>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="text" id="phone" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" defaultValue="+251" />
                        </div>
                        <button
                            onClick={handlePayment}
                            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                        >
                            Pay Now
                        </button>
                    </div>
                )}

                {paymentStatus === 'processing' && (
                    <div className="mt-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Processing payment...</p>
                    </div>
                )}

                {paymentStatus === 'success' && (
                    <div className="mt-8 text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-xl font-bold text-green-600 mt-4">Payment Successful!</h2>
                        <p className="text-gray-600 mt-2">
                            Redirecting you to your order history in {seconds} second{seconds !== 1 && 's'}...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TelebirrPaymentDemo;
