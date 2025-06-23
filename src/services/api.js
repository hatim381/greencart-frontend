import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const auth = {
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_URL}/auth/login`, data),
};

export const products = {
  getAll: () => axios.get(`${API_URL}/products/`),
  add: (data) => axios.post(`${API_URL}/products/`, data),
  update: (id, data) => axios.put(`${API_URL}/products/${id}`, data),
};

export const orders = {
  create: (data) => axios.post(`${API_URL}/orders`, data),
  getByUser: (userId) => axios.get(`${API_URL}/orders/${userId}`),
};

export const ai = {
  getRecommendations: () => axios.get(`${API_URL}/ai/recommendations`),
};

export const testimonials = {
  getAll: () => axios.get(`${API_URL}/testimonials`),
};

export const newsletter = {
  subscribe: (email) => axios.post(`${API_URL}/newsletter/subscribe`, { email }),
};
