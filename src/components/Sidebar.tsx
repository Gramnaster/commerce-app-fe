// import { useState } from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import type {
  ProductCategory,
  ProductFilters,
} from '../pages/Products/Products';
import SidebarDropdown from './SidebarDropdown';

interface SidebarProps {
  categoryData: ProductCategory[];
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
}

const Sidebar = ({ categoryData, filters, setFilters }: SidebarProps) => {
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // const [searchWord, setSearchWord] = useState('');

  // Check if we're on a product detail page like '/products/123'
  // useMatch checks if route matches a pattern
  const isProductDetailPage = useMatch('/products/:id');

  return (
    <div className="h-full">
      <div className="h-[468px] border-r border-[#808080] ">
        <div className="rounded-lg">
          <div className="flex items-centergap-4">
            {/* Search Options - Only show on category pages, not product detail pages */}
            {!isProductDetailPage && (
              <div className="">
                <div className="flex-1 relative font-bold flex flex-col justify-end items-end">
                  <SidebarDropdown
                    selectedOption={filters.sortBy}
                    onOptionChange={(sortBy) =>
                      setFilters((prev) => ({ ...prev, sortBy }))
                    }
                  />
                </div>
                <div className="flex-1 relative font-bold flex flex-col justify-end items-end">
                  {/* WIP - PRODUCT FILTERS */}
                  <input
                    type="text"
                    placeholder="Filter by Products . . ."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="place bg-white border-1 border-[#B3B3B3] font-normal italic rounded-[50px] py-2 pl-10 pr-3 text-center h-[30px] text-black placeholder-[#B3B3B3] w-[220px]"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#B3B3B3]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 relative font-bold flex flex-col justify-end items-end mt-2">
                  {/* WIP - DISCOUNTS ONLY BUTTON */}
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-black">
                      Show only items with discounts
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.discountsOnly}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          discountsOnly: e.target.checked,
                        }))
                      }
                      data-theme="light"
                      className="rounded-[10px] border border-[#c6c6c6] w-[20px] h-[20px]"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* <button className="p-3 bg-[#924b43] hover:bg-[#743b35] border border-[#75332d] rounded-lg hover:cursor-pointer transition-colors">
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button> */}
          </div>
        </div>
        <div className="font-bold flex flex-col justify-end items-end mr-4 text-black">
          <h3 className="font-primary font-light text-[24px]">Categories</h3>
          {/* All Categories Link - Navigates to /products which shows ALL products */}
          <NavLink
            to="/products"
            end
            className={({ isActive }) =>
              `m-1 rounded-2xl hover:cursor-pointer hover:underline text-[16px] ${
                isActive ? 'font-bold' : 'font-light'
              }`
            }
          >
            All
          </NavLink>
          {/* Individual Category Links */}
          {categoryData.map((category: ProductCategory) => {
            const { id, title } = category;
            return (
              <NavLink
                to={`/products/categories/${id}`}
                className={({ isActive }) =>
                  `m-1 rounded-2xl hover:cursor-pointer hover:underline capitalize font-secondary text-[16px] ${
                    isActive ? 'font-bold' : 'font-light'
                  }`
                }
                key={id}
              >
                {title}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
