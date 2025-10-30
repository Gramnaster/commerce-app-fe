import axios from "axios";

// Always use direct URL - Vite proxy doesn't work well with HTTPS (ngrok)
// Browser can handle HTTPS directly, and CORS is already configured
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// const url = import.meta.env.VITE_API_URL;

export const customFetch = axios.create({
  baseURL: baseURL,
});

console.log('API Base URL:', baseURL);

customFetch.defaults.headers.common['Accept'] = 'application/json';
customFetch.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
// Don't set Content-Type globally - let axios set it based on request data (JSON or FormData)
// customFetch.defaults.headers.common['Content-Type'] = 'application/json';

customFetch.interceptors.request.use(
  (config) => {
    console.log(`REQUEST: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.token) {
          config.headers['Authorization'] = user.token;
          console.log('Interceptor: Added Authorization header');
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    console.error('REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log all responses
customFetch.interceptors.response.use(
  (response) => {
    console.log(`RESPONSE: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error(`RESPONSE ERROR: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Generate consistent cartID from product data
// Must match format used in Cart.tsx: product.id + product.title
export const generateCartID = (productId: number | string, productTitle: string): string => {
  return String(productId) + productTitle;
};

// Sync Redux cart state with backend cart items
export const syncCartWithBackend = async (dispatch: any) => {
  try {
    const response = await customFetch.get('/shopping_cart_items');
    const items = response.data?.data || [];
    
    // Import actions at top level for better performance
    const { clearCart, syncCart } = await import('../features/cart/cartSlice');
    
    // If no items in backend, clear the cart
    if (!items.length) {
      dispatch(clearCart());
      return { success: true, itemCount: 0 };
    }
    
    // Transform backend items to match Redux CartItem shape
    const cartItems = items.map((item: any) => {
      const product = item.product || {};
      return {
        cartID: generateCartID(product.id || '', product.title || ''),
        title: product.title || 'Unknown Product',
        price: parseFloat(product.price) || 0,
        image: product.product_image_url || '',
        amount: parseInt(item.qty, 10) || 1,
      };
    });
    
    // Update cart state without toast notifications
    dispatch(syncCart({ items: cartItems }));
    
    return { success: true, itemCount: cartItems.length };
  } catch (error) {
    console.error('Failed to sync cart:', error);
    // Don't throw - fail silently to avoid disrupting user experience
    return { success: false, itemCount: 0 };
  }
};