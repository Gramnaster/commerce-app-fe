import { redirect, useLoaderData} from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../../utils";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import type { RootState } from "../../store";

// From action loader, we'll get the stored user id

interface UserDetail {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  dob: string;
}

interface Phone {
  id: number;
  phone_no: string;
  phone_type: 'mobile' | 'home' | 'work';
  is_default: boolean;
}

interface Address {
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

interface UserAddress {
  id: number;
  is_default: boolean;
  address: Address;
}

interface UserPaymentMethod {
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

export const loader = (queryClient: any, store: any) => async ({ params }: any) => {
  const storeState = store.getState();
  const user = storeState.userState?.user;

  const id = params.id;

  const userDetailsQuery = {
    queryKey: ['userDetails', id],
    queryFn: async () => {
      const response = await customFetch.get(`/users/${id}`, {
        headers: {
          Authorization: user.token,
        },
      });
      return response.data;
    },
  };

  try {
    const userDetails = await queryClient.ensureQueryData(userDetailsQuery);
    return { userDetails };
  } catch (error: any) {
    console.error('Failed to load user:', error);
    toast.error('Failed to load user details');
    return redirect('/admin');
  }
};

const ProfileView = () => {
  const { userDetails } = useLoaderData() as { 
    userDetails: { data: User }; 
  };

  const user = useSelector((state: RootState) => state.userState.user);
  console.log(`user`, user);

  const userData = userDetails.data;
  const { user_detail, phones, user_addresses } = userData;
  
  // Find default phone or first phone
  const defaultPhone = phones.find(p => p.is_default) || phones[0];
  const homePhone = phones.find(p => p.phone_type === 'home');
  const workPhone = phones.find(p => p.phone_type === 'work');

  return (
    <div className="min-h-screen bg-base-100 text-base-content mb-20">
      <div className="max-w-4xl mx-auto font-secondary">
        
        {/* Header */}
        <h2 className="text-xl font-semibold mb-8">USER PROFILE</h2>

        {/* User Info */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <div>
            <p className="font-semibold">Email:</p>
            <p>{userData.email}</p>
          </div>
          <div>
            <p className="font-semibold">Date of Birth:</p>
            <p>{user_detail.dob}</p>
          </div>
        </div>

        {/* Names */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-8">
          <div>
            <p className="font-semibold">First Name:</p>
            <p>{user_detail.first_name}</p>
          </div>
          <div>
            <p className="font-semibold">Middle Name:</p>
            <p>{user_detail.middle_name || 'N/A'}</p>
          </div>
          <div>
            <p className="font-semibold">Last Name:</p>
            <p>{user_detail.last_name}</p>
          </div>
        </div>

        {/* Phone Numbers */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-15">
          <div>
            <p className="font-semibold">Mobile Number (Default):</p>
            <p className="text-red-600">{defaultPhone?.phone_no || 'Nil'}</p>
          </div>
          <div>
            <p className="font-semibold">Home Number:</p>
            <p>{homePhone?.phone_no || 'Nil'}</p>
          </div>
          <div>
            <p className="font-semibold">Work Number:</p>
            <p>{workPhone?.phone_no || 'Nil'}</p>
          </div>
        </div>

        {/* Address Details */}
        {user_addresses.map((userAddr, index) => {
          const { address, is_default } = userAddr;
          return (
            <div key={userAddr.id} className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
              <h2 className="text-xl font-semibold mb-4">
                ADDRESS DETAILS #{index + 1}
                {is_default && <span className="text-red-600"> (Default)</span>}
              </h2>
              
              <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-4">
                <div>
                  <p className="font-semibold">Unit Number:</p>
                  <p>{address.unit_no}</p>
                </div>
                <div>
                  <p className="font-semibold">Street Name:</p>
                  <p>{address.street_no}</p>
                </div>
                                <div>
                  <p className="font-semibold">Barangay:</p>
                  <p>{address.barangay}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-4">
                <div>
                  <p className="font-semibold">Address Line:</p>
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                </div>
                <div>
                  <p className="font-semibold">City:</p>
                  <p>{address.city}</p>
                </div>
                <div>
                  <p className="font-semibold">Region:</p>
                  <p>{address.region}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-10">
                <div>
                  <p className="font-semibold">Zipcode:</p>
                  <p>{address.zipcode}</p>
                </div>
                <div>
                  <p className="font-semibold">Country:</p>
                  <p>{`Philippines`}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Action Buttons */}
        <div className="flex justify-end mt-8">
          <NavLink 
            to={`/profile/edit/${userData.id}`}
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Edit Profile
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;