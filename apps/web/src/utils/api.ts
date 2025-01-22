// src/utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://18.136.205.218:3000/v1/api/discounts',
});

// Tambahkan interceptor untuk menyertakan token jika ada
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
