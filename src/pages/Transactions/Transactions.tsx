import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import { store } from '../../store';
import { NavLink, redirect, useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PaginationControls } from '../../components';

export interface User {
  id: number;
  email: string;
}

export interface Order {
  id: number;
  cart_status: 'pending' | 'approved' | 'rejected';
  is_paid: boolean;
  total_cost: number;
  items_count: number;
  total_quantity: string;
}

export interface Transaction {
  id: number;
  transaction_type: 'deposit' | 'withdraw' | 'purchase' | 'donation';
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  created_at: string;
  user: User;
  order: Order | null;
}

export interface Pagination {
  current_page: number | null;
  per_page: number | null;
  total_entries: number | null;
  total_pages: number | null;
  next_page: number | null;
  previous_page: number | null;
}

interface TransactionResponse {
  data: Transaction[];
  pagination: Pagination;
}

export const loader =
  (queryClient: any) =>
  async ({ params }: any) => {
    const storeState = store.getState();
    const user = storeState.userState?.user;
    const id = params.id;

    if (!user) {
      // toast.warn('You must be logged in to checkout');
      return redirect('/login');
    }

    const TransactionsQuery = {
      queryKey: ['TransactionsQuery', id],
      queryFn: async () => {
        const response = await customFetch.get(`/receipts`, {
          headers: {
            Authorization: user?.token,
          },
        });
        console.log(`Transactions TransactionsQuery`, response.data);
        return response.data;
      },
    };

    try {
      const [TransactionReceipts] = await Promise.all([
        queryClient.ensureQueryData(TransactionsQuery),
      ]);
      console.log('Transactions TransactionReceipts :', TransactionReceipts);
      return { TransactionReceipts };
    } catch (error: any) {
      console.error('Failed to load transactions data:', error);
      toast.error('Failed to load transactions data');
      return { TransactionsReceipts: [] };
    }
  };

const Transactions = () => {
  const { TransactionReceipts: initialReceipts } = useLoaderData() as {
    TransactionReceipts: TransactionResponse;
  };
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(initialReceipts);
  
  console.log(`Transactions TransactionReceipts`, transactionData);

  // Update transactionData when loader fetches new data
  useEffect(() => {
    setTransactionData(initialReceipts);
  }, [initialReceipts]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getTransactionTypeDisplay = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'Purchase';
      case 'deposit':
        return 'Deposit';
      case 'withdraw':
        return 'Withdraw';
      case 'donation':
        return 'Donation';
      default:
        return type;
    }
  };

  const handlePagination = async (page: number | null) => {
    if (!page) return;
    setLoading(true);

    try {
      const storeState = store.getState();
      const user = storeState.userState?.user;

      const response = await customFetch.get(
        `/receipts?page=${page}&per_page=${transactionData.pagination.per_page || 20}`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
      const data = response.data;
      console.log('Transactions handlePagination - Response:', data);
      setTransactionData(data);
      setLoading(false);
    } catch (error: any) {
      console.error(
        'Transactions handlePagination - Failed to load pagination data:',
        error
      );
      toast.error('Failed to load pagination data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-base-content">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content px-6">
      <div className="max-w-7xl mx-auto mb-20">
        <div className="bg-transparent ">
          {/* Header */}
          <div className="px-6 pb-4 border-b border-gray-700 w-250">
            <div className="flex justify-between items-center">
              <h2 className="font-secondary text-xl font-semibold">TRANSACTIONS</h2>
              {/* <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Company Name or Ticker ID"
                    className="bg-transparent border border-gray-600 rounded-lg px-4 py-2 text-base-content placeholder-gray-400 w-100"
                  />
                  <svg
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div> */}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-250">
              <thead>
                <tr className="border-b text-base-content border-gray-700">
                  <th className="text-left pl-5 font-medium">Transaction Type</th>
                  <th className="text-right font-medium">Amount</th>
                  <th className="text-right p-4 font-medium">Order Status</th>
                  <th className="text-right p-4 font-medium">Date</th>
                  <th className="text-center p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactionData && transactionData.data.length > 0 ? (
                  transactionData.data.map(
                    (transaction: Transaction, index: number) => (
                      <tr
                        key={transaction.id}
                        className={`border-b border-gray-800 hover:bg-transparent transition-colors font-secondary${
                          index % 2 === 0 ? 'bg-transparent' : 'bg-transparent'
                        }`}
                      >
                        <td className="pl-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-sm font-medium capitalize ${
                              transaction.transaction_type === 'purchase'
                                ? 'text-green-600 font-bold'
                                : transaction.transaction_type === 'withdraw'
                                  ? 'text-red-600 font-bold'
                                  : transaction.transaction_type === 'deposit'
                                    ? 'text-blue-600 font-bold'
                                : transaction.transaction_type === 'donation'
                                  ? 'text-purple-600 font-bold'
                                  : 'text-gray-600 font-bold'
                            }`}
                          >
                            {getTransactionTypeDisplay(
                              transaction.transaction_type
                            )}
                          </span>
                        </td>
                        <td className="text-right text-base-content">
                          {/* {transaction.price_per_share && transaction.price_per_share !== '0.0'
                          ? `$${parseFloat(transaction.price_per_share).toFixed(2)}`
                          : '-'
                        } */}
                          <div className="text-right space-x-3">
                            {transaction.amount && transaction.amount !== 0
                              ? `PHP ${transaction.amount.toFixed(2)}`
                              : '-'}
                          </div>
                        </td>
                        <td className="p-4 text-right text-base-content font-medium capitalize">
                          {/* ${parseFloat(transaction.total_amount).toFixed(2)} */}
                          {transaction.order?.cart_status
                            ? transaction.order.cart_status
                            : '-'}
                        </td>
                        <td className="p-4 text-right text-base-content">
                          <div className="text-right">
                            <div>{formatDate(transaction.created_at)}</div>
                            <div className="text-sm text-base-content">
                              {formatTime(transaction.created_at)}
                            </div>
                          </div>
                        </td>
                        <td className='p-4 text-center text-base-content underline'>
                          <NavLink
                            to={`${transaction.id}`}
                            className={'hover:underline hover:cursor-pointer'}
                          >
                            View
                          </NavLink>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <PaginationControls
            pagination={transactionData.pagination}
            onPageChange={handlePagination}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
