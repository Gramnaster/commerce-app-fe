import { redirect, useLoaderData, useOutletContext } from "react-router-dom";
import { customFetch } from "../../utils";
import { toast } from "react-toastify";
import { useState } from "react";
import type { ProductCategory, Product, ProductFilters } from "./Products";
import type { Pagination } from "../Cart/Checkout";
import ProductCard from "./ProductCard";

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
    const CategoryDetails = await queryClient.ensureQueryData(CategoryViewQuery);
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
  
  const filteredProducts = products
    .filter(p => !filters.discountsOnly || p.promotion_id !== null)
    .filter(p => p.title.toLowerCase().includes(filters.search.toLowerCase()));

  const { current_page, total_pages, next_page, previous_page } = categoryData.pagination || {
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    next_page: null,
    previous_page: null
  };

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

      {/* Pagination Controls */}
      {total_pages && total_pages > 1 && (
        <div className="join mt-6 flex justify-center">
          <input
            className="join-item btn btn-square border-black" 
            type="radio" 
            name="options" 
            onClick={() => handlePagination(previous_page)}
            disabled={!previous_page}
            aria-label="❮" 
          />
          {[...Array(total_pages).keys()].map((_, i) => {
            const pageNum = i + 1;
            return (
              <input 
                key={i} 
                className="join-item btn btn-square border-black" 
                type="radio" 
                name="options" 
                checked={current_page === pageNum}
                onClick={() => handlePagination(pageNum)}
                aria-label={`${pageNum}`} 
                readOnly
              />
            );
          })}
          <input
            className="join-item btn btn-square border-black" 
            type="radio" 
            name="options" 
            onClick={() => handlePagination(next_page)}
            disabled={!next_page}
            aria-label="❯" 
          />
        </div>
      )}
    </>
  )
}

export default ProductsPerCategory