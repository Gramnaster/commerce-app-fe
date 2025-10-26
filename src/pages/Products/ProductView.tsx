import { redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../features/cart/cartSlice';
import type { RootState } from '../../store';

interface ProductCategory {
  id: number;
  title: string;
}

interface Producer {
  id: number;
  title: string;
}

interface Product {
  id: number;
  title: string;
  product_category: ProductCategory;
  producer: Producer;
  description: string;
  price: number;
  promotion_id: boolean;
  product_image_url: string;
  discount_percentage?: number;
  final_price?: number;
}

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
  
  const { ProductDetails } = useLoaderData() as {
    ProductDetails: { data: Product };
  };

  const product = ProductDetails.data;
  const [amount, setAmount] = useState(1);

  // Generate amount options for the select dropdown
  const generateAmountOptions = (number: number) => {
    return Array.from({ length: number }, (_, index) => {
      const amount = index + 1;
      return (
        <option key={amount} value={amount}>
          {amount}
        </option>
      );
    });
  };

  const handleAmount = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmount(parseInt(e.target.value));
  };

  const addToCart = async () => {
    // Create cart product object with unique cartID
    const cartProduct = {
      cartID: product.id + product.title,
      productID: product.id,
      image: product.product_image_url,
      title: product.title,
      price: product.final_price || product.price,
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
    <div>
      <div>
        <div>Product Name: {product.title}</div>
        <img
          src={product.product_image_url}
          className="w-[100px]"
          alt={product.title}
        />
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
        <select
          className="select select-secondary select-bordered select-md"
          id="amount"
          value={amount}
          onChange={handleAmount}
        >
          {generateAmountOptions(20)}
        </select>
      </div>

      {/* CART BTN */}
      <div className="mt-10">
        <button className="btn btn-secondary btn-md" onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductView;
