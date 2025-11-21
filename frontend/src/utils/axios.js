import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API || '', // adjust
  withCredentials: true, // important if server sets HttpOnly cookies
});

// Optional: attach Authorization header if you store accessToken in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
