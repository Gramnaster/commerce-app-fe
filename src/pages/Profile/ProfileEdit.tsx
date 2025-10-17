import { redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
// import type { Trader } from './TradersAdmin';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface Country {
  id: number;
  name: string;
  code: string;
}

export interface User {
  id: number;
  email: string;
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
  console.log(`ProfileEdit userDetailsQuery`, userDetailsQuery)

  const countriesQuery = {
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await customFetch.get('/countries');
      return response.data;
    },
  };

  try {
    const [userDetails, countries] = await Promise.all([
      queryClient.ensureQueryData(userDetailsQuery),
      queryClient.ensureQueryData(countriesQuery),
    ]);
    return { userDetails, countries };
  } catch (error: any) {
    console.error('Failed to load user:', error);
    toast.error('Failed to load user details');
    return redirect('/admin');
  }
};

const ProfileEdit = () => {
  const { userDetails, countries } = useLoaderData() as { 
    userDetails: User; 
    countries: Country[];
  };
  // console.log(`ProfilEdit userDetails: `, userDetails)

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.userState.user);

  // Form state
  const [formData, setFormData] = useState({
    email: userDetails.data.email,
    user_detail_attributes: {
      first_name: userDetails.data.user_detail.first_name,
      middle_name: userDetails.data.user_detail.middle_name || '',
      last_name: userDetails.data.user_detail.last_name,
      dob: userDetails.data.user_detail.dob
    },
      user_addresses_attributes:
    (userDetails.data.user_addresses?.length
      ? userDetails.data.user_addresses.map((userAddress: any) => ({
          id: userAddress.id || '',
          is_default: userAddress.is_default || false,
          address_attributes: {
            unit_no: userAddress.address?.unit_no || '',
            street_no: userAddress.address?.street_no || '',
            address_line1: userAddress.address?.address_line1 || '',
            address_line2: userAddress.address?.address_line2 || '',
            city: userAddress.address?.city || '',
            region: userAddress.address?.region || '',
            zipcode: userAddress.address?.zipcode || '',
            country_id: userAddress.address?.country_id || '',
          },
        }))
      : [
          {
            id: '',
            is_default: true,
            address_attributes: {
              unit_no: '',
              street_no: '',
              address_line1: '',
              address_line2: '',
              city: '',
              region: '',
              zipcode: '',
              country_id: '',
            },
          },
        ]),
      phones_attributes:
        (userDetails.data.phones?.length
          ? userDetails.data.phones.map((phone_number: any) => ({
              id: phone_number.id || '',
              phone_no: phone_number.phone_no || '',
              phone_type: phone_number.phone_type || '',
            }))
          : [
          // default empty phone entry
          {
            id: '',
            phone_no: '',
            phone_type: '',
          },
        ]),
});

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await customFetch.patch(
        `/users/${userDetails.data.id}`,
        {
          user: userData,
        },
        {
          headers: {
            Authorization: user?.token,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['userDetails', userDetails.data.id.toString()] });
      navigate(`/view/${userDetails.data.id}`);
    },
    onError: (error: any) => {
      console.error('Update failed:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to update user';
      toast.error(errorMessage);
    },
  });

const NESTED_FIELDS: Record<string, string> = {
  first_name: 'user_detail_attributes',
  middle_name: 'user_detail_attributes',
  last_name: 'user_detail_attributes',
  dob: 'user_detail_attributes',

  unit_no: 'user_addresses_attributes',
  street_no: 'user_addresses_attributes',
  address_line1: 'user_addresses_attributes',
  address_line2: 'user_addresses_attributes',
  city: 'user_addresses_attributes',
  region: 'user_addresses_attributes',
  zipcode: 'user_addresses_attributes',
  country_id: 'user_addresses_attributes',
  
  phone_no: 'phones_attributes',
  phone_type: 'phones_attributes',
};

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  addressIndex?: number,
  phoneIndex?: number
) => {
  const { name, value } = e.target;
  const parentKey = NESTED_FIELDS[name];

  setFormData((prev) => {
    if (parentKey === 'user_detail_attributes') {
      return {
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [name]: value,
        },
      };
    }
    if (parentKey === 'user_addresses_attributes' && addressIndex !== undefined) {
      const updatedAddresses = [...prev.user_addresses_attributes];
      const currentAddress = updatedAddresses[addressIndex];

      updatedAddresses[addressIndex] = {
        ...currentAddress,
        address_attributes: {
          ...currentAddress.address_attributes,
          [name]: value,
        },
      };

      return {
        ...prev,
        user_addresses_attributes: updatedAddresses,
      };
    }

    if (parentKey === 'phones_attributes' && phoneIndex !== undefined) {
      const updatedPhones = [...prev.phones_attributes];
      const currentPhone = updatedPhones[phoneIndex];

      updatedPhones[phoneIndex] = {
        ...currentPhone,
        [name]: value,
      };
      return {
        ...prev,
        phones_attributes: updatedPhones,
      };
    }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the payload matching the API format
    const payload = {
      ...formData,
    };
    
    updateUserMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-[#161420] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Traders List
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Edit Trader</h1>
          <p className="text-gray-400">
            Editing information for 
            {userDetails.data.user_detail.first_name || ''}{' '}
            {userDetails.data.user_detail.last_name || ''}{' '}
          </p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-[#1e1b2e] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.user_detail_attributes.first_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.user_detail_attributes.middle_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.user_detail_attributes.last_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.user_detail_attributes.dob}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-[#1e1b2e] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
              Address Information
            </h2>
            {formData.user_addresses_attributes.map((userAddress: any, index: number) => { 
              console.log(`userAddress :`, userAddress)
              return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={userAddress.id}>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Unit No. 
                </label>
                <input
                  type="text"
                  name="unit_no"
                  value={userAddress.address_attributes.unit_no}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Street No.
                </label>
                <input
                  type="text"
                  name="street_no"
                  value={userAddress.address_attributes.street_no}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={userAddress.address_attributes.address_line1}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={userAddress.address_attributes.address_line2}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={userAddress.address_attributes.city}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={userAddress.address_attributes.zipcode}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Country *
                </label>
                <select
                  name="country_id"
                  value={userAddress.address_attributes.country_id}
                  onChange={(e) => handleInputChange(e, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Country...</option>
                  {countries
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                </select>
              </div>
            </div>
            )})}
          </div>

          {/* Phones */}
          <div className="bg-[#1e1b2e] rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
              Phone Numbers
            </h2>
            {formData.phones_attributes.map((phoneNumber: any, index: number) => { 
              console.log(`phoneNumber :`, phoneNumber)
              return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={phoneNumber.id}>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="number"
                  name="phone_no"
                  value={phoneNumber.phone_no}
                  onChange={(e) => handleInputChange(e, undefined, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Type:
                </label>
                <input
                  type="radio"
                  name="phone_type"
                  value="work"
                  checked={phoneNumber.phone_type === 'work'}
                  onChange={(e) => handleInputChange(e, undefined, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <div>Work</div>
                <input
                  type="radio"
                  name="phone_type"
                  value="home"
                  checked={phoneNumber.phone_type === 'home'}
                  onChange={(e) => handleInputChange(e, undefined, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <div>Home</div>
                <input
                  type="radio"
                  name="phone_type"
                  value="mobile"
                  checked={phoneNumber.phone_type === 'mobile'}
                  onChange={(e) => handleInputChange(e, undefined, index)}
                  className="w-full bg-[#2a2740] border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <div>Mobile</div>
              </div>
            </div>
            )})}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileEdit