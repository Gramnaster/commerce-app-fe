import { toast } from "react-toastify";
import { customFetch, sortProducts } from "../../utils";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import type { Pagination } from "../Cart/Checkout";
import ProductCard from "./ProductCard";
import { PaginationControls } from "../../components";
import type { Product, ProductFilters } from "./Products";

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export const loader = (queryClient: any, _store: any) => async () => {
  // Fetch ALL products at once for client-side filtering/sorting/pagination
  const allProductsQuery = {
    queryKey: ['allProducts'],
    queryFn: async () => {
      const response = await customFetch.get('/products?per_page=10000');
      console.log('ProductsAll loader - Total products fetched:', response.data.data?.length);
      return response.data;
    },
  };

  try {
    const allProducts = await queryClient.fetchQuery(allProductsQuery);
    console.log('ProductsAll loader - All products loaded:', allProducts.data.length);
    return { allProducts };
  } catch (error: any) {
    console.error('Failed to load Product data:', error);
    toast.error('Failed to load Product data');
    return { allProducts: { data: [], pagination: {} } };
  }
};

const ProductsAll = () => {
  const { allProducts } = useLoaderData() as {
    allProducts: ProductsResponse;
  };
  const { filters } = useOutletContext<{ filters: ProductFilters }>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Display 20 items per page

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.sortBy, filters.discountsOnly]);

  // Add safety check for allProducts.data
  if (!allProducts?.data) {
    return <div className="text-center py-10">No products available</div>;
  }

  // Client-side filtering and sorting using useMemo for performance
  const filteredAndSortedProducts = useMemo(() => {
    console.log('ProductsAll - Applying filters:', filters);
    
    // 1. Filter by discounts
    let filtered = allProducts.data.filter(
      (p: Product) =>
        !filters.discountsOnly ||
        (p.promotion_id && p.discount_percentage > 0)
    );

    // 2. Filter by search term
    filtered = filtered.filter((p: Product) =>
      p.title.toLowerCase().includes(filters.search.toLowerCase())
    );

    // 3. Sort using sortProducts utility
    const sorted = sortProducts(filtered, filters.sortBy);
    
    console.log('ProductsAll - Filtered/sorted products:', sorted.length);
    return sorted;
  }, [allProducts.data, filters.discountsOnly, filters.search, filters.sortBy]);

  // Client-side pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  const handlePagination = (page: number | null) => {
    if (!page || page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    console.log('ProductsAll - Navigated to page:', page);
  };

  // Create custom pagination object for PaginationControls component
  const customPagination: Pagination = {
    current_page: currentPage,
    per_page: itemsPerPage,
    total_entries: filteredAndSortedProducts.length,
    total_pages: totalPages,
    next_page: currentPage < totalPages ? currentPage + 1 : null,
    previous_page: currentPage > 1 ? currentPage - 1 : null,
  };

  return (
    <>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-[20px] h-full grid-flow-row-dense align-element">
        {paginatedProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-10 text-base-content">
          No products found matching your filters.
        </div>
      )}

      <PaginationControls
        pagination={customPagination}
        onPageChange={handlePagination}
      />
    </>
  );
}

export default ProductsAll