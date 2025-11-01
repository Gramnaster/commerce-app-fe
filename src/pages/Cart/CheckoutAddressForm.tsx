import { useState } from 'react';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';

export interface AddressFormData {
  unit_no: string;
  street_no: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  barangay: string;
  zipcode: string;
  country_id: string;
}

interface CheckoutAddressFormProps {
  onAddressSaved: (addressId: number) => void;
  userEmail: string;
  userId: number;
}

const CheckoutAddressForm = ({ onAddressSaved, userEmail, userId }: CheckoutAddressFormProps) => {
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await customFetch.patch(`/users/${userId}`, {
        user: {
          user_addresses_attributes: [
            {
              is_default: true,
              address_attributes: formData,
            },
          ],
        },
      });

      toast.success('Address saved successfully');
      // Get the address ID from the user_addresses array
      const userAddresses = response.data.data.user_addresses;
      if (userAddresses && userAddresses.length > 0) {
        // Get the most recently added address (last in array) or the default one
        const savedAddress = userAddresses[userAddresses.length - 1];
        onAddressSaved(savedAddress.id);
      } else {
        toast.error('Address was saved but ID not found');
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

        {/* City */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text text-base-content">City</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="input input-bordered w-full text-base-content"
            placeholder="Manila"
            required
          />
        </div>

        {/* Region */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-base-content">
                State/Province (Optional)
              </span>
            </label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="input input-bordered w-full text-base-content"
              placeholder="Metro Manila"
            />
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-base-content">Barangay</span>
              </label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                className="input input-bordered w-full text-base-content"
                placeholder="e.g. Barangay Uno Dos Tres"
              />
            </div>
          </div>

          {/* Zipcode */}
          <div className="form-control">
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
        </div>

        {/* Country */}
        <div className="form-control mb-6">
          <label className="label">
            <span className="label-text text-base-content">Country</span>
          </label>
          <select
            name="country_id"
            value={formData.country_id}
            onChange={handleChange}
            className="select select-bordered w-full text-base-content"
            required
          >
            <option value="1">Philippines</option>
            <option value="2">United States</option>
            <option value="3">United Kingdom</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-neutral text-white w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Save Address'
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutAddressForm;
