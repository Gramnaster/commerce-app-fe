import { Outlet, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import Sidebar from '../../components/Sidebar';
import ProductsBanner from './ProductsBanner';

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

export const loader = (queryClient: any) => async ({ params }: any) => {
  const id = params.id;

  const ProductCategoriesQuery = {
    queryKey: ['ProductCategoriesDetails', id],
    queryFn: async () => {
      const response = await customFetch.get(`/product_categories`);
      console.log(`Products product_categories`, response.data)
      return response.data;
    },
  };

  try {
    const [ProductCategories] = await Promise.all([
      queryClient.ensureQueryData(ProductCategoriesQuery)
    ]);
    console.log('Products ProductCategories :', ProductCategories)
    return { ProductCategories };
  } catch (error: any) {
    console.error('Failed to load Category data:', error);
    toast.error('Failed to load Category data');
    return { allProductCategories: [] };
  }
};

const Products = () => {
  const { ProductCategories } = useLoaderData() as {
    ProductCategories: { data: ProductCategory[] }
  };
  // const [products, setProducts] = useState(allProducts)
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // const filteredProducts = products.filter((product: Product) => selectedCategory ? product.product_category.title === selectedCategory : true );

  return (
    <div>
      <div className='mb-20'>
      <ProductsBanner />
      </div>
      <div className='grid grid-cols-[0.25fr_1fr] grid-rows-1 gap-0'>
        <Sidebar categoryData={ProductCategories.data} />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Products