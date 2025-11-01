import { toast } from "react-toastify";
import { customFetch } from "../../utils";
import { useLoaderData, useOutletContext } from "react-router-dom";
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
  const { allProducts } = useLoaderData() as {
    allProducts: ProductsResponse
  };
  const { filters } = useOutletContext<{ filters: ProductFilters }>();

  // Add safety check for allProducts.data
  if (!allProducts?.data) {
    return <div className="text-center py-10">No products available</div>;
  }

  const filteredProducts = allProducts.data
    .filter((p: Product) => !filters.category || p.product_category.title === filters.category)
    .filter((p: Product) => !filters.discountsOnly || p.promotion_id !== null)
    .filter((p: Product) => p.title.toLowerCase().includes(filters.search.toLowerCase()));
  
  console.log(`ProductsAll allProducts`, allProducts)

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] gap-[20px] h-full grid-flow-row-dense align-element">
      {filteredProducts.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductsAll