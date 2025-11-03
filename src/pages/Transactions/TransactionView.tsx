import { redirect, useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import type { Order, Transaction } from './Transactions';

import { type Product } from '../Cart/Cart';

// TransactionView-specific types (not in Transactions.tsx)
interface Item {
  id: number;
  qty: string;
  title: string;
  price: number;
  subtotal: string;
  product: Product;
}

interface Country {
  id: number;
  name: string;
  code: string;
}

interface DeliveryAddress {
  id: number;
  unit_no: string;
  street_no: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  zipcode: string;
  country: Country;
}

interface CompanySite {
  id: number;
  title: string;
}

interface DeliveryOrder {
  company_site: CompanySite;
  status: 'storage' | 'progress' | 'delivered';
  delivered_at: string;
}

// Extended Order interface with additional fields for TransactionView
interface TransactionViewOrder extends Order {
  items: Item[];
  delivery_address: DeliveryAddress;
  delivery_orders: DeliveryOrder[];
}

// Extended Transaction interface for TransactionView
interface TransactionViewDetails extends Transaction {
  order: TransactionViewOrder | null;
  items: Item[] | null;
}

export const loader =
  (queryClient: any) =>
  async ({ params }: any) => {
    const id = params.id;

    const TransactionQuery = {
      queryKey: ['TransactionDetails', id],
      queryFn: async () => {
        const response = await customFetch.get(`/receipts/${id}`);
        return response.data;
      },
    };

    const ReceiptsListQuery = {
      queryKey: ['ReceiptsList'],
      queryFn: async () => {
        const response = await customFetch.get(`/receipts?per_page=1`);
        return response.data;
      },
    };

    try {
      const [TransactionDetails, ReceiptsList] = await Promise.all([
        queryClient.ensureQueryData(TransactionQuery),
        queryClient.ensureQueryData(ReceiptsListQuery),
      ]);
      
      return { TransactionDetails, ReceiptsList };
    } catch (error: any) {
      console.error('Failed to load transaction:', error);
      toast.error('Failed to load transaction details');
      return redirect('/profile/transactions');
    }
  };

const TransactionView = () => {
  const { TransactionDetails, ReceiptsList } = useLoaderData() as {
    TransactionDetails: TransactionViewDetails;
    ReceiptsList: {
      pagination: {
        total_entries: number;
      };
      data: any[];
    };
  };
  console.log(`TransactionView TransactionDetails`, TransactionDetails);
  console.log(`TransactionView ReceiptsList`, ReceiptsList);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const {
    // transaction_type,
    description,
    created_at,
    order,
  } = TransactionDetails;
  const {
    // is_paid,
    total_cost,
    items,
    delivery_address,
    delivery_orders,
  } = order ?? {};
  
  // Calculate order number based on total receipts
  const orderNumber = ReceiptsList.pagination.total_entries;
  
  console.log(`TransactionView order`, order);
  console.log(`TransactionView items`, items);

  // const { qty, subtotal, product} = items ?? {};
  // const { title, price} = product ?? {};

  return (
    <div className="min-h-screen bg-base-100 text-2xl text-base-content p-6 align-element">
      <div className="font-primary text-3xl text-left mb-6">
        ORDER #{orderNumber}
      </div>

      {/* Delivery Orders Section */}
      {delivery_orders && delivery_orders.length > 0 && (
        <div className="mb-8">
          <h3 className="font-primary text-2xl font-semibold mb-4">
            Delivery Status
          </h3>
          <div>
            {delivery_orders.map((delivery, index) => {
              const statuses = ['storage', 'progress', 'delivered'];
              const currentStatusIndex = statuses.indexOf(
                delivery.status.toLowerCase()
              );

              // Debug log
              console.log(
                'Delivery status:',
                delivery.status,
                'Index:',
                currentStatusIndex
              );

              return (
                <div
                  key={index}
                  className="flex flex-row border border-gray-300 rounded-lg px-6 pt-6 bg-[#f3f3f3]"
                >
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold mb-2">
                      {delivery.company_site.title}
                    </p>
                    <p className="text-base text-gray-600 mb-2">
                      Warehouse ID: {delivery.company_site.id}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Last Updated: {formatDateTime(delivery.delivered_at)}
                    </p>
                  </div>

                  {/* Timeline - Centered with custom spacing */}
                  <div className="flex justify-center">
                    <ul className="timeline">
                      {/* Storage */}
                      <li className="w-60">
                        <div className="timeline-start timeline-box">
                          <span
                            className={
                              currentStatusIndex >= 0
                                ? 'font-semibold text-primary'
                                : ''
                            }
                          >
                            Storage
                          </span>
                        </div>
                        <div className="timeline-middle">
                          {currentStatusIndex >= 0 ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5 text-primary"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5 text-gray-300"
                            >
                              <circle cx="10" cy="10" r="8" />
                            </svg>
                          )}
                        </div>
                        <hr
                          className={`${currentStatusIndex >= 1 ? 'bg-primary' : ''}`}
                        />
                      </li>

                      {/* Progress (In Transit) */}
                      <li className="w-60">
                        <hr
                          className={`${currentStatusIndex >= 1 ? 'bg-primary' : ''}`}
                        />
                        <div className="timeline-start timeline-box">
                          <span
                            className={
                              currentStatusIndex >= 1
                                ? 'font-semibold text-primary'
                                : ''
                            }
                          >
                            In Transit
                          </span>
                        </div>
                        <div className="timeline-middle">
                          {currentStatusIndex >= 1 ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5 text-primary"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5 text-gray-300"
                            >
                              <circle cx="10" cy="10" r="8" />
                            </svg>
                          )}
                        </div>
                        <hr
                          className={`${currentStatusIndex >= 2 ? 'bg-primary' : ''}`}
                        />
                      </li>

                      {/* Delivered */}
                      <li className="w-60">
                        <hr
                          className={`${currentStatusIndex >= 2 ? 'bg-primary' : ''}`}
                        />
                        <div className="timeline-start timeline-box">
                          <span
                            className={
                              currentStatusIndex >= 2
                                ? 'font-semibold text-primary'
                                : ''
                            }
                          >
                            Delivered
                          </span>
                        </div>
                        <div className="timeline-middle">
                          {currentStatusIndex >= 2 ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5 text-primary"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5 text-gray-300"
                            >
                              <circle cx="10" cy="10" r="8" />
                            </svg>
                          )}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transaction Details Section */}
      <div className="mb-8 font-secondary">
        <h3 className="font-primary text-2xl font-semibold mb-4">
          Transaction Details
        </h3>

        {/* Type and Date */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 mb-6">
          <div>
            <p className="font-semibold text-[16px]">Type:</p>
            <p className="capitalize text-[16px]">{description}</p>
          </div>
          <div>
            <p className="font-semibold text-[16px]">Date:</p>
            <p className="capitalize text-[16px]">{formatDateTime(created_at)}</p>
          </div>
          {/* Order Total */}
          <div>
            <p className="font-semibold text-[16px]">Order Total:</p>
            <p className="font-bold text-xl text-red-600">PHP {total_cost}</p>
          </div>
        </div>

        {/* Items Section */}
        {items && items.length > 0 && (
          <div className="mb-6">
            <p className="font-primary text-2xl font-semibold mb-4">Items Bought</p>
            <div className="space-y-3">
              {items.map((item) => {
                const { id, qty, subtotal, product } = item;
                const { title } = product;
                return (
                  <div
                    key={id}
                    className="flex justify-between items-end border-b border-gray-200 pb-2"
                  >
                    <div className="flex-1 w-max-[400px]">
                      <p className='text-[16px]'>{title}</p>
                      <p className="text-sm text-gray-600">Quantity: {qty}</p>
                    </div>
                    <div className="text-start justify-start items-start">
                      <p className="font-semibold text-[20px]">{subtotal}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Delivery Address Section */}
      {delivery_address && (
        <div className="mt-8 mb-8">
          <h3 className="font-primary text-2xl font-semibold mb-4">
            Delivery Address
          </h3>
          <div className="">
            <div className="space-y-2 text-lg">
              {delivery_address.unit_no && (
                <p>
                  <span className="font-semibold">Unit No:</span>{' '}
                  {delivery_address.unit_no}
                </p>
              )}
              {delivery_address.street_no && (
                <p>
                  <span className="font-semibold">Street No:</span>{' '}
                  {delivery_address.street_no}
                </p>
              )}
              <p>
                <span className="font-semibold">Address:</span>{' '}
                {delivery_address.address_line1}
              </p>
              {delivery_address.address_line2 && (
                <p>{delivery_address.address_line2}</p>
              )}
              <p>
                {delivery_address.city}, {delivery_address.region}{' '}
                {delivery_address.zipcode}
              </p>
              <p>
                <span className="font-semibold">Country:</span>{' '}
                {delivery_address.country.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionView;
