import { toast } from "react-toastify";
import { customFetch } from "../../utils";
import { NavLink, useLoaderData, useOutletContext } from "react-router-dom";
import type Products from "./Products";
import type { Pagination } from "../Cart/Checkout";

export interface ProductCategory {
  id: number;
  title: string;
}

export interface Producer {
  id: number;
  title: string;
}

export interface Product {
  id: number;
  title: string;
  product_category: ProductCategory;
  producer: Producer;
  description: string;
  price: number;
  final_price: string;
  discount_percentage: number;
  discount_amount_dollars: string;
  promotion: boolean | null;
  product_image_url: string;
  updated_at: Date;
}


export interface ProductsResponse {
  data: Product[];
  pagination: Pagination;
}

export const loader = (queryClient: any, store: any) => async ({ params }: any) => {
  const storeState = store.getState();
  const user = storeState.userState?.user;
  const id = params.id

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
    return { allStocks: [] };
  }
};

const ProductsAll = () => {
  const { allProducts } = useLoaderData() as {
    allProducts: ProductsResponse
  };
  const { filters } = useOutletContext<{ filters: { search: string; category: string | null; discountsOnly: boolean } }>();

  const filteredProducts = allProducts.data
    .filter((p: Product) => !filters.category || p.product_category.title === filters.category)
    .filter((p: Product) => !filters.discountsOnly || p.promotion !== null)
    .filter((p: Product) => p.title.toLowerCase().includes(filters.search.toLowerCase()));
  
  console.log(`ProductsAll allProducts`, allProducts)

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] gap-[20px] h-full grid-flow-row-dense align-element">
      {filteredProducts.map((product: Product) => {
        const {id, title, price, discount_percentage, product_image_url, product_category: { title: category_title }, promotion} = product
        return (
          <div key={id} className="font-secondary text-center ">
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
                {promotion && discount_percentage && (
                  <span className="ml-2 text-green-600 font-semibold">
                    ({discount_percentage}%)
                  </span>
                )}
              </div>
            </NavLink>
          </div>
        )
      })}
    </div>
  )
}

export default ProductsAll