import { NavLink, redirect, useLoaderData, useOutletContext } from "react-router-dom";
import { customFetch } from "../../utils";
import { toast } from "react-toastify";
import type { ProductCategory, Product } from "./Products";

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
        {filteredProducts.map((product: Product) => {
        const {id, title, price, discount_percentage, product_image_url, promotion_id} = product
          return (
              <div key={id} className="font-secondary text-center">
                <NavLink to={`/products/${id}`}>
                  <div className="bg-gray-400 p-2 flex items-center justify-center mb-[20px]">
                    <img
                      src={product_image_url}
                      className="w-[260px] h-[280px] object-contain"
                      alt={title}
                    />
                  </div>
                  <div className="uppercase text-base text-black">
                    {title.length > 25 ? title.slice(0, 25) + '. . .' : title}
                  </div>
                  <div className="font-secondary text-base font-extralight text-black">
                    PHP {price}
                    {promotion_id && discount_percentage && (
                      <span className="ml-2 text-green-600 font-semibold">
                        ({discount_percentage}%)
                      </span>
                    )}
                  </div>
                  {/* <div>{!promotion_id ? 'No active promotions' : ''}</div> */}
                </NavLink>
              </div>
          )
        })}
      </div>
  )
}

export default ProductsPerCategory