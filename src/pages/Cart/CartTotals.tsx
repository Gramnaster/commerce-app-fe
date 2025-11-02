import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { CartItem } from './Cart';
import { socialPrograms } from '../../assets/data/socialPrograms';
import type { SocialProgram, SocialProgramResponse } from './Checkout';
import { cardVisa, cardMastercard, cardAmex } from '../../assets/images';

interface CartTotalsProps {
  cartItems: CartItem[];
  setSocialProgram: React.Dispatch<React.SetStateAction<number>>;
  SocialPrograms: SocialProgramResponse;
  SocialProgramValue: number;
}

const CartTotals = ({
  cartItems,
  setSocialProgram,
  SocialPrograms,
  SocialProgramValue,
}: CartTotalsProps) => {
  const navigate = useNavigate();
  const [programDescription, setProgramDescription] = useState('');
  // const [selectedProgram, setSelectedProgram] = useState<string>('');

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.subtotal),
    0
  );
  const shipping = subtotal >= 1000 ? 0 : 85.11; // Free shipping over 1000 PHP
  const gst = subtotal * 0.12; // 12% GST
  const donation = SocialProgramValue !== 0 ? subtotal * 0.08 : 0; // 8% donation if program selected
  const total = subtotal + shipping + gst + donation;

  return (
    <div className="lg:col-span-1">
      <div className="card bg-base-100 border-l border-[#808080] sticky rounded-none">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4 text-base-content">
            Order Summary:
          </h2>

          <div className="space-y-2 mb-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-base-content"
              >
                <span>
                  - {item.product.title.substring(0, 20)}
                  {item.product.title.length > 20 ? '...' : ''} ({item.qty}x)
                </span>
                <span>PHP {parseFloat(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="divider my-2"></div>

          <div className="space-y-2">
            <div className="flex justify-between text-base-content">
              <span>Item Total</span>
              <span className="font-bold">PHP {subtotal.toFixed(2)}</span>
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
            {subtotal < 1000 && subtotal > 0 && (
              <div className="text-xs text-base-content/70 italic">
                Add PHP {(1000 - subtotal).toFixed(2)} more for free shipping
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
              value={SocialProgramValue}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSocialProgram(id);
                const selected = SocialPrograms.data.find(
                  (p: SocialProgram) => p.id === id
                );
                setProgramDescription(selected ? selected.description : '');
              }}
            >
              <option value="">Select a program</option>
              {SocialPrograms.data.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>
          {SocialProgramValue ? (
            <div className="flex flex-col justify-between text-sm text-base-content mt-2">
              <div>About this program:</div>
              <div>
                {programDescription}{' '}
                <NavLink to={`/social_programs/${SocialProgramValue}`}>
                  More about them here
                </NavLink>
              </div>
            </div>
          ) : (
            ''
          )}

          <div className="divider my-2"></div>

          <div className="flex justify-between text-lg font-bold text-base-content">
            <span>SUBTOTAL</span>
            <span className="text-primary">PHP {total.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-secondary btn-block mt-4 font-secondary"
            onClick={() =>
              navigate('/checkout', {
                state: { sp_id: SocialProgramValue },
              })
            }
          >
            Proceed to Checkout
          </button>

          <button className="btn btn-accent btn-block mt-2  gap-0  font-secondary">
            {/* <img
              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
              alt="PayPal"
              className="h-5"
            /> */}
            <span className="font-black italic text-[#003087] text-center">
              Pay
            </span>
            <span className="font-black italic text-[#009CDE]">Pal </span>
            <span className="text-black font-bold">&nbsp; {'Checkout'}</span>
          </button>

          <div className="mt-4 text-left text-sm text-base-content">
            <p>We Accept:</p>
            <div className="flex justify-center gap-2 mt-2">
              <img src={cardVisa} alt="VISA" className="h-8" />
              <img src={cardMastercard} alt="Mastercard" className="h-8" />
              <img src={cardAmex} alt="AMEX" className="h-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTotals;
