import { useState } from 'react';
import type { CartItem } from './Cart';

interface CartTotalsProps {
  cartItems: CartItem[];
}

const CartTotals = ({ cartItems }: CartTotalsProps) => {
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.subtotal),
    0
  );
  const shipping = 85.11; // PHP shipping cost
  const gst = subtotal * 0.12; // 12% GST
  const donation = selectedProgram ? subtotal * 0.08 : 0; // 8% donation if program selected
  const total = subtotal + shipping + gst + donation;

  return (
    <div className="lg:col-span-1">
      <div className="card bg-base-100 shadow-md sticky top-4">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Order Summary:</h2>

          <div className="space-y-2 mb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
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
            <div className="flex justify-between">
              <span>Item Total</span>
              <span className="font-bold">PHP {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>PHP {shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>GST (12%)</span>
              <span>PHP {gst.toFixed(2)}</span>
            </div>
          </div>

          <div className="divider my-2"></div>

          {/* Social Program Donation */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Social Program to Donate to
              </span>
            </label>
            <select
              className="select select-bordered select-sm"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
            >
              <option value="">Select a program</option>
              <option value="education">Education Fund</option>
              <option value="health">Healthcare Initiative</option>
              <option value="environment">Environmental Program</option>
            </select>
          </div>

          {selectedProgram && (
            <div className="form-control mt-2">
              <label className="label">
                <span className="label-text text-sm">
                  Donation Amount (8%)
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={`PHP ${donation.toFixed(2)}`}
                readOnly
              />
            </div>
          )}

          <div className="divider my-2"></div>

          <div className="flex justify-between text-lg font-bold">
            <span>SUBTOTAL</span>
            <span className="text-primary">PHP {total.toFixed(2)}</span>
          </div>

          <button className="btn btn-primary btn-block mt-4">
            Proceed to Checkout
          </button>

          <button className="btn btn-outline btn-block mt-2">
            <img
              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
              alt="PayPal"
              className="h-5"
            />
            PayPal Checkout
          </button>

          <div className="mt-4 text-center text-sm text-base-content/70">
            <p>We Accept:</p>
            <div className="flex justify-center gap-2 mt-2">
              <span className="badge badge-outline">VISA</span>
              <span className="badge badge-outline">Mastercard</span>
              <span className="badge badge-outline">AMEX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTotals;
