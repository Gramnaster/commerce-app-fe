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
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
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
    transaction_type,
    description,
    created_at,
    order,
  } = TransactionDetails;
  const {
    is_paid,
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

      <table className="w-full mb-8">
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
            <th className="text-left">Paid?</th>
            <td>{is_paid ? 'Yes' : 'Unpaid'}</td>
          </tr>

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
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
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
          <h3 className="font-primary text-2xl font-semibold mb-4">Delivery Orders</h3>
          <div className="space-y-4">
            {delivery_orders.map((delivery, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4 bg-white"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">
                      {delivery.company_site.title}
                    </p>
                    <p className="text-base text-gray-600">
                      Warehouse ID: {delivery.company_site.id}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        delivery.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : delivery.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : delivery.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionView;
