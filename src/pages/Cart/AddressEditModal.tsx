import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import type { UserAddress, AddressFormData } from './Checkout';

interface AddressEditModalProps {
  isOpen: boolean;
  userAddress: UserAddress | null;
  userId: number;
  onClose: () => void;
  onAddressUpdated: () => void;
}

const AddressEditModal = ({
  isOpen,
  userAddress,
  userId,
  onClose,
  onAddressUpdated,
}: AddressEditModalProps) => {
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
    country_id: '1',
  });

  // Populate form when userAddress changes
  useEffect(() => {
    if (userAddress) {
      const addr = userAddress.address;
      setFormData({
        unit_no: addr.unit_no || '',
        street_no: addr.street_no || '',
        address_line1: addr.address_line1 || '',
        address_line2: addr.address_line2 || '',
        city: addr.city || '',
        region: addr.region || '',
        barangay: addr.barangay || '',
        zipcode: addr.zipcode || '',
        country_id: addr.country_id?.toString() || '1',
      });
    }
  }, [userAddress]);

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
      // Update the address via user_addresses update
      await customFetch.patch(`/users/${userId}`, {
        user: {
          user_addresses_attributes: [
            {
              id: userAddress?.id, // Include the user_address ID to update existing
              is_default: userAddress?.is_default,
              address_attributes: {
                id: userAddress?.address.id, // Include address ID to update existing
                ...formData,
              },
            },
          ],
        },
      });

      toast.success('Address updated successfully');
      onAddressUpdated();
      onClose();
    } catch (error: any) {
      console.error('Failed to update address:', error);
      toast.error('Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !userAddress) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl bg-base-100 text-base-content">
        <h3 className="font-bold text-lg mb-4">Edit Address</h3>

        <form onSubmit={handleSubmit}>
          {/* Unit No & Street No */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Unit No</span>
              </label>
              <input
                type="text"
                name="unit_no"
                value={formData.unit_no}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Unit #123"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Street No</span>
              </label>
              <input
                type="text"
                name="street_no"
                value={formData.street_no}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="123"
                required
              />
            </div>
          </div>

          {/* Address Line 1 */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Street name, building name"
              required
            />
          </div>

          {/* Address Line 2 */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Apartment/Suite/Building (Optional)</span>
            </label>
            <input
              type="text"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Apt, suite, etc."
            />
          </div>

          {/* City */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">City</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Manila"
              required
            />
          </div>

          {/* Region & Barangay */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">State/Province (Optional)</span>
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Metro Manila"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Barangay</span>
              </label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="e.g. Barangay Uno Dos Tres"
              />
            </div>
          </div>

          {/* Zipcode */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Postal Code</span>
            </label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="1000"
              required
            />
          </div>

          {/* Country */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Country</span>
            </label>
            <select
              name="country_id"
              value={formData.country_id}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="1">Philippines</option>
              <option value="2">United States</option>
              <option value="3">United Kingdom</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default AddressEditModal;
