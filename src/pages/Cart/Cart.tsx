import { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  title: string;
  price: number;
  qty: number;
  product_image_url: string;
}


const Cart = () => {
  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

    const increaseQty = (id: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div>
      {
      cart.length !== 0 ? cart.map((cartItem: CartItem) => {
        return(
          <div key={cartItem.id}>
              <div>{cartItem.title}</div>
              <div>{cartItem.price}</div>
              <div>{cartItem.qty}</div>
              <img src={cartItem.product_image_url} className="w-[100px]" />
              <button onClick={() => decreaseQty(cartItem.id)}>-</button>
              <button onClick={() => increaseQty(cartItem.id)}>+</button>
              <button onClick={() => removeItem(cartItem.id)}>Remove Item</button>
          </div>
 
        )
      }) : 
      (<div>Cart is empty</div>)
      }
      Total: {total}
    </div>
  )
}

export default Cart