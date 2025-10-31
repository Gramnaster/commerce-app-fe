import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import { clearCart } from '../../features/cart/cartSlice';
import type { SocialProgramResponse, SocialProgram } from './Checkout';
import { NavLink } from 'react-router-dom';

interface CheckoutSummaryProps {
  userAddressId: number | null;
  onOrderComplete: () => void;
  SocialPrograms: SocialProgramResponse;
  selectedSP: number;
}

const CheckoutSummary = ({
  userAddressId,
  onOrderComplete,
  SocialPrograms,
  selectedSP
}: CheckoutSummaryProps) => {
  const dispatch = useDispatch();
  const { cartItems, cartTotal } = useSelector(
    (state: RootState) => state.cartState
  );
  console.log(`CheckoutSummary selectedSP`, selectedSP)
  const [selectedProgram, setSelectedProgram] = useState<number>( selectedSP || 0);
  const [programDescription, setProgramDescription] = useState('')
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const shipping = 85.11;
  const gst = cartTotal * 0.12;
  const donation = selectedProgram ? cartTotal * 0.08 : 0;
  const total = cartTotal + shipping + gst + donation;

  // Fetch user balance
  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      try {
        const response = await customFetch.get('/user_payment_methods/balance');
        setBalance(parseFloat(response.data.balance));
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        toast.error('Failed to load balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleCompletePayment = async () => {
    if (!userAddressId) {
      toast.error('Please save your address first');
      return;
    }

    if (balance < total) {
      toast.error('Insufficient balance');
      return;
    }

    setProcessingPayment(true);

    try {
      // Create user cart order
      await customFetch.post('/user_cart_orders', {
        user_cart_order: {
          user_address_id: userAddressId,
          social_program_id: selectedProgram || null
        },
      });

      toast.success('Order placed successfully!');
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      onOrderComplete();
    } catch (error: any) {
      console.error('Failed to complete payment:', error);
      toast.error(error.response?.data?.message || 'Failed to complete payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const hasEnoughBalance = balance >= total;

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-2xl font-bold mb-6 text-base-content">Order Summary</h2>

      {/* Item Total */}
      <div className="mb-4">
        <h3 className="font-semibold text-base-content mb-2">Item Total</h3>
        <div className="space-y-1">
          {cartItems.map((item: any) => (
            <div key={item.cartID} className="flex justify-between text-sm text-base-content">
              <span>
                - {item.title.substring(0, 30)}
                {item.title.length > 30 ? '...' : ''} ({item.amount}x)
              </span>
              <span>PHP {(item.price * item.amount).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold mt-2 pt-2 border-t text-base-content">
          <span>Subtotal</span>
          <span>PHP {cartTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="divider my-2"></div>

      {/* Additional Costs */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-base-content">
          <span>Shipping</span>
          <span>PHP {shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-base-content">
          <span>GST (12%)</span>
          <span>PHP {gst.toFixed(2)}</span>
        </div>
      </div>

      <div className="divider my-2"></div>

      {/* Social Program Donation */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-medium text-base-content">
            Social Program to Donate to
          </span>
        </label>
        <select
          className="select select-bordered select-sm text-base-content"
          value={selectedProgram || selectedSP }
          onChange={(e) => {           
            const id = Number(e.target.value);
            setSelectedProgram(id);
            const selected = SocialPrograms.data.find((p: SocialProgram) => p.id === id);
            setProgramDescription(selected ? selected.description : '');
          }}
        >
          {/* SocialPrograms.data.find((program: SocialProgram) => program.id === selectedSP
          ) */}
          <option value=''>
            Select a program (optional)
          </option>
          {SocialPrograms.data.map((program: SocialProgram) => {
            const { id, title } = program;
            return (
              <option key={id} value={id} >
                {title}
              </option>
          )})}
        </select>
        {selectedProgram ? (
          <div className="flex justify-between text-sm text-base-content mt-2">
            <div>About this program:</div>
            <div>{programDescription} <NavLink to={`/social_programs/${selectedProgram}`}>More about them here</NavLink></div>
          </div>
        ) : ''}
      </div>

      <div className="divider my-2"></div>

      {/* Total */}
      <div className="flex justify-between text-xl font-bold mb-4 text-base-content">
        <span>SUBTOTAL</span>
        <span className="text-error">PHP {total.toFixed(2)}</span>
      </div>

      {/* Balance Info */}
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-base-200 rounded-lg">
          <div className="flex justify-between text-base-content mb-2">
            <span className="font-semibold">Your Balance:</span>
            <span className="font-bold">PHP {balance.toFixed(2)}</span>
          </div>
          {!hasEnoughBalance && (
            <p className="text-error text-sm">
              Insufficient balance. You need PHP {(total - balance).toFixed(2)} more.
            </p>
          )}
        </div>
      )}

      {/* Complete Payment Button */}
      <button
        className="btn btn-error text-white btn-block mb-3"
        onClick={handleCompletePayment}
        disabled={!userAddressId || !hasEnoughBalance || processingPayment || loading}
      >
        {processingPayment ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          'Complete Payment'
        )}
      </button>

      {/* PayPal Checkout Button */}
      <button className="btn btn-outline btn-block" disabled>
        <img
          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
          alt="PayPal"
          className="h-5"
        />
        PayPal Checkout
      </button>

      {/* Payment Methods */}
      <div className="mt-4 text-center text-sm text-base-content/70">
        <p>We Accept:</p>
        <div className="flex justify-center gap-2 mt-2">
          <span className="badge badge-outline">VISA</span>
          <span className="badge badge-outline">Mastercard</span>
          <span className="badge badge-outline">AMEX</span>
        </div>
      </div>

      {/* Status Messages */}
      {!userAddressId && (
        <div className="alert alert-warning mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Please save your address to proceed</span>
        </div>
      )}
    </div>
  );
};

export default CheckoutSummary;
