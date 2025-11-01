import { Outlet, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import Sidebar from '../../components/Sidebar';
import ProductsBanner from './ProductsBanner';
import { useState } from 'react';
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

  const [filters, setFilters] = useState({
    search: '',
    category: null as string | null,
    discountsOnly: false,
  });

  return (
    <div>
      <div className='mb-10'>
      <ProductsBanner />
      </div>
      <div className='align-element grid grid-cols-[0.25fr_1fr] grid-rows-1 gap-6 mb-25'>
        <Sidebar categoryData={ProductCategories.data} filters={filters} setFilters={setFilters}  />
        <div>
          <Outlet context={{ filters, setFilters }} />
        </div>
      </div>
    </div>
  )
}

export default Products