import { redirect, useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../../utils";


interface User {
  id: number;
  email: string;
}

interface Order {
  id: number;
  cart_status: 'pending' | 'approved' | 'rejected';
  is_paid: boolean;
  total_cost: number;
  items_count: number;
  total_quantity: string;
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
}

export const loader =  (queryClient: any, store: any) =>  async ({ params }: any) => {
    const storeState = store.getState();
    const user = storeState.userState?.user;
    const id = params.id;

    const TransactionQuery = {
      queryKey: ['ProductDetails', id],
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
      return redirect('/transactions');
    }
};

const TransactionView = () => {
  const { TransactionDetails } = useLoaderData() as{
    TransactionDetails: Transaction
  }
  const { id, transaction_type, balance_before, balance_after, description, created_at, user: { email }, order } = TransactionDetails
  const { id: order_id, cart_status, is_paid, total_cost, items_count, total_quantity } = order ?? {};
  return (
    <div className='min-h-screen bg-base-100 text-black p-6'>
      <div>ORDER #{id}</div>
      <div>Transaction Type: {transaction_type}</div>
      <div>{balance_before}- {balance_after}+</div>
      <div>{description}</div>
      <div>{created_at}</div>
      <div>{email}</div>
      <div>{order_id}</div>
      <div>{cart_status}</div>
      <div>{is_paid}</div>
      <div>{total_cost}</div>
      <div>{items_count}</div>
      <div>{total_quantity}</div>
    </div>
  )
}

export default TransactionView