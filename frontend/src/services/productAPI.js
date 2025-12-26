// services/productAPI.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

export const fetchAllProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const queryString = queryParams.toString();
    const url = queryString ? `${API_BASE_URL}/products?${queryString}` : `${API_BASE_URL}/products`;

    const headers = getAuthHeaders();
    const response = await fetch(url, {
      headers: headers
    });
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