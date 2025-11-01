import { Outlet, useLoaderData, useMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import Sidebar from '../../components/Sidebar';
import ProductsBanner from './ProductsBanner';
import { useState } from 'react';
export interface ProductCategory {
  id: number;
  title: string;
}

export interface Address {
  id: number;
  unit_no: string;
  street_no: string;
  barangay: string;
  city: string;
  zipcode: string;
  country: string;
}

export interface Producer {
  id: number;
  title: string;
  address: Address;
}

export type SortOption = 
  | 'a-z' 
  | 'z-a' 
  | 'price-high' 
  | 'price-low' 
  | 'newest' 
  | 'oldest';

export interface ProductFilters {
  search: string;
  category: string | null;
  discountsOnly: boolean;
  sortBy: SortOption;
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
  created_at: string;
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

  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: null,
    discountsOnly: false,
    sortBy: 'newest',
  });

  // Check if we're on a product detail page because I'm super picky about styling
  const isProductDetailPage = useMatch('/products/:id');
  const maxWidthClass = isProductDetailPage ? 'max-w-5xl' : 'max-w-7xl';

  return (
    <div>
      <div className="mb-10">
        <ProductsBanner />
      </div>
      <div
        className={`mx-auto ${maxWidthClass} px-8 grid grid-cols-[0.25fr_1fr] grid-rows-1 gap-6 mb-25`}
      >
        <Sidebar
          categoryData={ProductCategories.data}
          filters={filters}
          setFilters={setFilters}
        />
        <div>
          <Outlet context={{ filters, setFilters }} />
        </div>
      </div>
    </div>
  );
}

export default Products