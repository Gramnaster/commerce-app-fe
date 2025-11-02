import { usePhilippineAddress } from '../utils/usePhilippineAddress';

interface PhilippineAddressFieldsProps {
  // Initial values for pre-populating (when editing)
  initialRegion?: string;
  initialProvince?: string;
  initialCity?: string;
  initialBarangay?: string;
  
  // Callback when any address field changes
  onAddressChange: (field: string, value: string) => void;
  
  // Optional validation errors
  errors?: {
    region?: string;
    city?: string;
    barangay?: string;
  };
  
  // Optional custom input className (for background color, etc.)
  inputClassName?: string;
}

const PhilippineAddressFields = ({
  initialRegion = '',
  initialProvince = '',
  initialCity = '',
  initialBarangay = '',
  onAddressChange,
  errors = {},
  inputClassName = '',
}: PhilippineAddressFieldsProps) => {
  const {
    regions,
    filteredProvinces,
    filteredCities,
    filteredBarangays,
    selectedRegion,
    selectedProvince,
    selectedCity,
    selectedBarangay,
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
    loading,
  } = usePhilippineAddress({
    initialRegion,
    initialProvince,
    initialCity,
    initialBarangay,
    onAddressChange,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="loading loading-spinner loading-md"></span>
        <span className="ml-2 text-base-content">Loading address data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Region */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content">
            Region <span className="text-error">*</span>
          </span>
        </label>
        <select
          name="region"
          value={selectedRegion}
          onChange={(e) => handleRegionChange(e.target.value)}
          className={`select select-bordered w-full text-base-content ${inputClassName} ${
            errors.region ? 'select-error' : ''
          }`}
          required
        >
          <option value="" disabled>
            Choose Region
          </option>
          {regions.map((region) => (
            <option key={region.region_code} value={region.region_code}>
              {region.region_name}
            </option>
          ))}
        </select>
        {errors.region && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.region}</span>
          </label>
        )}
      </div>

      {/* Province */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content">
            Province <span className="text-error">*</span>
          </span>
        </label>
        <select
          name="province"
          value={selectedProvince}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className={`select select-bordered w-full text-base-content ${inputClassName}`}
          disabled={!selectedRegion || filteredProvinces.length === 0}
          required
        >
          <option value="" disabled>
            {!selectedRegion
              ? 'Select a region first'
              : filteredProvinces.length === 0
              ? 'No provinces available'
              : 'Choose Province'}
          </option>
          {filteredProvinces.map((province) => (
            <option key={province.province_code} value={province.province_code}>
              {province.province_name}
            </option>
          ))}
        </select>
      </div>

      {/* City/Municipality */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content">
            City/Municipality <span className="text-error">*</span>
          </span>
        </label>
        <select
          name="city"
          value={selectedCity}
          onChange={(e) => handleCityChange(e.target.value)}
          className={`select select-bordered w-full text-base-content ${inputClassName} ${
            errors.city ? 'select-error' : ''
          }`}
          disabled={!selectedProvince || filteredCities.length === 0}
          required
        >
          <option value="" disabled>
            {!selectedProvince
              ? 'Select a province first'
              : filteredCities.length === 0
              ? 'No cities available'
              : 'Choose City/Municipality'}
          </option>
          {filteredCities.map((city) => (
            <option key={city.city_code} value={city.city_code}>
              {city.city_name}
            </option>
          ))}
        </select>
        {errors.city && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.city}</span>
          </label>
        )}
      </div>

      {/* Barangay */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-base-content">
            Barangay <span className="text-error">*</span>
          </span>
        </label>
        <select
          name="barangay"
          value={selectedBarangay}
          onChange={(e) => handleBarangayChange(e.target.value)}
          className={`select select-bordered w-full text-base-content ${inputClassName} ${
            errors.barangay ? 'select-error' : ''
          }`}
          disabled={!selectedCity || filteredBarangays.length === 0}
          required
        >
          <option value="" disabled>
            {!selectedCity
              ? 'Select a city first'
              : filteredBarangays.length === 0
              ? 'No barangays available'
              : 'Choose Barangay'}
          </option>
          {filteredBarangays.map((barangay) => (
            <option key={barangay.brgy_code} value={barangay.brgy_code}>
              {barangay.brgy_name}
            </option>
          ))}
        </select>
        {errors.barangay && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.barangay}</span>
          </label>
        )}
      </div>
    </div>
  );
};

export default PhilippineAddressFields;
