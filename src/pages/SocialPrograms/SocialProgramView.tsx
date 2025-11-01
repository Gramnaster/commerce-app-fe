import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import { useLoaderData } from 'react-router-dom';
import type { SocialProgram } from '../Dashboard/FeaturedSocials';

interface SocialProgramViewResponse {
  data: SocialProgram;
}

export const loader = (queryClient: any) => async ({ params }: any) => {
  const id = params.id;

  const SocialProgramViewQuery = {
    queryKey: ['SocialProgramView', id],
    queryFn: async () => {
      const response = await customFetch.get(`/social_programs/${id}`);
      return response.data;
    },
  };

  try {
    const SocialProgramViewDetails = await queryClient.ensureQueryData(
      SocialProgramViewQuery
    );
    return { SocialProgramViewDetails };
  } catch (error: any) {
    console.error('Failed to load social program details:', error);
    toast.error('Failed to load social program details');
    return { SocialProgramViewDetails: null };
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