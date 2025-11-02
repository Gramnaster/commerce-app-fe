import { useState, useEffect } from 'react';

// Type definitions for Philippine address data
export interface Region {
  id: number;
  psgc_code: string;
  region_name: string;
  region_code: string;
}

export interface Province {
  province_code: string;
  province_name: string;
  psgc_code: string;
  region_code: string;
}

export interface City {
  city_code: string;
  city_name: string;
  province_code: string;
  psgc_code: string;
  region_desc: string;
}

export interface Barangay {
  brgy_code: string;
  brgy_name: string;
  city_code: string;
  province_code: string;
  region_code: string;
}

interface UsePhilippineAddressProps {
  initialRegion?: string;
  initialProvince?: string;
  initialCity?: string;
  initialBarangay?: string;
  onAddressChange?: (field: string, value: string) => void;
}

export const usePhilippineAddress = ({
  initialRegion = '',
  initialProvince = '',
  initialCity = '',
  initialBarangay = '',
  onAddressChange,
}: UsePhilippineAddressProps = {}) => {
  // State for all data
  const [regions, setRegions] = useState<Region[]>([]);
  const [allProvinces, setAllProvinces] = useState<Province[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [allBarangays, setAllBarangays] = useState<Barangay[]>([]);

  // State for filtered data
  const [filteredProvinces, setFilteredProvinces] = useState<Province[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [filteredBarangays, setFilteredBarangays] = useState<Barangay[]>([]);

  // State for selections
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedBarangay, setSelectedBarangay] = useState(initialBarangay);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Load all JSON data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [regionsData, provincesData, citiesData, barangaysData] = await Promise.all([
          import('../assets/data/philippines/region.json'),
          import('../assets/data/philippines/province.json'),
          import('../assets/data/philippines/city.json'),
          import('../assets/data/philippines/barangay.json'),
        ]);

        setRegions(regionsData.default as Region[]);
        setAllProvinces(provincesData.default as Province[]);
        setAllCities(citiesData.default as City[]);
        setAllBarangays(barangaysData.default as Barangay[]);
      } catch (error) {
        console.error('Failed to load Philippine address data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter provinces when region changes
  useEffect(() => {
    if (selectedRegion && allProvinces.length > 0) {
      const filtered = allProvinces.filter(
        (province) => province.region_code === selectedRegion
      );
      // Sort alphabetically
      filtered.sort((a, b) => a.province_name.localeCompare(b.province_name));
      setFilteredProvinces(filtered);
    } else {
      setFilteredProvinces([]);
    }
  }, [selectedRegion, allProvinces]);

  // Filter cities when province changes
  useEffect(() => {
    if (selectedProvince && allCities.length > 0) {
      const filtered = allCities.filter(
        (city) => city.province_code === selectedProvince
      );
      // Sort alphabetically
      filtered.sort((a, b) => a.city_name.localeCompare(b.city_name));
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [selectedProvince, allCities]);

  // Filter barangays when city changes
  useEffect(() => {
    if (selectedCity && allBarangays.length > 0) {
      const filtered = allBarangays.filter(
        (barangay) => barangay.city_code === selectedCity
      );
      // Sort alphabetically
      filtered.sort((a, b) => a.brgy_name.localeCompare(b.brgy_name));
      setFilteredBarangays(filtered);
    } else {
      setFilteredBarangays([]);
    }
  }, [selectedCity, allBarangays]);

  // Handler for region change
  const handleRegionChange = (regionCode: string) => {
    setSelectedRegion(regionCode);
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedBarangay('');
    
    // Get region name for storing
    const region = regions.find((r) => r.region_code === regionCode);
    if (region && onAddressChange) {
      onAddressChange('region', region.region_name);
    }
  };

  // Handler for province change
  const handleProvinceChange = (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    setSelectedCity('');
    setSelectedBarangay('');
    
    // Get province name for storing
    const province = allProvinces.find((p) => p.province_code === provinceCode);
    if (province && onAddressChange) {
      // Store province name in the 'city' field as per your requirement
      onAddressChange('city', province.province_name);
    }
  };

  // Handler for city change
  const handleCityChange = (cityCode: string) => {
    setSelectedCity(cityCode);
    setSelectedBarangay('');
    
    // Get city name for storing
    const city = allCities.find((c) => c.city_code === cityCode);
    if (city && onAddressChange) {
      // Append city to the province in 'city' field: "Province, City"
      const province = allProvinces.find((p) => p.province_code === selectedProvince);
      if (province) {
        onAddressChange('city', `${province.province_name}, ${city.city_name}`);
      }
    }
  };

  // Handler for barangay change
  const handleBarangayChange = (barangayCode: string) => {
    setSelectedBarangay(barangayCode);
    
    // Get barangay name for storing
    const barangay = allBarangays.find((b) => b.brgy_code === barangayCode);
    if (barangay && onAddressChange) {
      onAddressChange('barangay', barangay.brgy_name);
    }
  };

  // Helper to get display names
  const getRegionName = (regionCode: string) => {
    return regions.find((r) => r.region_code === regionCode)?.region_name || '';
  };

  const getProvinceName = (provinceCode: string) => {
    return allProvinces.find((p) => p.province_code === provinceCode)?.province_name || '';
  };

  const getCityName = (cityCode: string) => {
    return allCities.find((c) => c.city_code === cityCode)?.city_name || '';
  };

  const getBarangayName = (barangayCode: string) => {
    return allBarangays.find((b) => b.brgy_code === barangayCode)?.brgy_name || '';
  };

  return {
    // Data
    regions,
    filteredProvinces,
    filteredCities,
    filteredBarangays,
    
    // Selections
    selectedRegion,
    selectedProvince,
    selectedCity,
    selectedBarangay,
    
    // Handlers
    handleRegionChange,
    handleProvinceChange,
    handleCityChange,
    handleBarangayChange,
    
    // Helpers
    getRegionName,
    getProvinceName,
    getCityName,
    getBarangayName,
    
    // Loading state
    loading,
  };
};
