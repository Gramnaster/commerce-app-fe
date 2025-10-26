import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { customFetch } from "../../utils";
import { toast } from "react-toastify";
import type { ProductCategory } from "./Products";

interface ProductCategory {
  id: number;
  title: string;
}

interface Producer {
  id: number;
  title: string;
}

interface Product {
  id: number;
  title: string;
  product_category: ProductCategory;
  producer: Producer;
  description: string;
  price: number;
  promotion_id: boolean;
  product_image_url: string;
  created_at: string;
}

export const loader = (queryClient: any, store: any) => async ({ params }: any) => {
  const storeState = store.getState();
  const admin_user = storeState.userState?.user;

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
    return { CategoryDetails };
  } catch (error: any) {
    console.error('Failed to load category details:', error);
    toast.error('Failed to load category details');
    return redirect('/products');
  }
};

const ProductsPerCategory = () => {
  const { CategoryDetails } = useLoaderData() as {
    CategoryDetails: ProductCategory;
  }
  const navigate = useNavigate();
  const { id, title, products_count, created_at } = CategoryDetails.data;

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] grid-rows-4 gap-0 h-full">
      <div>
        ProductsPerCategory
        {/* {image} */}
        {id}
        {title}
        {products_count}
        {created_at}
      </div>
    </div>
  )
}

export default ProductsPerCategory