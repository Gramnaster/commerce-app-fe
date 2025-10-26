import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const cartState = useSelector((state: RootState) => state.cartState);
  
  // Provide defaults if cart state is undefined or not initialized
  const cartItems = cartState?.cartItems || [];
  const numItemsInCart = cartState?.numItemsInCart || 0;
  const orderTotal = cartState?.orderTotal || 0;

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
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div
                    key={item.cartID}
                    className="flex gap-4 p-4 bg-base-200 rounded-lg"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-base-content line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-base-content/70">
                          {item.amount}x
                        </span>
                        <span className="font-bold text-base-content">
                          PHP {formatPrice(item.price * item.amount)}
                        </span>
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
                <p className="text-xl font-bold text-primary">
                  PHP {formatPrice(orderTotal)}
                </p>
              </div>
            </div>

            <Link
              to="/cart"
              className="btn btn-secondary btn-block"
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
