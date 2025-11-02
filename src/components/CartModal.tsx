import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { Link } from 'react-router-dom';
import { formatPrice, syncCartWithBackend, customFetch } from '../utils';
import { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userState.user);
  const cartState = useSelector((state: RootState) => state.cartState);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [localQuantities, setLocalQuantities] = useState<Map<string, number>>(new Map());
  const updateTimeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  
  // Track last synced user ID to prevent duplicate syncs
  const lastSyncedUserIdRef = useRef<number | null>(null);
  
  // Provide defaults if cart state is undefined or not initialized
  const cartItems = cartState?.cartItems || [];
  const numItemsInCart = cartState?.numItemsInCart || 0;
  const orderTotal = cartState?.orderTotal || 0;

  // Sync cart with backend when user changes (login/switch user)
  useEffect(() => {
    const currentUserId = user?.id;
    
    // Sync only if user exists and is different from last synced user
    if (currentUserId && currentUserId !== lastSyncedUserIdRef.current) {
      syncCartWithBackend(dispatch);
      lastSyncedUserIdRef.current = currentUserId;
    }
    
    // Clear tracking when user logs out
    if (!currentUserId) {
      lastSyncedUserIdRef.current = null;
    }
  }, [user?.id, dispatch]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      updateTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
      updateTimeoutRef.current.clear();
    };
  }, []);

  // Backend update function
  const updateBackend = useCallback(async (cartID: string, productId: number, newAmount: number) => {
    setUpdatingItems(prev => new Set(prev).add(cartID));
    
    try {
      // Find the backend cart item ID
      const response = await customFetch.get('/shopping_cart_items');
      const backendItems = response.data?.data || [];
      const backendItem = backendItems.find((item: any) => item.product.id === productId);
      
      if (backendItem) {
        await customFetch.patch(`/shopping_cart_items/${backendItem.id}`, {
          shopping_cart_item: {
            qty: newAmount,
          },
        });
        
        // Sync cart from backend to get fresh data
        await syncCartWithBackend(dispatch);
      }
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      // Always clear updating state (re-enable buttons)
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartID);
        return newSet;
      });
      // Always clear local quantity (sync completed or failed)
      setLocalQuantities(prev => {
        const newMap = new Map(prev);
        newMap.delete(cartID);
        return newMap;
      });
    }
  }, [dispatch]);

  // Debounced quantity update so we only send one request to the backend with pooled quantity updates
  // Because I don't wanna be rate-limited by my own creations
  // It's like being kicked out of your house by your kids
  const handleUpdateQuantity = useCallback((cartID: string, productId: number, newAmount: number) => {
    if (newAmount < 1) return;
    
    // Update local quantity immediately for responsive UI
    setLocalQuantities(prev => new Map(prev).set(cartID, newAmount));
    
    // Clear existing timeout for this item
    const existingTimeout = updateTimeoutRef.current.get(cartID);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Set new timeout to update backend after 1500ms of no changes
    const timeoutId = setTimeout(() => {
      updateBackend(cartID, productId, newAmount);
      updateTimeoutRef.current.delete(cartID);
    }, 1500);
    
    updateTimeoutRef.current.set(cartID, timeoutId);
  }, [updateBackend]);

  const handleRemoveItem = async (cartID: string, productId: number) => {
    // Cancel any pending updates for this item
    const existingTimeout = updateTimeoutRef.current.get(cartID);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      updateTimeoutRef.current.delete(cartID);
    }
    
    // Clear local quantity
    setLocalQuantities(prev => {
      const newMap = new Map(prev);
      newMap.delete(cartID);
      return newMap;
    });
    
    setUpdatingItems(prev => new Set(prev).add(cartID));
    
    try {
      // Find the backend cart item ID
      const response = await customFetch.get('/shopping_cart_items');
      const backendItems = response.data?.data || [];
      const backendItem = backendItems.find((item: any) => item.product.id === productId);
      
      if (backendItem) {
        await customFetch.delete(`/shopping_cart_items/${backendItem.id}`);
        
        // Sync cart from backend to get fresh data
        await syncCartWithBackend(dispatch);
        toast.success('Item removed from cart');
      }
    } catch (error: any) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartID);
        return newSet;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed top-20 right-4 md:right-10 z-50 w-[95%] max-w-[400px] bg-base-100 rounded-lg shadow-2xl max-h-[85vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-base-300">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-base-content">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm btn-circle"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/70">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item: any) => {
                  const isUpdating = updatingItems.has(item.cartID);
                  // Extract productId from cartID (format: "productId + title")
                  const productId = parseInt(item.cartID);
                  // Use local quantity if available, otherwise use item amount
                  const displayQuantity = localQuantities.get(item.cartID) ?? item.amount;
                  
                  return (
                    <div
                      key={item.cartID}
                      className={`flex gap-3 p-3 bg-base-200 rounded-lg ${isUpdating ? 'opacity-50' : ''}`}
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-400 flex items-center justify-center rounded">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain rounded"
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">No Image</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-base-content line-clamp-1 mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-base-content/70">
                            {displayQuantity}x
                          </span>
                          <span className="font-bold text-sm text-base-content">
                            PHP {formatPrice(item.price * displayQuantity)}
                          </span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="join join-horizontal">
                            <button
                              className="btn btn-xs join-item bg-neutral text-white"
                              onClick={() => handleUpdateQuantity(item.cartID, productId, displayQuantity - 1)}
                              disabled={displayQuantity <= 1 || isUpdating}
                            >
                              -
                            </button>
                            <div className="btn btn-xs join-item bg-base-100 text-base-content pointer-events-none">
                              {displayQuantity}x
                            </div>
                            <button
                              className="btn btn-xs join-item bg-neutral text-white"
                              onClick={() => handleUpdateQuantity(item.cartID, productId, displayQuantity + 1)}
                              disabled={isUpdating}
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            className="btn btn-xs btn-ghost text-error"
                            onClick={() => handleRemoveItem(item.cartID, productId)}
                            disabled={isUpdating}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-base-300 bg-base-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-base-content">Total</span>
              <div className="text-right">
                <p className="text-sm text-base-content/70">
                  Items: {numItemsInCart}x
                </p>
                <p className="text-xl font-bold text-error">
                  PHP {formatPrice(orderTotal)}
                </p>
              </div>
            </div>

            <Link
              to="/cart"
              className="btn btn-error text-white btn-block"
              onClick={onClose}
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;
