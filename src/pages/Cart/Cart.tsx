import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import {
  editItem,
  removeItem as removeItemFromRedux,
} from '../../features/cart/cartSlice';
import CartItemsList from './CartItemsList';
import CartTotals from './CartTotals';

export interface Product {
  id: number;
  title: string;
  price: string;
  product_image_url: string;
}

export interface CartItem {
  id: number;
  qty: string;
  subtotal: string;
  product: Product;
  created_at: string;
  updated_at: string;
}

const Cart = () => {
  const user = useSelector((state: RootState) => state.userState.user);
  const dispatch = useDispatch();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const updateTimeoutRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      updateTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
      updateTimeoutRef.current.clear();
    };
  }, []);

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await customFetch.get('/shopping_cart_items');
      console.log('Cart response:', response.data);
      setCartItems(response.data.data || []);
    } catch (error: any) {
      console.error('Failed to fetch cart items:', error);
      toast.error('Failed to load cart items');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  // Debounced backend update
  const updateBackend = useCallback(
    async (cartItemId: number, newQty: number) => {
      try {
        await customFetch.patch(`/shopping_cart_items/${cartItemId}`, {
          shopping_cart_item: {
            qty: newQty,
          },
        });

        // Update Redux store
        setCartItems((currentItems) => {
          const cartItem = currentItems.find((item) => item.id === cartItemId);
          if (cartItem) {
            dispatch(
              editItem({
                cartID: cartItem.product.id + cartItem.product.title,
                amount: newQty,
              })
            );
          }
          return currentItems;
        });

        toast.success('Cart updated');
      } catch (error: any) {
        console.error('Failed to update quantity:', error);
        
        // Handle specific error cases
        if (error.response?.status === 502) {
          toast.error('Server is temporarily unavailable. Please try again.');
        } else if (error.response?.status === 404) {
          // Item was deleted, refresh cart
          toast.error('Item no longer exists');
          fetchCartItems();
        } else {
          toast.error('Failed to update cart');
          // Revert on error
          fetchCartItems();
        }
      }
    },
    [dispatch]
  );

  // Updates quantity with debouncing
  const updateQuantity = useCallback(
    (cartItemId: number, newQty: number) => {
      if (newQty < 1) return;

      // Update local state immediately for responsive UI
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                qty: newQty.toString(),
                subtotal: (parseFloat(item.product.price) * newQty).toString(),
              }
            : item
        )
      );

      // Clear existing timeout for this item
      const existingTimeout = updateTimeoutRef.current.get(cartItemId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set new timeout to update backend after 800ms of no changes
      const timeoutId = setTimeout(() => {
        updateBackend(cartItemId, newQty);
        updateTimeoutRef.current.delete(cartItemId);
      }, 800);

      updateTimeoutRef.current.set(cartItemId, timeoutId);
    },
    [updateBackend]
  );

  // Remove item from backend and local state
  const removeCartItem = useCallback(async (cartItemId: number) => {
    // Cancel any pending updates for this item
    const existingTimeout = updateTimeoutRef.current.get(cartItemId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      updateTimeoutRef.current.delete(cartItemId);
    }

    // Store item info before removing (for Redux and potential rollback)
    let removedItem: CartItem | undefined;
    setCartItems((prev) => {
      removedItem = prev.find((item) => item.id === cartItemId);
      return prev;
    });

    if (!removedItem) return;

    // Optimistically update UI with standard filtering
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

    // Update Redux store
    dispatch(
      removeItemFromRedux({
        cartID: removedItem.product.id + removedItem.product.title,
      })
    );

    try {
      await customFetch.delete(`/shopping_cart_items/${cartItemId}`);
      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Failed to remove item:', error);
      
      // Because little shit keeps crashing otherwise and we don't know why
      if (error.response?.status === 502) {
        toast.error('Server is temporarily unavailable. Reloading cart...');
      } else {
        toast.error('Failed to remove item');
      }
      
      // Reload cart to sync with backend
      fetchCartItems();
    }
  }, [dispatch]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-base-content">
            Please login to view your cart
          </h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="align-element py-8">
      <h1 className="text-3xl font-bold mb-8 text-base-content">
        SHOPPING CART
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {cartItems.length === 0 ? (
          <div className="lg:col-span-2">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4 text-base-content">
                Your cart is empty
              </h2>
              <p className="text-base-content/70 mb-4">
                Add some items to get started!
              </p>
            </div>
          </div>
        ) : (
          <CartItemsList
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemove={removeCartItem}
          />
        )}
        
        <CartTotals cartItems={cartItems} />
      </div>
    </div>
  );
};export default Cart;
