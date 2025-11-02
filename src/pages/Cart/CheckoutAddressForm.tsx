import { useState } from 'react';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import { PhilippineAddressFields } from '../../components';
import type { AddressFormData } from './Checkout';

interface CheckoutAddressFormProps {
  onAddressSaved: (addressId: number) => void;
  onCancel: () => void;
  userEmail: string;
  userId: number;
}

const CheckoutAddressForm = ({ onAddressSaved, onCancel, userEmail, userId }: CheckoutAddressFormProps) => {
  const [loading, setLoading] = useState(false);
  const [saveAddress, setSaveAddress] = useState(true); // Save address by default
  const [formData, setFormData] = useState<AddressFormData>({
    unit_no: '',
    street_no: '',
    address_line1: '',
    address_line2: '',
    city: '',
    region: '',
    barangay: '',
    zipcode: '',
    country_id: '1', // Default to Philippines
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handler for Philippine address fields
  const handleAddressFieldChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (saveAddress) {
        // Save address to user's profile
        const response = await customFetch.patch(`/users/${userId}`, {
          user: {
            user_addresses_attributes: [
              {
                is_default: false, // Don't force as default
                address_attributes: formData,
              },
            ],
          },
        });

        toast.success('Address saved successfully');
        // Get the address ID from the response - note: we need address.id, not user_address.id
        const userAddresses = response.data.data.user_addresses;
        if (userAddresses && userAddresses.length > 0) {
          // Get the most recently added address
          const savedUserAddress = userAddresses[userAddresses.length - 1];
          const addressId = savedUserAddress.address.id; // This is the address table ID!
          onAddressSaved(addressId);
        } else {
          toast.error('Address was saved but ID not found');
        }
      } else {
        // Create a temporary address without saving to profile
        const response = await customFetch.post('/addresses', {
          address: formData,
        });

        toast.success('Address created for this order');
        const addressId = response.data.data.id;
        onAddressSaved(addressId);
      }
    } catch (error: any) {
      console.error('Failed to save address:', error);
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-base-content">Delivery</h2>

      <form onSubmit={handleSubmit}>
        {/* Customer Email */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-base-content">
            Customer
          </label>
          <p className="text-primary mt-1">{userEmail}</p>
        </div>

        <h3 className="text-lg font-bold mb-4 text-base-content">
          Shipping Address
        </h3>

        {/* Unit No & Street No */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Unit No</span>
            </label>
            <input
              type="text"
              name="unit_no"
              value={formData.unit_no}
              onChange={handleChange}
              className="input input-bordered w-full text-base-content"
              placeholder="Unit #123"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">Street No</span>
            </label>
            <input
              type="text"
              name="street_no"
              value={formData.street_no}
              onChange={handleChange}
              className="input input-bordered w-full text-base-content"
              placeholder="123"
              required
            />
          </div>
        </div>

        {/* Address Line 1 */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-base-content">Address</span>
          </label>
          <input
            type="text"
            name="address_line1"
            value={formData.address_line1}
            onChange={handleChange}
            className="input input-bordered w-full text-base-content"
            placeholder="Street name, building name"
            required
          />
        </div>

        {/* Address Line 2 */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-base-content">
              Apartment/Suite/Building (Optional)
            </span>
          </label>
          <input
            type="text"
            name="address_line2"
            value={formData.address_line2}
            onChange={handleChange}
            className="input input-bordered w-full text-base-content"
            placeholder="Apt, suite, etc."
          />
        </div>

        {/* Philippine Address Fields (Region, Province, City, Barangay) */}
        <PhilippineAddressFields
          onAddressChange={handleAddressFieldChange}
        />

        {/* Zipcode */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-base-content">Postal Code</span>
          </label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            className="input input-bordered w-full text-base-content"
            placeholder="1000"
            required
          />
        </div>

        {/* Save Address Checkbox */}
        <div className="form-control mb-6">
          <label className="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              className="checkbox checkbox-secondary"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
            />
            <span className="label-text text-base-content">
              Save this address to my profile for future orders
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            className="btn bg-neutral-500 text-[#ffffff] btn-block border-none shadow-none outline-none mb-2 flex-1"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-secondary flex-1"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Use This Address'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutAddressForm;
