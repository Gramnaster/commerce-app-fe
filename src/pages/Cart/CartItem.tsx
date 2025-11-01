import type { Product } from './Cart';

interface CartItemProps {
  id: number;
  qty: string;
  subtotal: string;
  product: Product;
  onUpdateQuantity: (cartItemId: number, newQty: number) => void;
  onRemove: (cartItemId: number) => void;
}

const CartItem = ({
  id,
  qty,
  subtotal,
  product,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const quantity = parseInt(qty);

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={product.product_image_url}
              alt={product.title}
              className="w-full h-full object-cover rounded"
            />
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
              <div className="join">
                <button
                  className="btn btn-sm join-item"
                  onClick={() => onUpdateQuantity(id, quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="text"
                  className="input input-sm join-item w-16 text-center"
                  value={quantity}
                  readOnly
                />
                <button
                  className="btn btn-sm join-item"
                  onClick={() => onUpdateQuantity(id, quantity + 1)}
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
