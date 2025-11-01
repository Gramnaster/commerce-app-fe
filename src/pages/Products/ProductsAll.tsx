import { toast } from "react-toastify";
import { customFetch, sortProducts } from "../../utils";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Pagination } from "../Cart/Checkout";
import ProductCard from "./ProductCard";
import { PaginationControls } from "../../components";
import type { Product, ProductFilters } from "./Products";

export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export const loader = (queryClient: any, _store: any) => async () => {

  const allProductsQuery = {
    queryKey: ['allProducts'],
    queryFn: async () => {
      const response = await customFetch.get('/products');
      console.log('Products response.data:', response.data)
      return response.data;
    },
  };

  try {
    // Use fetchQuery instead of ensureQueryData to always fetch fresh data
    const allProducts = await queryClient.fetchQuery(allProductsQuery);

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

  // Update productData when loader fetches new data (when navigating to/from All Products)
  useEffect(() => {
    setProductData(initialProducts);
  }, [initialProducts]);

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

  // Filter by discounts and search, then sort using sortProducts() from utils/index.ts
  // Basic filters: promotion_id + discount_percentage > 0, and title search
  const filteredProducts = sortProducts(
    productData.data
      .filter((p: Product) => !filters.discountsOnly || (p.promotion_id && p.discount_percentage > 0))
      .filter((p: Product) => p.title.toLowerCase().includes(filters.search.toLowerCase())),
    filters.sortBy
  );
  
  console.log(`ProductsAll productData`, productData);

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
      
      <PaginationControls 
        pagination={productData.pagination} 
        onPageChange={handlePagination} 
      />
    </>
  );
}

export default ProductsAll