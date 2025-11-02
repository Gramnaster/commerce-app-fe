import { formatPrice } from '../utils';

interface ProductPriceProps {
  price: number;
  finalPrice: string | number;
  discountPercentage: number;
  className?: string;
  priceSize?: string;
  discountSize?: string;
}

const ProductPrice = ({
  price,
  finalPrice,
  discountPercentage,
  className = '',
  priceSize = 'text-base',
  discountSize = 'text-sm',
}: ProductPriceProps) => {
  const finalPriceNumber = typeof finalPrice === 'string' ? parseFloat(finalPrice) : finalPrice;

  return (
    <div className={`font-secondary font-extralight text-base-content ${className}`}>
      {discountPercentage > 0 ? (
        <>
          <span className={priceSize}>PHP {formatPrice(finalPriceNumber)}</span>{' '}
          <span className={`font-semibold ${discountSize}`}>
            (-{discountPercentage}%)
          </span>
        </>
      ) : (
        <span className={priceSize}>PHP {formatPrice(price)}</span>
      )}
    </div>
  );
};

export default ProductPrice;
