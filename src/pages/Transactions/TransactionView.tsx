import { redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import { IconLineDark, IconLineWhite } from '../../assets/images';

import { type Product } from '../Cart/Cart';

interface User {
  id: number;
  email: string;
}

interface Item {
  id: number;
  qty: string;
  title: string;
  price: number;
  subtotal: string;
  product: Product;
}

interface Order {
  id: number;
  cart_status: 'pending' | 'approved' | 'rejected';
  is_paid: boolean;
  total_cost: number;
  items_count: number;
  total_quantity: string;
  items: Item[];
}

interface Transaction {
  id: number;
  transaction_type: 'deposit' | 'withdraw' | 'purchase';
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  created_at: string;
  user: User;
  order: Order | null;
  items: Item[] | null;
}

export const loader =
  (queryClient: any, store: any) =>
  async ({ params }: any) => {
    const storeState = store.getState();
    const user = storeState.userState?.user;
    const id = params.id;

    const TransactionQuery = {
      queryKey: ['TransactionDetails', id],
      queryFn: async () => {
        const response = await customFetch.get(`/receipts/${id}`);
        return response.data;
      },
    };

    try {
      const TransactionDetails =
        await queryClient.ensureQueryData(TransactionQuery);
      return { TransactionDetails };
    } catch (error: any) {
      console.error('Failed to load transaction:', error);
      toast.error('Failed to load transaction details');
      return redirect('/profile/transactions');
    }
  };

const TransactionView = () => {
  const { TransactionDetails } = useLoaderData() as {
    TransactionDetails: Transaction;
  };
  console.log(`TransactionView TransactionDetails`, TransactionDetails);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };
  const {
    id,
    transaction_type,
    balance_before,
    balance_after,
    description,
    created_at,
    user: { email },
    order,
  } = TransactionDetails;
  const {
    id: order_id,
    cart_status,
    is_paid,
    total_cost,
    items,
    items_count,
    total_quantity,
  } = order ?? {};
  console.log(`TransactionView order`, order);
  console.log(`TransactionView items`, items);

  // const { qty, subtotal, product} = items ?? {};
  // const { title, price} = product ?? {};

  return (
    <div className="min-h-screen bg-base-100 text-2xl text-base-content p-6 align-element">
      <div className="font-primary text-3xl text-center">ORDER #{id}</div>

      <table className="">
        <tbody>
          <tr>
            <th className="text-left">Transaction Type: </th>
            <td>{transaction_type}</td>
          </tr>

          <tr>
            <th className="text-left">Description: </th>
            <td>{description}</td>
          </tr>

          <tr>
            <th className="text-left">Transaction created:</th>
            <td>{formatDate(created_at)}</td>
          </tr>

          <tr>
            <th className="text-left">Cart Status:</th>
            <td>{cart_status}</td>
          </tr>

          <tr>
            <th className="text-left">Paid?</th>
            <td>{is_paid ? 'Yes' : 'Unpaid'}</td>
          </tr>

          {items && items.length > 0
            ? items.map((item) => {
                const { id, qty, subtotal, product } = item;
                const { title, price: product_price } = product;
                return (
                  <tr key={id}>
                    <th className="text-left">Items:</th>
                    <td>{title} </td>
                    <td>
                      Quantity: {qty} Subtotal: {subtotal}
                    </td>
                  </tr>
                );
              })
            : 'huh'}

          <tr>
            <th className="text-left">Order total</th>
            <td>{total_cost}</td>
          </tr>
        </tbody>
      </table>
      {/* <div>{balance_before}- {balance_after}+</div> */}
      {/* <div>{formatDate(created_at)}</div> */}
      {/* <div>{email}</div> */}
      {/* <div>{order_id}</div> */}
      {/* <div>{cart_status}</div>
      <div>{is_paid}</div>
      <div>{total_cost}</div> */}
      {/* <div>{items_count}</div>
      <div>{total_quantity}</div> */}
    </div>
  );
};

export default TransactionView;
