import React from 'react'
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import { useLoaderData } from 'react-router-dom';
import type { SocialProgram, SocialProgramResponse } from '../Cart/Checkout';

interface SocialProgramViewResponse {
  data: SocialProgram
}

export const loader = (queryClient: any) => async ({ params }: any) => {
  const id = params.id;

  const SocialProgramViewQuery = {
    queryKey: ['SocialProgramView', id],
    queryFn: async () => {
      const response = await customFetch.get(`/social_programs/${id}`);
      console.log(`Checkout SocialPrograms`, response.data)
      return response.data;
    },
  };

  try {
    const [SocialProgramViewDetails] = await Promise.all([
      queryClient.ensureQueryData(SocialProgramViewQuery)
    ]);
    console.log('SocialProgramView SocialProgramViewDetails :', SocialProgramViewDetails)
    return { SocialProgramViewDetails };
  } catch (error: any) {
    console.error('Failed to load SocialProgramViewDetails data:', error);
    toast.error('Failed to load SocialProgramViewDetails data');
    return { SocialProgramViewDetails: [] };
  }
};

const SocialProgramView = () => {
  const { SocialProgramViewDetails } = useLoaderData() as {
    SocialProgramViewDetails: SocialProgramViewResponse
  };
  const { title, description, address: { unit_no, street_no, address_line1, address_line2, city, region, zipcode } } = SocialProgramViewDetails.data;

  return (
    <div className='align-element text-black'>
      SocialProgram:
      <div>{title}</div>
      <div>{description}</div>
      <div>
        <div>
          Address
        </div>
        <div>{unit_no}</div>
        <div>{street_no}</div>
        <div>{address_line1}</div>
        <div>{address_line2}</div>
        <div>{city}</div>
        <div>{region}</div>
        <div>{zipcode}</div>
      </div>
    </div>
  )
}

export default SocialProgramView