import type { Product } from './Cart';

interface CartItemProps {
  id: number;
  qty: string;
  subtotal: string;
  product: Product;
  onUpdateQuantity: (cartItemId: number, newQty: number) => void;
  onRemove: (cartItemId: number) => void;
  isUpdating: boolean;
}

const CartItem = ({
  id,
  qty,
  subtotal,
  product,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: CartItemProps) => {
  const quantity = parseInt(qty);

  return (
    <div className="card bg-[#f3f3f3]">
      <div className="card-body p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 flex-shrink-0 bg-gray-400 flex items-center justify-center">
            {product.product_image_url ? (
              <img
                src={product.product_image_url}
                alt={product.title}
                className="w-full h-full object-contain"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="text-gray-500 text-xs">No Image</span>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 text-base-content">
              {product.title}
            </h3>

            {/* Price Info */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-base-content">
                PHP {parseFloat(product.price).toFixed(2)}
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(id, quantity - 1)}
                  disabled={quantity <= 1 || isUpdating}
                  className="btn btn-square bg-[#4d4d4d] text-white text-2xl hover:bg-[#3d3d3d] h-[30px] w-[30px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <div className="border-2 font-secondary text-black text-[16px] items-center bg-white border-gray-400 rounded-lg px-6 py-2 text-center min-w-[70px] text-xl font-medium h-[40px]">
                  {quantity}x
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(id, quantity + 1)}
                  disabled={isUpdating}
                  className="btn btn-square bg-[#4d4d4d] text-white text-2xl hover:bg-[#3d3d3d] h-[30px] w-[30px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-ghost btn-sm text-error"
                onClick={() => onRemove(id)}
              >
                Remove
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="font-bold text-lg text-base-content">
              PHP {parseFloat(subtotal).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
