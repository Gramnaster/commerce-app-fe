import React from 'react'
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import type { RootState } from '@reduxjs/toolkit/query';
import { useSelector } from 'react-redux';
import { store } from '../../store';
import { NavLink, useLoaderData } from 'react-router-dom';

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
  order: Order | null
}

export const loader = (queryClient: any) => async ({ params }: any) => {
  const storeState = store.getState();
  const user = storeState.userState?.user;
  const id = params.id;

  const TransactionsQuery = {
    queryKey: ['TransactionsQuery', id],
    queryFn: async () => {
      const response = await customFetch.get(`/receipts`, {
        headers: {
          Authorization: user?.token,
        },
      });
      console.log(`Transactions TransactionsQuery`, response.data)
      return response.data;
    },
  };

  try {
    const [TransactionReceipts] = await Promise.all([
      queryClient.ensureQueryData(TransactionsQuery)
    ]);
    console.log('Transactions TransactionReceipts :', TransactionReceipts)
    return { TransactionReceipts };
  } catch (error: any) {
    console.error('Failed to load transactions data:', error);
    toast.error('Failed to load transactions data');
    return { TransactionsReceipts: [] };
  }
};

const Transactions = () => {
  const { TransactionReceipts } = useLoaderData() as { 
    TransactionReceipts: Transaction[]; 
  };
  console.log(`Transactions TransactionReceipts`, TransactionReceipts)

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
      default:
        return type;
    }
  };

  return (
    // <div className='align-element text-black'>
    //   {TransactionReceipts.map((tx: Transaction) => {
    //     const { id, transaction_type, balance_before, balance_after, description, created_at, user: { email }, order: { id: order_id, cart_status, is_paid, total_cost, items_count, total_quantity } }
    //     return (
    //       <div key={id}>

    //       </div>
    //     )
    //   })}
    // </div>
    
    <div className="min-h-screen bg-base-100 text-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-secondary rounded-lg border border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Transactions</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Company Name or Ticker ID"
                    className="bg-[#2a2740] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-100"
                  />
                  <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 font-medium text-gray-300">Type</th>
                  <th className="text-left p-4 font-medium text-gray-300">Balance Before</th>
                  <th className="text-right p-4 font-medium text-gray-300">Balance After</th>
                  <th className="text-right p-4 font-medium text-gray-300">Amount</th>
                  <th className="text-right p-4 font-medium text-gray-300">Order Status</th>
                  <th className="text-right p-4 font-medium text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {TransactionReceipts.length > 0 ? (
                  TransactionReceipts.map((transaction: Transaction, index: number) => (
                    <tr 
                      key={transaction.id} 
                      className={`border-b border-gray-800 hover:bg-[#2a2740] transition-colors ${
                        index % 2 === 0 ? 'bg-[#1e1b2e]' : 'bg-[#252238]'
                      }`}
                    >
                      <td className="p-4">
                        <NavLink to={`${transaction.id}`}>
                          <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                            transaction.transaction_type === 'purchase' ? 'bg-green-600 text-white' :
                            transaction.transaction_type === 'withdraw' ? 'bg-red-600 text-white' :
                            transaction.transaction_type === 'deposit' ? 'bg-blue-600 text-white' :
                            'bg-purple-600 text-white'
                          }`}>
                            {getTransactionTypeDisplay(transaction.transaction_type)}
                          </span>
                        </NavLink>
                      </td>
                      <td className="p-4">
                        {/* <div className="flex items-center space-x-3">
                          {transaction.stock?.logo_url ? (
                            <img 
                              src={transaction.stock.logo_url} 
                              alt={`${transaction.stock.ticker} logo`}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-gray-300">
                                {transaction.stock?.ticker?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                          <span className="text-white">
                            {getCompanyDisplay(transaction)}
                          </span>
                        </div> */}
                        <div className="flex items-center space-x-3">
                          {transaction.balance_before && transaction.balance_before !== 0
                            ? transaction.balance_before
                            : '-'
                          }
                        </div>
                      </td>
                      <td className="p-4 text-right text-white">
                        {/* {transaction.quantity && transaction.quantity !== '0.0' 
                          ? parseFloat(transaction.quantity).toLocaleString()
                          : '-'
                        } */}
                        <div className="flex items-center space-x-3">
                          {transaction.balance_after && transaction.balance_after !== 0
                            ? transaction.balance_after
                            : '-'
                          }
                        </div>
                      </td>
                      <td className="p-4 text-right text-white">
                        {/* {transaction.price_per_share && transaction.price_per_share !== '0.0'
                          ? `$${parseFloat(transaction.price_per_share).toFixed(2)}`
                          : '-'
                        } */}
                        <div className="flex items-center space-x-3">
                          {transaction.amount && transaction.amount !== 0
                            ? transaction.amount
                            : '-'
                          }
                        </div>
                      </td>
                      <td className="p-4 text-right text-white font-medium">
                        {/* ${parseFloat(transaction.total_amount).toFixed(2)} */}
                        {transaction.order?.cart_status ? transaction.order.cart_status : '-' }
                      </td>
                      <td className="p-4 text-right text-gray-300">
                        <div className="text-right">
                          <div>{formatDate(transaction.created_at)}</div>
                          <div className="text-sm text-gray-400">
                            {formatTime(transaction.created_at)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
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
        </div>
      </div>
    </div>
  )
}

export default Transactions