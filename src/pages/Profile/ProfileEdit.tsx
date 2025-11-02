import { redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { IconLineDark, IconLineWhite } from '../../assets/images';

interface Country {
  id: number;
  name: string;
  code: string;
}

interface CountriesResponse {
  pagination: {
    current_page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
    next_page: number | null;
    previous_page: number | null;
  };
  data: Country[];
}

interface UserDetail {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  dob: string;
}

interface Phone {
  id: number;
  phone_number: string;
  phone_type: 'mobile' | 'home' | 'office';
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
  console.log(`ProfileEdit userDetailsQuery`, userDetailsQuery)

  const countriesQuery = {
    queryKey: ['countries'],
    queryFn: async () => {
      // Fetch all countries by setting per_page to a large number
      const response = await customFetch.get('/countries?per_page=300');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 60 * 2, // Keep in cache for 2 hours
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
    userDetails: { data: User }; 
    countries: CountriesResponse;
  };
  console.log(`ProfileEdit countries:`, countries);
  console.log(`ProfileEdit userDetails:`, userDetails);

  // Extract countries array from response
  const countriesArray: Country[] = countries?.data || [];

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.userState.user);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
      ? userDetails.data.user_addresses.map((userAddress: UserAddress) => ({
          id: userAddress.id || '',
          is_default: userAddress.is_default || false,
          _destroy: false,
          address_attributes: {
            unit_no: userAddress.address?.unit_no || '',
            street_no: userAddress.address?.street_no || '',
            address_line1: userAddress.address?.address_line1 || '',
            address_line2: userAddress.address?.address_line2 || '',
            barangay: userAddress.address?.barangay || '',
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
            _destroy: false,
            address_attributes: {
              unit_no: '',
              street_no: '',
              address_line1: '',
              address_line2: '',
              barangay: '',
              city: '',
              region: '',
              zipcode: '',
              country_id: '',
            },
          },
        ]),
      phones_attributes:
        (userDetails.data.phones?.length
          ? userDetails.data.phones.map((phone_number: Phone) => ({
              id: phone_number.id || '',
              phone_no: phone_number.phone_number || '',
              phone_type: phone_number.phone_type || 'mobile',
            }))
          : [
          // default empty phone entry
          {
            id: '',
            phone_no: '',
            phone_type: 'mobile' as const,
          },
        ]),
});

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: typeof formData) => {
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
    onSuccess: async () => {
      toast.success('User updated successfully');
      setValidationErrors([]);
      
      // Invalidate and await refetch before navigating
      await queryClient.invalidateQueries({ queryKey: ['users', user?.id] });
      await queryClient.invalidateQueries({ queryKey: ['userDetails', userDetails.data.id.toString()] });
      
      // Navigate after cache is invalidated
      navigate(`/profile/view/${userDetails.data.id}`);
    },
    onError: (error: { response?: { data?: { errors?: string[] } } }) => {
      console.error('Update failed:', error);
      const errors = error.response?.data?.errors || ['Failed to update user'];
      setValidationErrors(errors);
      toast.error(errors.join(', '));
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
  barangay: 'user_addresses_attributes',
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

  // Handle setting default address
  const handleSetDefaultAddress = (addressIndex: number) => {
    setFormData((prev) => {
      const updatedAddresses = prev.user_addresses_attributes.map((addr, idx) => ({
        ...addr,
        is_default: idx === addressIndex,
      }));
      
      return {
        ...prev,
        user_addresses_attributes: updatedAddresses,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationErrors([]);
    
    // Create the payload matching the API format
    const payload = {
      ...formData,
    };
    
    updateUserMutation.mutate(payload);
  };

  // Helper to check if a field has an error
  const hasError = (fieldName: string) => {
    return validationErrors.some(error => 
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  // Handle deleting an address
  const handleDeleteAddress = (addressIndex: number) => {
    setFormData((prev) => {
      // Count addresses not marked for deletion
      const activeAddresses = prev.user_addresses_attributes.filter(addr => !addr._destroy);
      
      // Prevent deleting the last address
      if (activeAddresses.length <= 1) {
        toast.error('You must have at least one address');
        return prev;
      }
      
      const updatedAddresses = [...prev.user_addresses_attributes];
      const addressToDelete = updatedAddresses[addressIndex];
      
      // If the address has an id (exists in backend), mark for deletion
      if (addressToDelete.id) {
        updatedAddresses[addressIndex] = {
          ...addressToDelete,
          _destroy: true,
        };
      } else {
        // If it's a new address (no id), just remove it from the array
        updatedAddresses.splice(addressIndex, 1);
      }
      
      return { ...prev, user_addresses_attributes: updatedAddresses };
    });
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/profile/view/${userDetails.data.id}`)}
            className="mb-4 flex items-center gap-2 text-base-content hover:text-secondary transition-colors"
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
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-base-content mb-2">Edit User</h1>
          <p className="text-base-content">
            Editing information for 
            {userDetails.data.user_detail.first_name || ''}{' '}
            {userDetails.data.user_detail.last_name || ''}{' '}
          </p>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Validation Errors Display */}
          {validationErrors.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="font-bold">Please fix the following errors:</p>
              <ul className="list-disc list-inside mt-2">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-base-100 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-base-content mb-4 pb-2 border-b border-gray-700">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base-content text-sm font-medium mb-2">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-gray-200 border border-gray-400 rounded-lg p-3 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-base-content text-sm font-medium mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.user_detail_attributes.first_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#ffffff] border border-gray-600 rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-base-content text-sm font-medium mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.user_detail_attributes.middle_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#ffffff] border border-gray-600 rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-base-content text-sm font-medium mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.user_detail_attributes.last_name}
                  onChange={handleInputChange}
                  className="w-full bg-[#ffffff] border border-gray-600 rounded-lg p-3 text-base-content focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-base-content text-sm font-medium mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  data-theme='light'
                  value={formData.user_detail_attributes.dob}
                  onChange={handleInputChange}
                  className="w-full bg-[#ffffff] border border-gray-600 rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-base-100 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b border-gray-700">
              Address Information
            </h2>
            {formData.user_addresses_attributes.map((userAddress, index: number) => { 
              console.log(`userAddress :`, userAddress)
              // Skip rendering addresses marked for deletion
              if (userAddress._destroy) return null;
              
              return (
            <div key={userAddress.id || index} className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-base-content">
                  Address #{index + 1}
                  {userAddress.is_default && (
                    <span className="ml-2 text-sm bg-green-600 text-white px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </h3>
                <div className="flex gap-2">
                  {!userAddress.is_default && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultAddress(index)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(index)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    Delete Address
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${hasError('unit_no') ? 'text-red-600' : 'text-black'}`}>
                  Unit No. 
                </label>
                <input
                  type="text"
                  name="unit_no"
                  value={userAddress.address_attributes.unit_no}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent ${hasError('unit_no') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${hasError('street_no') ? 'text-red-600' : 'text-black'}`}>
                  Street No.
                </label>
                <input
                  type="text"
                  name="street_no"
                  value={userAddress.address_attributes.street_no}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-ffffff focus:border-transparent ${hasError('street_no') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${hasError('address_line1') ? 'text-red-600' : 'text-black'}`}>
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={userAddress.address_attributes.address_line1}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent ${hasError('address_line1') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${hasError('address_line2') ? 'text-red-600' : 'text-black'}`}>
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={userAddress.address_attributes.address_line2}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent ${hasError('address_line2') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${hasError('barangay') ? 'text-red-600' : 'text-black'}`}>
                  Barangay *
                </label>
                <input
                  type="text"
                  name="barangay"
                  value={userAddress.address_attributes.barangay}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent ${hasError('barangay') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${hasError('city') ? 'text-red-600' : 'text-black'}`}>
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={userAddress.address_attributes.city}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent ${hasError('city') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${hasError('region') ? 'text-red-600' : 'text-black'}`}>
                  Region *
                </label>
                <input
                  type="text"
                  name="region"
                  value={userAddress.address_attributes.region}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent ${hasError('region') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${hasError('zipcode') ? 'text-red-600' : 'text-black'}`}>
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={userAddress.address_attributes.zipcode}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent ${hasError('zipcode') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${hasError('country') ? 'text-red-600' : 'text-black'}`}>
                  Country *
                </label>
                <select
                  name="country_id"
                  value={userAddress.address_attributes.country_id}
                  onChange={(e) => handleInputChange(e, index)}
                  className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent ${hasError('country') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                  required
                >
                  <option value="">Select Country...</option>
                  {countriesArray
                    .slice()
                    .sort((a: Country, b: Country) => a.name.localeCompare(b.name))
                    .map((country: Country) => (
                      <option key={country.id} value={country.id}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                </select>
              </div>
            </div>
            
            {/* Separator Line between addresses */}
            {index < formData.user_addresses_attributes.length - 1 && (
              <div className="flex justify-center my-8">
                <img 
                  src={IconLineDark} 
                  alt="separator" 
                  className="h-[11px] w-[67px] dark:hidden" 
                />
                <img 
                  src={IconLineWhite} 
                  alt="separator" 
                  className="h-[11px] w-[67px] hidden dark:block" 
                />
              </div>
            )}
          </div>
            )})}
          </div>

          {/* Phones */}
          <div className="bg-base-100 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b border-gray-700">
              Phone Numbers
            </h2>
            {formData.phones_attributes.map((phoneNumber, index: number) => { 
              console.log(`phoneNumber :`, phoneNumber)
              return (
            <div key={phoneNumber.id || index} className="mb-8">
              <h3 className="text-lg font-semibold text-black mb-4">
                Phone #{index + 1}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${hasError('phone') ? 'text-red-600' : 'text-black'}`}>
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone_no"
                    value={phoneNumber.phone_no}
                    onChange={(e) => handleInputChange(e, undefined, index)}
                    className={`w-full bg-[#ffffff] rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent ${hasError('phone') ? 'border-2 border-red-600' : 'border border-gray-600'}`}
                  />
                </div>
              </div>
              <div className='flex flex-col items-center justify-between'>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Type:
                  </label>
                <div className='flex items-center justify-between gap-5'>
                  <label>Office</label>
                  <input
                    type="radio"
                    name="phone_type"
                    value="office"
                    checked={phoneNumber.phone_type === 'office'}
                    onChange={(e) => handleInputChange(e, undefined, index)}
                    className="w-full bg-[#ffffff] border border-gray-600 rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
                <div className='flex items-center justify-between gap-5'>
                  <label>Home</label>
                  <input
                    type="radio"
                    name="phone_type"
                    value="home"
                    checked={phoneNumber.phone_type === 'home'}
                    onChange={(e) => handleInputChange(e, undefined, index)}
                    className="w-full bg-[#ffffff] border border-gray-600 rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
                <div className='flex items-center justify-between gap-5'>
                  <div>Mobile</div>
                  <input
                    type="radio"
                    name="phone_type"
                    value="mobile"
                    checked={phoneNumber.phone_type === 'mobile'}
                    onChange={(e) => handleInputChange(e, undefined, index)}
                    className="w-full bg-[#ffffff] border border-gray-600 rounded-lg p-3 text-base-content focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            {/* Separator Line between phones */}
            {index < formData.phones_attributes.length - 1 && (
              <div className="flex justify-center my-8">
                <img 
                  src={IconLineDark} 
                  alt="separator" 
                  className="h-[11px] w-[67px] dark:hidden" 
                />
                <img 
                  src={IconLineWhite} 
                  alt="separator" 
                  className="h-[11px] w-[67px] hidden dark:block" 
                />
              </div>
            )}
          </div>
            )})}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/profile/view/${userDetails.data.id}`)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="px-6 py-3 bg-secondary disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
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