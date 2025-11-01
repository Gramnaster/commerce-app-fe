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

// Format date to Year/Month/Day
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// Generate consistent cartID from product data
// Must match format used in Cart.tsx: product.id + product.title
export const generateCartID = (productId: number | string, productTitle: string): string => {
  return String(productId) + productTitle;
};

// Sort products based on the selected sort option
export const sortProducts = <T extends { title: string; price: number; created_at: string }>(
  products: T[],
  sortBy: 'a-z' | 'z-a' | 'price-high' | 'price-low' | 'newest' | 'oldest'
): T[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'a-z':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'z-a':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    default:
      return sorted;
  }
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