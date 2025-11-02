import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import { clearCart } from '../../features/cart/cartSlice';
import type { SocialProgramResponse, SocialProgram } from './Checkout';
import { NavLink } from 'react-router-dom';
import { cardVisa, cardMastercard, cardAmex } from '../../assets/images';

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

  const shipping = cartTotal >= 1000 ? 0 : 85.11; // Free shipping over 1000 PHP
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
    <div className="bg-base-100 border-l border-[#808080] rounded-none p-6 sticky">
      <h2 className="text-xl font-bold mb-4 text-base-content">Order Summary</h2>

      {/* Item Total */}
      <div className="mb-4 space-y-2">
        {cartItems.map((item: any) => (
          <div key={item.cartID} className="flex justify-between text-sm text-base-content">
            <span>
              - {item.title.substring(0, 20)}
              {item.title.length > 20 ? '...' : ''} ({item.amount}x)
            </span>
            <span>PHP {(item.price * item.amount).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="divider my-2"></div>

      <div className="space-y-2">
        <div className="flex justify-between text-base-content">
          <span>Item Total</span>
          <span className="font-bold">PHP {cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-base-content">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-base-content font-semibold">FREE</span>
            ) : (
              `PHP ${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        {cartTotal < 1000 && cartTotal > 0 && (
          <div className="text-xs text-base-content/70 italic">
            Add PHP {(1000 - cartTotal).toFixed(2)} more for free shipping
          </div>
        )}
        <div className="flex justify-between text-sm text-base-content">
          <span>GST (12%)</span>
          <span>PHP {gst.toFixed(2)}</span>
        </div>
      </div>

      <div className="divider my-2"></div>

      {/* Social Program Donation */}
      <div className="form-control">
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
          <div className="flex flex-col justify-between text-sm text-base-content mt-2">
            {/* <div>About this program:</div> */}
            <div>
              {programDescription}{' '}
            </div>
            <NavLink to={`/social_programs/${selectedProgram}`} className="text-right underline">
              Read More
            </NavLink>
          </div>
        ) : ''}
      </div>

      <div className="divider my-2"></div>

      {/* Total */}
      <div className="flex justify-between text-lg font-bold text-base-content">
        <span>SUBTOTAL</span>
        <span className="text-primary">PHP {total.toFixed(2)}</span>
      </div>

      {/* Balance Info */}
      {loading ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm"></span>
        </div>
      ) : (
        <div className="mt-4 rounded-lg max-h-[40px]">
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

      {/* Status Messages */}
      {!userAddressId && (
        <div className="alert alert-warning mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Please save your address to proceed</span>
        </div>
      )}

      {/* Complete Payment Button */}
      <button
        className="btn btn-secondary btn-block mt-4 font-secondary"
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
      <button className="btn btn-accent btn-block mt-2 gap-0 font-secondary" disabled>
        <span className="font-black italic text-[#003087] text-center">
          Pay
        </span>
        <span className="font-black italic text-[#009CDE]">Pal </span>
        <span className="text-black font-bold">&nbsp; {'Checkout'}</span>
      </button>

      {/* Payment Methods */}
      <div className="mt-4 text-left text-sm text-base-content">
        <p>We Accept:</p>
        <div className="flex justify-center gap-2 mt-2">
          <img src={cardVisa} alt="VISA" className="h-8" />
          <img src={cardMastercard} alt="Mastercard" className="h-8" />
          <img src={cardAmex} alt="AMEX" className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
