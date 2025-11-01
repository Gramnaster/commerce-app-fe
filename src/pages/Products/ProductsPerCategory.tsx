import { redirect, useLoaderData, useOutletContext } from "react-router-dom";
import { customFetch } from "../../utils";
import { toast } from "react-toastify";
import type { ProductCategory, Product } from "./Products";
import ProductCard from "./ProductCard";

// Type for the category details response from the API
interface CategoryDetailsResponse {
  data: ProductCategory & {
    products: Product[];
  };
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
  const { CategoryDetails } = useLoaderData() as {
    CategoryDetails: CategoryDetailsResponse;
  }
  const { filters } = useOutletContext<{ filters: { search: string; category: string | null; discountsOnly: boolean } }>();
  const { products } = CategoryDetails.data;
  
  const filteredProducts = products
    .filter(p => !filters.category || p.product_category.title === filters.category)
    .filter(p => !filters.discountsOnly || p.promotion_id !== null)
    .filter(p => p.title.toLowerCase().includes(filters.search.toLowerCase()));

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] gap-[20px] h-full grid-flow-row-dense align-element mb-3">
      {filteredProducts.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductsPerCategory