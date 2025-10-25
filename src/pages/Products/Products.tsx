import { Outlet, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

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
  promotion_id: boolean;
  product_image_url: string;
  updated_at: Date;
}

export const loader = (queryClient: any, store: any) => async ({ params }: any) => {
  const storeState = store.getState();
  const user = storeState.userState?.user;
  console.log(`Products user`, user)

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

const Products = () => {
  const { allProducts } = useLoaderData() as {
    allProducts: Product[]
  };
  const [products, setProducts] = useState(allProducts)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = products.filter((product: Product) => selectedCategory ? product.product_category.title === selectedCategory : true );

  return (
    <>
      <Sidebar />
      <div>
        <Outlet />
      </div>
    </>
    // <div>      
    //   <button onClick={() => setSelectedCategory(null)}>All</button>
    //   <button onClick={() => setSelectedCategory("men's clothing")}>men's clothingg</button>
    //   <button onClick={() => setSelectedCategory("women's clothing")}>women's clothing</button>
    //   <button onClick={() => setSelectedCategory("jewelery")}>jewelery</button>
    //   <button onClick={() => setSelectedCategory("electronics")}>electronics</button>
    //   Products
    //   {filteredProducts.map((product: Product) => {
    //     const { id, title, product_category, producer, description, price, promotion_id, product_image_url } = product;
    //     return(
    //       <div key={id}>
    //         <div>Product Name: {title}</div>
    //         <NavLink to={`/products/${id}`}><img src={product_image_url} className="w-[100px]" /></NavLink>
    //         <div>Category: {product_category.title}</div>
    //         <div>Producer: {producer.title}</div>
    //         <div>Product Description:{description}</div>
    //         <div>Price: {price}</div>
    //         <div>{!promotion_id ? "No active promotions": "WHAATTT"}</div>
    //       </div>
    //     )
    //   })}

    // </div>
  )
}

export default Products