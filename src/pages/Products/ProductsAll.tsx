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
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-4 gap-0 h-full">
      {allProducts.data.map((product: Product) => {
        const {id, title, price, final_price, discount_percentage, discount_amount_dollars, product_image_url} = product
        return (
          <div key={id} className="p-1 w-[350px] h-[350px]">
            <div><img src={product_image_url} className="max-w-[200px]" /></div>
            <div><NavLink to={`/products/${id}`}>{title}</NavLink></div>
            <div>
              <span>{price}</span>
              <span>{final_price}</span>
              <span>{discount_percentage}</span>
              <span>{discount_amount_dollars}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductsAll