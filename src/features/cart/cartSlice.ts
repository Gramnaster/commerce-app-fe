import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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

const cartSlice = createSlice({
  name: 'cart',
  initialState: defaultState,
  reducers: {
    clearCart: () => {
      return defaultState;
    },
    calculateTotals: (state) => {
      state.tax = 0.12 * state.cartTotal;
      state.orderTotal = state.cartTotal + state.shipping + state.tax;
    },
    syncCart: (state, action: PayloadAction<{ items: CartItem[] }>) => {
      // Sync cart from backend because we're getting annooying out of sync issues
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


export const { clearCart, syncCart } = cartSlice.actions;

export default cartSlice.reducer;