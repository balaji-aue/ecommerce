import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000' });

export const setAuthToken = (token) => {
  if (token) API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete API.defaults.headers.common['Authorization'];
};

export const login = (credentials) => API.post('/auth/login', credentials);
export const register = (data) => API.post('/auth/register', data);
export const me = () => API.get('/auth/me');
export const updateMe = (data) => API.put('/auth/me', data);

export const fetchProducts = (params) => API.get('/products', { params });
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const createPaymentIntent = (amount) => API.post('/orders/create-payment-intent', { amount });

// Cart persistence APIs
export const getCart = () => API.get('/carts/me');
export const setCart = (items) => API.put('/carts/me', { items });
export const clearCart = () => API.delete('/carts/me');

export default API;
