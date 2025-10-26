import { useState, useEffect } from 'react';
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

  // Update quantity in backend and local state
  const updateQuantity = async (cartItemId: number, newQty: number) => {
    if (newQty < 1) return;

    try {
      await customFetch.patch(`/shopping_cart_items/${cartItemId}`, {
        shopping_cart_item: {
          qty: newQty,
        },
      });

      // Update local state
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                qty: newQty.toString(),
                subtotal: (
                  parseFloat(item.product.price) * newQty
                ).toString(),
              }
            : item
        )
      );

      // Update Redux store
      const cartItem = cartItems.find((item) => item.id === cartItemId);
      if (cartItem) {
        dispatch(
          editItem({
            cartID: cartItem.product.id + cartItem.product.title,
            amount: newQty,
          })
        );
      }

      toast.success('Cart updated');
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update cart');
    }
  };

  // Remove item from backend and local state
  const removeCartItem = async (cartItemId: number) => {
    try {
      await customFetch.delete(`/shopping_cart_items/${cartItemId}`);

      // Update local state
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

      // Update Redux store
      const cartItem = cartItems.find((item) => item.id === cartItemId);
      if (cartItem) {
        dispatch(
          removeItemFromRedux({
            cartID: cartItem.product.id + cartItem.product.title,
          })
        );
      }

      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">SHOPPING CART</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-base-content/70 mb-4">
            Add some items to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CartItemsList
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemove={removeCartItem}
          />
          <CartTotals cartItems={cartItems} />
        </div>
      )}
    </div>
  );
};

export default Cart;