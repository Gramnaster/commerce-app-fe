import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLoaderData, useLocation, useNavigate, useRevalidator } from 'react-router-dom';
import type { RootState } from '../../store';
import CheckoutAddressForm from './CheckoutAddressForm';
import CheckoutSummary from './CheckoutSummary';
import ExistingAddressSelector from './ExistingAddressSelector';
import AddressEditModal from './AddressEditModal';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';

// Shared types for checkout and address components
export interface Address {
  id: number;
  unit_no: string;
  street_no: string;
  address_line1: string;
  address_line2: string;
  barangay: string;
  city: string;
  region: string;
  zipcode: string;
  country_id: number;
}

export interface UserAddress {
  id: number; // user_addresses join table ID
  is_default: boolean;
  address: Address;
}

export interface UserDetail {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  dob: string;
}

export interface Phone {
  id: number;
  phone_number: string;
  phone_type: 'mobile' | 'home' | 'office';
  is_default: boolean;
}

export interface UserPaymentMethod {
  id: number;
  balance: string;
  payment_type: string | null;
}

export interface User {
  id: number;
  email: string;
  is_verified: boolean;
  confirmed_at: string;
  created_at: string;
  updated_at: string;
  user_detail: UserDetail;
  phones: Phone[];
  user_addresses: UserAddress[];
  user_payment_methods: UserPaymentMethod[];
}

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

export interface SocialProgram {
  id: number;
  title: string;
  description: string;
  address: Address;
}

export interface Pagination {
  current_page: number | null;
  per_page: number | null;
  total_entries: number | null;
  total_pages: number | null;
  next_page: number | null;
  previous_page: number | null;
}

export interface SocialProgramResponse {
  data: SocialProgram[];
  pagination: Pagination;
}

export const loader = (queryClient: any, store: any) => async ({ params }: any) => {
  const storeState = store.getState();
  const user = storeState.userState?.user;
  
  if (!user) {
    return { SocialPrograms: { data: [], pagination: {} }, userDetails: null };
  }

  const id = params.id;

  const SocialProgramsQuery = {
    queryKey: ['SocialProgramsDetails', id],
    queryFn: async () => {
      const response = await customFetch.get(`/social_programs`);
      console.log(`Checkout SocialPrograms`, response.data)
      return response.data;
    },
  };

  const userDetailsQuery = {
    queryKey: ['userDetails', user.id.toString()],
    queryFn: async () => {
      const response = await customFetch.get(`/users/${user.id}`, {
        headers: {
          Authorization: user.token,
        },
      });
      return response.data;
    },
  };

  try {
    const [SocialPrograms, userDetails] = await Promise.all([
      queryClient.ensureQueryData(SocialProgramsQuery),
      queryClient.ensureQueryData(userDetailsQuery),
    ]);
    console.log('Checkout SocialPrograms:', SocialPrograms)
    console.log('Checkout userDetails:', userDetails)
    return { SocialPrograms, userDetails };
  } catch (error: any) {
    console.error('Failed to load checkout data:', error);
    toast.error('Failed to load checkout data');
    return { SocialPrograms: { data: [], pagination: {} }, userDetails: null };
  }
};

const Checkout = () => {
  const { SocialPrograms, userDetails } = useLoaderData() as {
    SocialPrograms: SocialProgramResponse;
    userDetails: { data: User } | null;
  };
  const location = useLocation();
  const sp_id = location.state?.sp_id
  console.log(`Checkout sp_id`, sp_id)

  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const user = useSelector((state: RootState) => state.userState.user);
  const { cartItems } = useSelector((state: RootState) => state.cartState);
  
  // Address management state
  const [addressId, setAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userAddresses = userDetails?.data?.user_addresses || [];
  const defaultPhone = userDetails?.data?.phones?.find(p => p.is_default)?.phone_number || 'Not Available';
  const userName = userDetails?.data?.user_detail 
    ? `${userDetails.data.user_detail.first_name} ${userDetails.data.user_detail.last_name}`
    : 'User';

  const handleAddressSelected = (selectedAddressId: number) => {
    setAddressId(selectedAddressId);
    setShowNewAddressForm(false); // Hide form when existing address is selected
  };

  const handleAddressSaved = (newAddressId: number) => {
    setAddressId(newAddressId);
    setShowNewAddressForm(false);
    // Revalidate to fetch updated user addresses
    revalidator.revalidate();
  };

  const handleEditAddress = (userAddress: UserAddress) => {
    setEditingAddress(userAddress);
    setIsEditModalOpen(true);
  };

  const handleAddressUpdated = () => {
    // Revalidate to fetch updated addresses
    setIsEditModalOpen(false);
    revalidator.revalidate();
  };

  const handleOrderComplete = () => {
    // Navigate to success page or home
    navigate('/order_completed');
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
        {/* Left side - Address Selection & Form (2/3) */}
        <div className="lg:col-span-2">
          {/* Existing Addresses Selector */}
          {userAddresses.length > 0 && (
            <ExistingAddressSelector
              userAddresses={userAddresses}
              userName={userName}
              userPhone={defaultPhone}
              onAddressSelected={handleAddressSelected}
              onEditAddress={handleEditAddress}
              selectedAddressId={addressId}
            />
          )}

          {/* Add New Address Button/Form */}
          {!showNewAddressForm ? (
            <div className="bg-base-100 rounded-lg shadow-md p-6">
              <button
                className="btn btn-secondary btn-block"
                onClick={() => setShowNewAddressForm(true)}
              >
                {userAddresses.length > 0 ? 'Add a new delivery address' : 'Add delivery address'}
              </button>
            </div>
          ) : (
            <CheckoutAddressForm
              onAddressSaved={handleAddressSaved}
              onCancel={() => setShowNewAddressForm(false)}
              userEmail={user?.email || 'Not Available'}
              userId={user?.id || 0}
            />
          )}

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
            addressId={addressId}
            onOrderComplete={handleOrderComplete}
            SocialPrograms={SocialPrograms}
            selectedSP={sp_id}
          />
        </div>
      </div>

      {/* Address Edit Modal */}
      <AddressEditModal
        isOpen={isEditModalOpen}
        userAddress={editingAddress}
        userId={user?.id || 0}
        onClose={() => setIsEditModalOpen(false)}
        onAddressUpdated={handleAddressUpdated}
      />
    </div>
  );
};

export default Checkout;