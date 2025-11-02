import { useState, useEffect } from 'react';
import type { UserAddress } from './Checkout';

interface ExistingAddressSelectorProps {
  userAddresses: UserAddress[];
  userName: string;
  userPhone: string;
  onAddressSelected: (addressId: number) => void;
  onEditAddress: (userAddress: UserAddress) => void;
  selectedAddressId: number | null;
}

const ExistingAddressSelector = ({
  userAddresses,
  userName,
  userPhone,
  onAddressSelected,
  onEditAddress,
  selectedAddressId,
}: ExistingAddressSelectorProps) => {
  const [localSelectedId, setLocalSelectedId] = useState<number | null>(selectedAddressId);

  // Pre-select default address on mount if none selected
  useEffect(() => {
    if (!localSelectedId && userAddresses.length > 0) {
      const defaultAddress = userAddresses.find((ua) => ua.is_default);
      if (defaultAddress) {
        setLocalSelectedId(defaultAddress.address.id);
        onAddressSelected(defaultAddress.address.id);
      }
    }
  }, [userAddresses, localSelectedId, onAddressSelected]);

  const handleSelect = (addressId: number) => {
    setLocalSelectedId(addressId);
    onAddressSelected(addressId);
  };

  const formatAddress = (userAddress: UserAddress) => {
    const addr = userAddress.address;
    const parts = [];
    
    if (addr.unit_no) parts.push(`Unit ${addr.unit_no}`);
    if (addr.street_no) parts.push(addr.street_no);
    if (addr.address_line1) parts.push(addr.address_line1);
    if (addr.address_line2) parts.push(addr.address_line2);
    
    const line1 = parts.join(', ');
    const line2Parts = [];
    
    if (addr.barangay) line2Parts.push(addr.barangay);
    if (addr.city) line2Parts.push(addr.city);
    if (addr.region) line2Parts.push(addr.region);
    if (addr.zipcode) line2Parts.push(addr.zipcode);
    
    const line2 = line2Parts.join(', ');
    
    return { line1, line2 };
  };

  if (userAddresses.length === 0) {
    return null;
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2 text-base-content">Select a delivery address</h2>
      <p className="text-sm text-base-content/70 mb-4">
        Delivery addresses ({userAddresses.length})
      </p>

      <div className="space-y-3">
        {userAddresses.map((userAddress) => {
          const { line1, line2 } = formatAddress(userAddress);
          const isSelected = localSelectedId === userAddress.address.id;

          return (
            <div
              key={userAddress.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-secondary bg-secondary/5'
                  : 'border-base-300 hover:border-base-400'
              }`}
              onClick={() => handleSelect(userAddress.address.id)}
            >
              <div className="flex items-start gap-3">
                {/* Radio Button */}
                <input
                  type="radio"
                  name="address-selection"
                  className="radio radio-secondary mt-1"
                  checked={isSelected}
                  onChange={() => handleSelect(userAddress.address.id)}
                />

                {/* Address Details */}
                <div className="flex-1">
                  <div className="font-bold text-base-content">
                    {userName}
                  </div>
                  <div className="text-sm text-base-content mt-1">
                    {line1}
                  </div>
                  {line2 && (
                    <div className="text-sm text-base-content">
                      {line2}
                    </div>
                  )}
                  <div className="text-sm text-base-content mt-1">
                    Phone number: {userPhone}
                  </div>
                  {userAddress.is_default && (
                    <div className="badge badge-secondary badge-sm mt-2">Default</div>
                  )}
                </div>

                {/* Edit Button */}
                <button
                  className="btn btn-ghost btn-sm text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditAddress(userAddress);
                  }}
                >
                  Edit address
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExistingAddressSelector;
