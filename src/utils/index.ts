import axios from "axios";

// Use proxy in development, full URL in production
const isDevelopment = import.meta.env.DEV;
const productionUrl = import.meta.env.VITE_API_URL;
const baseURL = isDevelopment ? '/api/v1' : productionUrl;

// const url = import.meta.env.VITE_API_URL;

export const customFetch = axios.create({
  baseURL: baseURL,
});

console.log('API Base URL:', baseURL);

customFetch.defaults.headers.common['Accept'] = 'application/json';
// Don't set Content-Type globally - let axios set it based on request data (JSON or FormData)
// customFetch.defaults.headers.common['Content-Type'] = 'application/json';

customFetch.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.token) {
          config.headers['Authorization'] = user.token;
          console.log('Interceptor: Added Authorization header via proxy');
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};