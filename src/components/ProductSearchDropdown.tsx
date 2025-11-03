import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '../utils';
import type { Product } from '../pages/Products/Products';
import { IconSearch } from '../assets/images';

interface ProductSearchDropdownProps {
  placeholder?: string;
}

const ProductSearchDropdown = ({
  placeholder = 'Search Categories or Products',
}: ProductSearchDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch products when search button is clicked
  const handleSearchClick = async () => {
    // If already open and has products, just toggle
    if (isOpen && products.length > 0) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsOpen(true);

    try {
      const response = await customFetch.get('/products?per_page=10000');
      setProducts(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (productId: number) => {
    navigate(`/products/${productId}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchClick();
    }
  };

  return (
    <div className="relative flex-6 justify-center" ref={dropdownRef}>
      {/* Search Input with Button */}
      <div className="flex items-center w-full max-w-4xl">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="input flex-1 text-base text-black placeholder:text-gray-500 rounded-tr-none rounded-br-none max-h-[32px]"
        />
        <button
          onClick={handleSearchClick}
          className="btn bg-accent text-base max-h-[32px] rounded-tl-none rounded-bl-none shadow-none outline-none"
          type="button"
        >
          Search
          <img src={IconSearch} className="h-[15px] w-[15px]" alt="Search" />
        </button>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              Loading products...
            </div>
          ) : error ? (
            <div className="px-4 py-8 text-center text-red-500">
              {error}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="overflow-y-auto max-h-96">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product.id)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent hover:text-white transition-colors border-b border-gray-200 last:border-b-0"
                >
                  {/* Product Image */}
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-200 flex items-center justify-center rounded">
                    {product.product_image_url ? (
                      <img
                        src={product.product_image_url}
                        alt={product.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>
                  
                  {/* Product Name */}
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-gray-200">
                      {product.product_category.title}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-sm font-semibold">
                    PHP {product.final_price}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              {searchTerm ? 'No products found' : 'Click Search to load products'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearchDropdown;
