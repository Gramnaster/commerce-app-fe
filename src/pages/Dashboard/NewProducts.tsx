import { useQuery } from '@tanstack/react-query';
import { customFetch } from '../../utils';
import type { Product } from '../Products/Products';
import { NavLink } from 'react-router-dom';
import { IconLineWhite } from '../../assets/images';

const fetchProducts = async () => {
  const response = await customFetch.get('/products/top_newest');
  return response.data.data;
};

const NewProducts = () => {
  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchProducts,
  });

  // Sort by updated_at descending and take the 5 most recent
  const recentProducts = [...allProducts]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 4);

  return (
    <section className="bg-primary h-[650px] flex flex-col justify-center items-center">
      <div className="flex justify-center align-middle flex-col mb-[55px]">
        <h2 className="font-primary text-white text-2xl text-center">
          NEWEST PRODUCTS
        </h2>
        <div className="relative h-[11px] w-[67px] mx-auto">
          <img
            src={IconLineWhite}
            className="icon-line-dark h-[11px] w-[67px] mx-auto"
          />
        </div>
      </div>
      <div className="flex flex-row justify-center items-center gap-[20px]">
        {/* If error, loads the rest of the background but leaves it empty */}
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading products</div>
        ) : (
          recentProducts.map((product: Product) => {
            const {
              id,
              title,
              price,
              promotion_id,
              product_image_url,
              discount_percentage,
            } = product;
            return (
              <div key={id} className="font-secondary text-center ">
                <NavLink to={`/products/${id}`}>
                  <div className="bg-gray-400 p-2 flex items-center justify-center mb-[20px]">
                    <img
                      src={product_image_url}
                      className="w-[280px] h-[280px] object-contain"
                      alt={title}
                    />
                  </div>
                  <div className="uppercase text-base">
                    {title.length > 25 ? title.slice(0, 25) + '. . .' : title}
                  </div>
                  <div className="font-secondary text-base font-extralight">
                    {price}
                    {promotion_id && discount_percentage && (
                      <span className="ml-2 text-green-600 font-semibold">
                        ({discount_percentage}%)
                      </span>
                    )}
                  </div>
                  {/* <div>{!promotion_id ? 'No active promotions' : ''}</div> */}
                </NavLink>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
export default NewProducts;
