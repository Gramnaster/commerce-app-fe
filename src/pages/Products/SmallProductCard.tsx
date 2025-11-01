import { NavLink } from 'react-router-dom';
import type { Product } from './Products';

// Extended type to handle legacy promotion field from ProductsAll
interface ProductWithBooleanPromotion extends Product {
  promotion?: boolean | null;
}

interface SmallProductCardProps {
  product: Product | ProductWithBooleanPromotion;
}

const SmallProductCard = ({ product }: SmallProductCardProps) => {
  const { id, title, price, discount_percentage, product_image_url, promotion_id } = product;
  
  // Handle both promotion_id (canonical) and promotion (legacy) fields
  const hasPromotion = promotion_id || (product as ProductWithBooleanPromotion).promotion;

  return (
    <div className="font-secondary text-center">
      <NavLink to={`/products/${id}`}>
        <div className="bg-gray-400 p-2 flex items-center justify-center mb-[20px]">
          {product_image_url ? (
            <img
              src={product_image_url}
              className="w-[200px] h-[220px] object-contain"
              alt={title}
            />
          ) : (
            <div className="w-[200px] h-[220px] flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <div className="uppercase text-base text-black">
          {title.length > 20 ? title.slice(0, 20) + '. . .' : title}
        </div>
        <div className="font-secondary text-base font-extralight text-black">
          PHP {price}
          {hasPromotion && discount_percentage && (
            <span className="ml-2 text-green-600 font-semibold">
              ({discount_percentage}%)
            </span>
          )}
        </div>
      </NavLink>
    </div>
  );
};

export default SmallProductCard;
