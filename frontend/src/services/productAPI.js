// services/productAPI.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

<<<<<<< HEAD
// Get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const fetchProductById = async (id) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: headers
    });
=======
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
>>>>>>> 6281576513cf78cfbb928bd30123346a6cb2908d
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

<<<<<<< HEAD
export const fetchAllProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const queryString = queryParams.toString();
    const url = queryString ? `${API_BASE_URL}/products?${queryString}` : `${API_BASE_URL}/products`;

    const headers = getAuthHeaders();
    const response = await fetch(url, {
      headers: headers
    });
=======
export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
>>>>>>> 6281576513cf78cfbb928bd30123346a6cb2908d
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};