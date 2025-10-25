
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '../../utils';
import type { Product } from '../Products/Products';
import { NavLink } from 'react-router-dom';

const fetchProducts = async () => {
  const response = await customFetch.get('/products');
  return response.data.data;
};

const NewProducts = () => {

  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchProducts,
  });

  // Sort by updated_at descending and take the 5 most recent
  const recentProducts = [...allProducts]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <>
      {recentProducts.map((product: Product) => {
        const {
          id,
          title,
          product_category,
          producer,
          description,
          price,
          promotion_id,
          product_image_url,
        } = product;
        return (
          <div key={id}>
            <div>Product Name: {title}</div>
            <NavLink to={`/products/${id}`}>
              <img src={product_image_url} className="w-[100px]" />
            </NavLink>
            <div>Category: {product_category.title}</div>
            <div>Producer: {producer.title}</div>
            <div>Product Description:{description}</div>
            <div>Price: {price}</div>
            <div>{!promotion_id ? 'No active promotions' : 'WHAATTT'}</div>
          </div>
        );
      })}
    </>
  );
};
export default NewProducts;
