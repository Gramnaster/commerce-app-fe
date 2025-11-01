import { redirect, useLoaderData, useOutletContext } from "react-router-dom";
import { customFetch, sortProducts } from "../../utils";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
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

  const CategoryViewQuery = {
    queryKey: ['CategoryDetails', id],
    queryFn: async () => {
      const response = await customFetch.get(`/product_categories/${id}`);
      return response.data;
    },
  };

  try {
    // Use fetchQuery instead of ensureQueryData to always fetch fresh data
    const CategoryDetails = await queryClient.fetchQuery(CategoryViewQuery);
    console.log(`ProductsPerCategory CategoryDetails`, CategoryDetails.data)
    return { CategoryDetails };
  } catch (error: any) {
    console.error('Failed to load category details:', error);
    toast.error('Failed to load category details');
    return redirect('/products');
  }
};

const ProductsPerCategory = () => {
  const { CategoryDetails: initialCategoryDetails } = useLoaderData() as {
    CategoryDetails: CategoryDetailsResponse;
  }
  const { filters } = useOutletContext<{ filters: ProductFilters }>();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState(initialCategoryDetails);
  
  // Update categoryData when loader fetches new data (when navigating between categories)
  useEffect(() => {
    setCategoryData(initialCategoryDetails);
  }, [initialCategoryDetails]);
  
  const { products } = categoryData.data;
  const categoryId = categoryData.data.id;

  const handlePagination = async (page: number | null) => {
    if (!page) return;
    setLoading(true);
    
    try {
      const perPage = categoryData.pagination?.per_page || 10;
      const response = await customFetch.get(`/product_categories/${categoryId}?page=${page}&per_page=${perPage}`);
      const data = response.data;
      console.log('ProductsPerCategory handlePagination - Response:', data);
      setCategoryData(data);
      setLoading(false);
    } catch (error: any) {
      console.error('ProductsPerCategory handlePagination - Failed to load pagination data:', error);
      toast.error('Failed to load pagination data');
      setLoading(false);
    }
  };
  
  // Filter by discounts and search, then sort using sortProducts() from utils/index.ts
  // Basic filters: promotion_id + discount_percentage > 0, and title search
  const filteredProducts = sortProducts(
    products
      .filter(p => !filters.discountsOnly || (p.promotion_id && p.discount_percentage > 0))
      .filter(p => p.title.toLowerCase().includes(filters.search.toLowerCase())),
    filters.sortBy
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-black">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-[20px] h-full grid-flow-row-dense align-element mb-3">
        {filteredProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <PaginationControls 
        pagination={categoryData.pagination || { current_page: 1, per_page: 10, total_pages: 1, next_page: null, previous_page: null, total_entries: 0 }} 
        onPageChange={handlePagination} 
      />
    </>
  )
}

export default ProductsPerCategory