import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils';
import { editItem, removeItem } from '../features/cart/cartSlice';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cartState);
  
  // Provide defaults if cart state is undefined or not initialized
  const cartItems = cartState?.cartItems || [];
  const numItemsInCart = cartState?.numItemsInCart || 0;
  const orderTotal = cartState?.orderTotal || 0;

  const handleUpdateQuantity = (cartID: string, newAmount: number) => {
    if (newAmount < 1) return;
    dispatch(editItem({ cartID, amount: newAmount }));
  };

  const handleRemoveItem = (cartID: string) => {
    dispatch(removeItem({ cartID }));
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
                {cartItems.map((item: any) => (
                  <div
                    key={item.cartID}
                    className="flex gap-3 p-3 bg-base-200 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-base-content line-clamp-1 mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-base-content/70">
                          {item.amount}x
                        </span>
                        <span className="font-bold text-sm text-base-content">
                          PHP {formatPrice(item.price * item.amount)}
                        </span>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="join join-horizontal">
                          <button
                            className="btn btn-xs join-item bg-neutral text-white"
                            onClick={() => handleUpdateQuantity(item.cartID, item.amount - 1)}
                            disabled={item.amount <= 1}
                          >
                            -
                          </button>
                          <div className="btn btn-xs join-item bg-base-100 text-base-content pointer-events-none">
                            {item.amount}x
                          </div>
                          <button
                            className="btn btn-xs join-item bg-neutral text-white"
                            onClick={() => handleUpdateQuantity(item.cartID, item.amount + 1)}
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          className="btn btn-xs btn-ghost text-error"
                          onClick={() => handleRemoveItem(item.cartID)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
