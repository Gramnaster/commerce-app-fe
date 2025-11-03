import { redirect, useLoaderData, useOutletContext } from "react-router-dom";
import { customFetch, sortProducts } from "../../utils";
import { toast } from "react-toastify";
import { useState, useEffect, useMemo } from "react";
import type { ProductCategory, Product, ProductFilters } from "./Products";
import type { Pagination } from "../Cart/Checkout";
import ProductCard from "./ProductCard";
import { PaginationControls } from "../../components";

// Type for the category details response from the API
interface CategoryDetailsResponse {
  data: ProductCategory & {
    products: Product[];
  };
  pagination?: Pagination;
}

export const loader = (queryClient: any) => async ({ params }: any) => {
  const id = params.id;

  // Fetch ALL products for this category at once for client-side filtering/sorting/pagination
  const CategoryViewQuery = {
    queryKey: ['CategoryDetails', id],
    queryFn: async () => {
      const response = await customFetch.get(`/product_categories/${id}?per_page=10000`);
      console.log(`ProductsPerCategory loader - Category ${id} products:`, response.data.data.products?.length);
      return response.data;
    },
  };

  try {
    const CategoryDetails = await queryClient.fetchQuery(CategoryViewQuery);
    return { CategoryDetails };
  } catch (error: any) {
    console.error('Failed to load category details:', error);
    toast.error('Failed to load category details');
    return redirect('/products');
  }
};

const ProductsPerCategory = () => {
  const { CategoryDetails } = useLoaderData() as {
    CategoryDetails: CategoryDetailsResponse;
  };
  const { filters } = useOutletContext<{ filters: ProductFilters }>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Display 20 items per page
  
  const { products } = CategoryDetails.data;
  const categoryId = CategoryDetails.data.id;

  // Reset to page 1 when filters change or when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.sortBy, filters.discountsOnly, categoryId]);

  // Client-side filtering and sorting using useMemo for performance
  const filteredAndSortedProducts = useMemo(() => {
    console.log('ProductsPerCategory - Applying filters:', filters);
    
    // 1. Filter by discounts
    let filtered = products.filter(
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
    
    console.log('ProductsPerCategory - Filtered/sorted products:', sorted.length);
    return sorted;
  }, [products, filters.discountsOnly, filters.search, filters.sortBy]);

  // Client-side pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  const handlePagination = (page: number | null) => {
    if (!page || page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
    console.log('ProductsPerCategory - Navigated to page:', page);
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
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-[20px] h-full grid-flow-row-dense align-element mb-3">
        {paginatedProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-10 text-base-content">
          No products found matching your filters in this category.
        </div>
      )}

      <PaginationControls
        pagination={customPagination}
        onPageChange={handlePagination}
      />
    </>
  );
};

export default ProductsPerCategory;