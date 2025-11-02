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
    TransactionDetails: TransactionViewDetails;
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
  console.log(`TransactionView order`, order);
  console.log(`TransactionView items`, items);

  // const { qty, subtotal, product} = items ?? {};
  // const { title, price} = product ?? {};

  return (
    <div className="min-h-screen bg-base-100 text-2xl text-base-content p-6 align-element">
      <div className="font-primary text-3xl text-center mb-6">ORDER #{id}</div>

      <table className="w-full mb-8 font-secondary">
        <tbody>
          {/* We don't need transaction type and paid - they're obsolete */}
          {/* <tr>
            <th className="text-left">Transaction Type: </th>
            <td className='capitalize font-light'>{transaction_type}</td>
          </tr> */}

          <tr>
            <th className="text-left">Type: </th>
            <td className='capitalize font-light'>{description}</td>
          </tr>

          <tr>
            <th className="text-left">Date:</th>
            <td className='capitalize font-light'>{formatDate(created_at)}</td>
          </tr>

          {/* <tr>
            <th className="text-left">Paid?</th>
            <td className='capitalize font-light'>{is_paid ? 'Yes' : 'Unpaid'}</td>
          </tr> */}

          {items && items.length > 0
            ? items.map((item) => {
                const { id, qty, subtotal, product } = item;
                const { title } = product;
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
            : null}

          <tr>
            <th className="text-left">Order total</th>
            <td>{total_cost}</td>
          </tr>
        </tbody>
      </table>

      {/* Delivery Address Section */}
      {delivery_address && (
        <div className="mt-8 mb-8">
          <h3 className="font-primary text-2xl font-semibold mb-4">Delivery Address</h3>
          <div className="border border-gray-300 rounded-lg p-6 bg-[#f3f3f3]">
            <div className="space-y-2 text-lg">
              {delivery_address.unit_no && (
                <p>
                  <span className="font-semibold">Unit No:</span> {delivery_address.unit_no}
                </p>
              )}
              {delivery_address.street_no && (
                <p>
                  <span className="font-semibold">Street No:</span> {delivery_address.street_no}
                </p>
              )}
              <p>
                <span className="font-semibold">Address:</span> {delivery_address.address_line1}
              </p>
              {delivery_address.address_line2 && (
                <p>{delivery_address.address_line2}</p>
              )}
              <p>
                {delivery_address.city}, {delivery_address.region} {delivery_address.zipcode}
              </p>
              <p>
                <span className="font-semibold">Country:</span> {delivery_address.country.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Orders Section */}
      {delivery_orders && delivery_orders.length > 0 && (
        <div className="mt-8">
          <h3 className="font-primary text-2xl font-semibold mb-4">Delivery Status</h3>
          <div className="space-y-4">
            {delivery_orders.map((delivery, index) => {
              const statuses = ['storage', 'progress', 'delivered'];
              const currentStatusIndex = statuses.indexOf(delivery.status.toLowerCase());
              
              // Debug log
              console.log('Delivery status:', delivery.status, 'Index:', currentStatusIndex);
              
              return (
                <div key={index} className="border border-gray-300 rounded-lg p-6 bg-[#f3f3f3]">
                  <p className="text-lg font-semibold mb-2">
                    {delivery.company_site.title}
                  </p>
                  <p className="text-base text-gray-600 mb-6">
                    Warehouse ID: {delivery.company_site.id}
                  </p>
                  
                  {/* Timeline - Centered */}
                  <div className="flex justify-center">
                    <ul className="timeline">
                      {/* Storage */}
                      <li>
                        <div className="timeline-start timeline-box">
                          <span className={currentStatusIndex >= 0 ? 'font-semibold text-primary' : ''}>
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
                        <hr className={currentStatusIndex >= 1 ? 'bg-primary' : ''} />
                      </li>

                      {/* Progress (In Transit) */}
                      <li>
                        <hr className={currentStatusIndex >= 1 ? 'bg-primary' : ''} />
                        <div className="timeline-start timeline-box">
                          <span className={currentStatusIndex >= 1 ? 'font-semibold text-primary' : ''}>
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
                        <hr className={currentStatusIndex >= 2 ? 'bg-primary' : ''} />
                      </li>

                      {/* Delivered */}
                      <li>
                        <hr className={currentStatusIndex >= 2 ? 'bg-primary' : ''} />
                        <div className="timeline-start timeline-box">
                          <span className={currentStatusIndex >= 2 ? 'font-semibold text-primary' : ''}>
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
    </div>
  );
};

export default TransactionView;
