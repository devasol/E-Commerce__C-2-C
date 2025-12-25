import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData: { name: string; email: string; password: string; role?: string }) => 
    api.post('/auth/register', userData),
  
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  logout: () => 
    api.get('/auth/logout'),
  
  getMe: () => 
    api.get('/auth/me'),
  
  updateDetails: (userData: { name: string; email: string }) => 
    api.put('/auth/updatedetails', userData),
  
  updatePassword: (passwordData: { currentPassword: string; newPassword: string }) => 
    api.put('/auth/updatepassword', passwordData),
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgotpassword', { email }),
  
  resetPassword: (token: string, newPassword: string) => 
    api.put(`/auth/resetpassword/${token}`, { password: newPassword }),
};

// User API calls
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Product API calls
export const productAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (productData: any) => api.post('/products', productData),
  update: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  delete: (id: string) => api.delete(`/products/${id}`),
  getBySeller: (sellerId: string) => api.get(`/products/seller/${sellerId}`),
};

// Wishlist API calls
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
  addToWishlist: (productId: string) => api.post('/wishlist', { productId }),
  removeFromWishlist: (productId: string) => api.delete(`/wishlist/${productId}`),
  clearWishlist: () => api.delete('/wishlist'),
};

// Cart API calls
export const cartAPI = {
  get: () => api.get('/cart'),
  addToCart: (productId: string, quantity: number) => 
    api.post('/cart', { productId, quantity }),
  update: (productId: string, quantity: number) => 
    api.put('/cart', { productId, quantity }),
  removeFromCart: (productId: string) => 
    api.put(`/cart/item/${productId}`),
  clearCart: () => api.delete('/cart'),
};

// Order API calls
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (orderData: any) => api.post('/orders', orderData),
  update: (id: string, orderData: any) => api.put(`/orders/${id}`, orderData),
  delete: (id: string) => api.delete(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/myorders'),
};

// Admin API calls
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
};

// Payment API calls
export const paymentAPI = {
  processPayment: (amount: number, orderId: string) => 
    api.post('/payment/process', { amount, orderId }),
};

export default api;