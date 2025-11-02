import { NavLink } from 'react-router-dom';
import type { Product } from './Products';
import { ProductPrice } from '../../components';

// Extended type to handle legacy promotion field from ProductsAll
interface ProductWithBooleanPromotion extends Product {
  promotion?: boolean | null;
}

interface ProductCardProps {
  product: Product | ProductWithBooleanPromotion;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { id, title, price, discount_percentage, final_price, product_image_url } = product;
  
  // Limit title to 25 characters
  const truncatedTitle = title.length > 25 ? title.slice(0, 25) + '...' : title;

  return (
    <div className="font-secondary text-center">
      <NavLink to={`/products/${id}`}>
        <div className="bg-gray-400 w-[260px] h-[280px] p-2 flex items-center justify-center mb-[20px]">
          {product_image_url ? (
            <img
              src={product_image_url}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              decoding="async"
              alt={title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <div className="uppercase text-base text-base-content">
          {truncatedTitle}
        </div>
        <ProductPrice
          price={price}
          finalPrice={final_price}
          discountPercentage={discount_percentage}
        />
      </NavLink>
    </div>
  );
};

export default ProductCard;
