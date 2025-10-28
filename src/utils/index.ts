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