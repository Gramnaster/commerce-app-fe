import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

interface CartItem {
  cartID: string;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface CartState {
  cartItems: CartItem[];
  numItemsInCart: number;
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
}

const defaultState: CartState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 500,
  tax: 0,
  orderTotal: 0,
};

const getCartFromLocalStorage = (): CartState => {
  try {
    const cart = localStorage.getItem('cart');
    if (!cart) return defaultState;
    
    const parsed = JSON.parse(cart);
    // Ensure all required properties exist
    return {
      cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : [],
      numItemsInCart: parsed.numItemsInCart || 0,
      cartTotal: parsed.cartTotal || 0,
      shipping: parsed.shipping || 500,
      tax: parsed.tax || 0,
      orderTotal: parsed.orderTotal || 0,
    };
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    return defaultState;
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getCartFromLocalStorage(),
  reducers: {
    addItem: (state, action: PayloadAction<{ product: CartItem }>) => {
      const { product } = action.payload;
      
      // Ensure cartItems array exists
      if (!state.cartItems) {
        state.cartItems = [];
      }
      
      const item = state.cartItems.find((i: CartItem) => i.cartID === product.cartID);
      if (item) {
        item.amount += product.amount;
      } else {
        state.cartItems.push(product);
      }

      state.numItemsInCart += product.amount;
      state.cartTotal += product.price * product.amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.success('Item added to cart');
    },
    clearCart: () => {
      localStorage.setItem('cart', JSON.stringify(defaultState));
      return defaultState;
    },
    removeItem: (state, action: PayloadAction<{ cartID: string }>) => {
      const { cartID } = action.payload;
      
      // Ensure cartItems array exists
      if (!state.cartItems) {
        state.cartItems = [];
        return;
      }
      
      const product = state.cartItems.find((i: CartItem) => i.cartID === cartID);
      if (!product) return;
      
      state.cartItems = state.cartItems.filter((i: CartItem) => i.cartID !== cartID);
      state.numItemsInCart -= product.amount;
      state.cartTotal -= product.price * product.amount;
      cartSlice.caseReducers.calculateTotals(state);
      toast.error('Item removed from cart');
    },
    editItem: (state, action: PayloadAction<{ cartID: string; amount: number }>) => {
      const { cartID, amount } = action.payload;
      
      // Ensure cartItems array exists
      if (!state.cartItems) {
        state.cartItems = [];
        return;
      }
      
      const item = state.cartItems.find((i: CartItem) => i.cartID === cartID);
      if (!item) return;
      
      state.numItemsInCart += amount - item.amount;
      state.cartTotal += item.price * (amount - item.amount);
      item.amount = amount;
      cartSlice.caseReducers.calculateTotals(state);
    },
    calculateTotals: (state) => {
      state.tax = 0.1 * state.cartTotal;
      state.orderTotal = state.cartTotal + state.shipping + state.tax;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    syncCart: (state, action: PayloadAction<{ items: CartItem[] }>) => {
      // Sync cart from backend without toast notifications
      const { items = [] } = action.payload;
      
      // Ensure items is always an array
      const validItems = Array.isArray(items) ? items : [];
      
      state.cartItems = validItems;
      state.numItemsInCart = validItems.reduce((sum, item) => sum + (item.amount || 0), 0);
      state.cartTotal = validItems.reduce((sum, item) => sum + ((item.price || 0) * (item.amount || 0)), 0);
      cartSlice.caseReducers.calculateTotals(state);
    },
  },
});

export const { addItem, clearCart, removeItem, editItem, syncCart } = cartSlice.actions;

export default cartSlice.reducer;
