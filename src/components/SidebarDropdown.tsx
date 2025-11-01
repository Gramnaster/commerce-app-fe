import React from 'react';
import type { SortOption } from '../pages/Products/Products';

interface SidebarDropdownProps {
  selectedOption: SortOption;
  onOptionChange: (option: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'a-z', label: 'A...Z' },
  { value: 'z-a', label: 'Z...A' },
  { value: 'price-high', label: 'Highest Price' },
  { value: 'price-low', label: 'Lowest Price' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

const SidebarDropdown = ({ selectedOption, onOptionChange }: SidebarDropdownProps) => {
  const selectedLabel = sortOptions.find(opt => opt.value === selectedOption)?.label || 'Featured';

  const handleOptionClick = (option: SortOption) => {
    onOptionChange(option);
    // Close the popover after selection
    const popover = document.getElementById('sort-popover') as HTMLElement & { hidePopover?: () => void };
    if (popover && popover.hidePopover) {
      popover.hidePopover();
    }
  };

  return (
    <>
      {/* Dropdown Button */}
      <button 
        className="border-1 border-[#B3B3B3] text-[1rem] text-right p-2 mb-2 text-black bg-white w-[220px] rounded-md hover:bg-gray-50 transition-colors"
        // @ts-ignore - popoverTarget is a valid HTML attribute
        popoverTarget="sort-popover"
        style={{ anchorName: '--sort-anchor' } as React.CSSProperties}
      >
        {selectedLabel}
      </button>

      {/* Dropdown Menu */}
      <ul 
        className="dropdown menu w-52 rounded-box bg-base-100 shadow-lg border border-gray-200"
        // @ts-ignore - popover is a valid HTML attribute
        popover="auto"
        id="sort-popover"
        style={{ positionAnchor: '--sort-anchor' } as React.CSSProperties}
      >
        {sortOptions.map((option) => (
          <li key={option.value}>
            <a
              onClick={() => handleOptionClick(option.value)}
              className={`${selectedOption === option.value ? 'active font-bold' : ''}`}
            >
              {option.label}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;
