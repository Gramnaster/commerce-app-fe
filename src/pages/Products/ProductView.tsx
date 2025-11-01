import { redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../features/cart/cartSlice';
import type { RootState } from '../../store';
import { LoginCartModal } from '../../components';
import type { Product } from './Products';

export const loader =  (queryClient: any, store: any) =>  async ({ params }: any) => {
    const id = params.id;

    const ProductDetailsQuery = {
      queryKey: ['ProductDetails', id],
      queryFn: async () => {
        const response = await customFetch.get(`/products/${id}`);
        return response.data;
      },
    };

    try {
      const ProductDetails =
        await queryClient.ensureQueryData(ProductDetailsQuery);
      return { ProductDetails };
    } catch (error: any) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product details');
      return redirect('/products');
    }
};

const ProductView = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userState.user);
  
  console.log('ProductView: Component rendering');
  console.log('ProductView: User state:', user);
  
  const { ProductDetails } = useLoaderData() as {
    ProductDetails: { data: Product };
  };

  console.log('ProductView: ProductDetails loaded:', ProductDetails);
  console.log('ProductView: Product data:', ProductDetails?.data);

  const product = ProductDetails.data;
  const [amount, setAmount] = useState(1);

  const handleIncrement = () => {
    console.log('ProductView: Increment clicked, new amount:', amount + 1);
    setAmount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    console.log('ProductView: Decrement clicked, new amount:', Math.max(1, amount - 1));
    setAmount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = async () => {
    console.log('ProductView: Add to cart clicked');
    console.log('ProductView: User logged in?', !!user);
    
    // If user is not logged in, open modal instead
    if (!user) {
      console.log('ProductView: User not logged in, opening modal');
      const modal = document.getElementById('login_cart_modal') as HTMLDialogElement;
      console.log('ProductView: Modal element found:', !!modal);
      modal?.showModal();
      return;
    }

    // Create cart product object with unique cartID
    const cartProduct = {
      cartID: product.id + product.title,
      productID: product.id,
      image: product.product_image_url,
      title: product.title,
      price: typeof product.final_price === 'string' ? parseFloat(product.final_price) : product.price,
      amount,
      productCategory: product.product_category.title,
      producer: product.producer.title,
    };

    // Add to Redux store (which also syncs to localStorage)
    dispatch(addItem({ product: cartProduct }));

    // If user is logged in, sync to backend shopping cart
    if (user) {
      try {
        await customFetch.post('/shopping_cart_items', {
          shopping_cart_item: {
            product_id: product.id,
            qty: amount,
          },
        });
        console.log('Cart synced to backend');
      } catch (error: any) {
        console.error('Failed to sync cart to backend:', error);
        // Don't show error to user - cart still works via localStorage
      }
    }
  };

  console.log(`ProductView ProductDetails`, ProductDetails);
  return (
    <div className='text-base-content'>
      <div>
        <div>Product Name: {product.title}</div>
        {product.product_image_url ? (
          <img
            src={product.product_image_url}
            className="w-[100px]"
            alt={product.title}
          />
        ) : (
          <div className="w-[100px] h-[100px] flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
            No Image
          </div>
        )}
        <div>Category: {product.product_category.title}</div>
        <div>Producer: {product.producer.title}</div>
        <div>Product Description: {product.description}</div>
        <div>
          Price: ${product.final_price || product.price}
          {product.discount_percentage && product.discount_percentage > 0 && (
            <span className="ml-2 text-error">
              ({product.discount_percentage}% off)
            </span>
          )}
        </div>
        <div>
          {!product.promotion_id
            ? 'No active promotions'
            : 'Special Promotion!'}
        </div>
      </div>

      {/* AMOUNT */}
      <div className="form-control w-full max-w-xs mt-4">
        <label className="label" htmlFor="amount">
          <h4 className="text-md font-medium tracking-wider capitalize">
            Quantity:
          </h4>
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDecrement}
            className="btn btn-square bg-[#4d4d4d] text-white text-2xl hover:bg-[#3d3d3d] h-[22px] w-[22px]"
          >
            −
          </button>
          <div className="border-2 bg-white border-gray-400 rounded-lg px-6 py-1 text-center min-w-[100px] text-xl font-medium">
            {amount}x
          </div>
          <button
            type="button"
            onClick={handleIncrement}
            className="btn btn-square bg-[#4d4d4d] text-white text-2xl hover:bg-[#3d3d3d]"
          >
            +
          </button>
        </div>
      </div>

      {/* CART BTN */}
      <div className="mt-10">
        <button className="btn btn-secondary btn-md" onClick={addToCart}>
          Add to Cart
        </button>
      </div>

      {/* CART MODAL IF NOT LOGGED IN */}
      {/* If User !Login, Open Modal */}
      <LoginCartModal />
    </div>
  );
};

export default ProductView;
