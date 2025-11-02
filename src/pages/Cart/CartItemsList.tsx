import CartItem from './CartItem';
import type { CartItem as CartItemType } from './Cart';

interface CartItemsListProps {
  cartItems: CartItemType[];
  onUpdateQuantity: (cartItemId: number, newQty: number) => void;
  onRemove: (cartItemId: number) => void;
  updatingItems: Set<number>;
}

const CartItemsList = ({
  cartItems,
  onUpdateQuantity,
  onRemove,
  updatingItems,
}: CartItemsListProps) => {
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-base-content/70 mb-4">
          Add some items to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-4">
      {cartItems.map((cartItem) => (
        <CartItem
          key={cartItem.id}
          id={cartItem.id}
          qty={cartItem.qty}
          subtotal={cartItem.subtotal}
          product={cartItem.product}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          isUpdating={updatingItems.has(cartItem.id)}
        />
      ))}
    </div>
  );
};

export default CartItemsList;
