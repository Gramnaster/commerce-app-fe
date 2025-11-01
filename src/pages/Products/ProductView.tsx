import { redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../features/cart/cartSlice';
import type { RootState } from '../../store';
import { LoginCartModal } from '../../components';
import type { Product } from './Products';
import ProductDetailsSection from './ProductDetails';

export const loader =
  (queryClient: any, store: any) =>
  async ({ params }: any) => {
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
    console.log(
      'ProductView: Decrement clicked, new amount:',
      Math.max(1, amount - 1)
    );
    setAmount((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addToCart = async () => {
    console.log('ProductView: Add to cart clicked');
    console.log('ProductView: User logged in?', !!user);

    // If user is not logged in, open modal instead
    if (!user) {
      console.log('ProductView: User not logged in, opening modal');
      const modal = document.getElementById(
        'login_cart_modal'
      ) as HTMLDialogElement;
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
      price:
        typeof product.final_price === 'string'
          ? parseFloat(product.final_price)
          : product.price,
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
    <div className="text-base-content">
      {/* MAIN PRODUCT INFO CONTAINER */}
      <section className="flex flex-row mb-20">
        {/* PRODUCT IMAGE */}
        {product.product_image_url ? (
          <img
            src={product.product_image_url}
            className="bg-gray-400  w-[400px] outline-1 p-5 mr-[20px]"
            alt={product.title}
          />
        ) : (
          <div className="bg-gray-400 w-[100px] h-[100px] flex items-center justify-center bg-gray-200 text-gray-500 text-sm mr-[20px]">
            No Image
          </div>
        )}

        {/* PRODUCT MAIN DETAILS */}
        <div className="flex flex-col">
          <h2 className="font-primary text-[32px] font-semibold">
            {product.title}
          </h2>
          {/* <div>Category: {product.product_category.title}</div> */}
          <h4 className="font-primary text-[16px] mb-[25px]">
            By {product.producer.title}
          </h4>
          <p className="font-secondary mb-[45px]">
            {product.description.split('. ').slice(0, 2).join('. ')}
            {product.description.split('. ').length > 2 ? '.' : ''}
          </p>
          <div className="font-secondary text-[32px] mb-[35px] flex justify-end item-end text-right">
            {product.promotion_id && product.discount_percentage > 0 ? (
              <>
                <span className="line-through text-gray-500 mr-4 ">
                  ${product.price}
                </span>
                <span className="text-error font-bold">
                  ${product.final_price}
                </span>
              </>
            ) : (
              <span>${product.price}</span>
            )}
          </div>

          {/* AMOUNT */}
          <div className="form-control w-full max-w-xs mt-4 flex flex-row">
            <label className="label" htmlFor="amount">
              <p className="font-secondary text-[16px] font-medium tracking-wider capitalize mr-4">
                Qty:
              </p>
            </label>
            <div className="flex items-center gap-2 mr-5">
              <button
                type="button"
                onClick={handleDecrement}
                className="btn btn-square bg-[#4d4d4d] text-white text-2xl hover:bg-[#3d3d3d] h-[30px] w-[30px]"
              >
                −
              </button>
              <div className="border-2 font-secondary text-[16px] items-center bg-white border-gray-400 rounded-lg px-6 py-2 text-center min-w-[70px] text-xl font-medium h-[40px]">
                {amount}x
              </div>
              <button
                type="button"
                onClick={handleIncrement}
                className="btn btn-square bg-[#4d4d4d] text-white text-2xl hover:bg-[#3d3d3d] h-[30px] w-[30px]"
              >
                +
              </button>
            </div>
            {/* CART BTN */}
            <div className="w-[200px]">
              <button
                className="btn btn-secondary btn-md w-[110px] h-[40px] min-h-[40px] max-h-[40px] shadow-none"
                onClick={addToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* COMPLETE PRODUCT DETAILS */}
      <ProductDetailsSection product={product} />

      {/* CART MODAL IF NOT LOGGED IN */}
      {/* If User !Login, Open Modal */}
      <LoginCartModal />
    </div>
  );
};

export default ProductView;
