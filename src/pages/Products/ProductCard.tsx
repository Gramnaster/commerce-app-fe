import { NavLink } from 'react-router-dom';
import type { Product } from './Products';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { id, title, price, discount_percentage, product_image_url, promotion_id } = product;

  return (
    <div className="font-secondary text-center">
      <NavLink to={`/products/${id}`}>
        <div className="bg-gray-400 p-2 flex items-center justify-center mb-[20px]">
          {product_image_url ? (
            <img
              src={product_image_url}
              className="w-[260px] h-[280px] object-contain"
              alt={title}
            />
          ) : (
            <div className="w-[260px] h-[280px] flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
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
      </NavLink>
    </div>
  );
};

export default ProductCard;
