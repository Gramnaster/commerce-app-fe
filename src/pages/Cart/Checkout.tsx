import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import CheckoutAddressForm from './CheckoutAddressForm';
import CheckoutSummary from './CheckoutSummary';

const Checkout = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userState.user);
  const { cartItems } = useSelector((state: RootState) => state.cartState);
  const [userAddressId, setUserAddressId] = useState<number | null>(null);

  const handleAddressSaved = (addressId: number) => {
    setUserAddressId(addressId);
  };

  const handleOrderComplete = () => {
    // Navigate to success page or home
    navigate('/');
  };

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="align-element py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-base-content">
            Please login to checkout
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Redirect if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="align-element py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-base-content">
            Your cart is empty
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="align-element py-8">
      <h1 className="text-3xl font-bold mb-8 text-base-content">SHOPPING CART</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Address Form (2/3) */}
        <div className="lg:col-span-2">
          <CheckoutAddressForm
            onAddressSaved={handleAddressSaved}
            userEmail={user.email || 'N/A'}
            userId={user.id}
          />

          {/* Billing Section Placeholder */}
          <div className="bg-base-100 rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-base-content">Billing</h2>
            <p className="text-base-content/70">
              Billing information will be the same as shipping address.
            </p>
          </div>

          {/* Payment Section Placeholder */}
          <div className="bg-base-100 rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-base-content">Payment</h2>
            <p className="text-base-content/70">
              Payment will be processed using your account balance.
            </p>
          </div>
        </div>

        {/* Right side - Order Summary (1/3) */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            userAddressId={userAddressId}
            onOrderComplete={handleOrderComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;