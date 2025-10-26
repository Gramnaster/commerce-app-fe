import { toast } from "react-toastify";
import { customFetch } from "../../utils";
import { NavLink, useLoaderData } from "react-router-dom";

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
  promotion_id: boolean;
  product_image_url: string;
  updated_at: Date;
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
    allProducts: Product[]
  };
  console.log(`ProductsAll allProducts`, allProducts)

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr] gap-[20px] h-full grid-flow-row-dense align-element">
      {allProducts.data.map((product: Product) => {
        const {id, title, price, discount_percentage, product_image_url, promotion_id} = product
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

export default ProductsAll