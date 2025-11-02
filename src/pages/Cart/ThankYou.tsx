import { NavLink, useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify';
import { customFetch } from '../../utils';
import type { User } from './Checkout';
import { IconLineDark, IconLineWhite } from '../../assets/images';

interface Order {
  id: number;
  cart_status: 'approved' | 'rejected' | 'pending';
  is_paid: boolean;
  total_cost: number;
  created_at: string;
}

export interface latestReceipt {
  id: number;
  transaction_type: 'withdraw' | 'deposit' | 'purchase';
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  user: User;
  order: Order;
  items_count: number;
  total_quantity: string;
}

export const loader = (queryClient: any) => async ({ params }: any) => {
  const id = params.id;

  const latestReceiptQuery = {
    queryKey: ['latestReceipt', id],
    queryFn: async () => {
      const response = await customFetch.get(`/receipts/latest`);
      console.log(`ThankYou response.data`, response.data)
      return response.data;
    },
  };

  try {
    const [latestReceipts] = await Promise.all([
      queryClient.ensureQueryData(latestReceiptQuery)
    ]);
    console.log('Receipts latestReceipts :', latestReceipts)
    return { latestReceipts };
  } catch (error: any) {
    console.error('Failed to load latest Receipt data:', error);
    toast.error('Failed to load latest Receipt data');
    return { latestReceipts: [] };
  }
};

const ThankYou = () => {
  const { latestReceipts } = useLoaderData() as {
    latestReceipts: latestReceipt;
  };
  const { id } = latestReceipts

  return (
    <div className='align-middle m-20 text-black place-items-center place-content-center h-full'>
      <div className='text-4xl p-10 flex flex-col items-center justify-center gap-3'>
        <div className='font-semibold'> Thank you for ordering! </div>
        <div className="relative h-[25px] w-[250px] mx-auto mb-5">
          <img
            src={IconLineWhite}
            className="block dark:hidden h-[25px] w-[250px] mx-auto"
          />
          <img
            src={IconLineDark}
            className="hidden dark:block h-[25px] w-[250px] mx-auto"
          />
        </div>
        <div className='flex items-center justify-center gap-3 mt-5'>
          <NavLink to={`/`} className='text-4xl'>
            <button className='btn bg-neutral-500 text-[#ffffff] btn-block border-none shadow-none outline-none mb-2 w-full flex-1'>Return home</button>
          </NavLink>
          <NavLink to={`/profile/transactions/${id}`} className='text-4xl'>
            <button className='btn btn-secondary btn-block mb-2 w-full flex-1'>See receipt</button>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default ThankYou