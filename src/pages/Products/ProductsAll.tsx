import { toast } from "react-toastify";
import { customFetch } from "../../utils";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { useState } from "react";
import type { Pagination } from "../Cart/Checkout";
import ProductCard from "./ProductCard";
import type { Product, ProductFilters } from "./Products";

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export const loader = (queryClient: any, store: any) => async ({ params }: any) => {

  const allProductsQuery = {
    queryKey: ['allProducts'],
    queryFn: async () => {
      const response = await customFetch.get('/products');
      console.log('Products response.data:', response.data)
      return response.data;
    },
  };

  try {
    const [allProducts] = await Promise.all([
      queryClient.ensureQueryData(allProductsQuery)
    ]);

    console.log('allProducts :', allProducts)
    return { allProducts };
  } catch (error: any) {
    console.error('Failed to load Product data:', error);
    toast.error('Failed to load Product data');
    return { allProducts: { data: [], pagination: {} } };
  }
};

const ProductsAll = () => {
  const { allProducts: initialProducts } = useLoaderData() as {
    allProducts: ProductsResponse
  };
  const { filters } = useOutletContext<{ filters: ProductFilters }>();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(initialProducts);

  // Add safety check for productData.data
  if (!productData?.data) {
    return <div className="text-center py-10">No products available</div>;
  }

  const handlePagination = async (page: number | null) => {
    if (!page) return;
    setLoading(true);
    
    try {
      const response = await customFetch.get(`/products?page=${page}&per_page=${productData.pagination.per_page || 10}`);
      const data = response.data;
      console.log('ProductsAll handlePagination - Response:', data);
      setProductData(data);
      setLoading(false);
    } catch (error: any) {
      console.error('ProductsAll handlePagination - Failed to load pagination data:', error);
      toast.error('Failed to load pagination data');
      setLoading(false);
    }
  };

  const filteredProducts = productData.data
    .filter((p: Product) => !filters.discountsOnly || p.promotion_id !== null)
    .filter((p: Product) => p.title.toLowerCase().includes(filters.search.toLowerCase()));
  
  console.log(`ProductsAll productData`, productData);

  const { current_page, total_pages, next_page, previous_page } = productData.pagination || {
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
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-[20px] h-full grid-flow-row-dense align-element">
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
  );
}

export default ProductsAll