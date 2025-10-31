import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import type { SocialProgramResponse, SocialProgram, Address, Pagination } from '../Cart/Checkout';
import { NavLink, useLoaderData } from 'react-router-dom';

export const loader = (queryClient: any) => async ({ params }: any) => {
  const id = params.id;

  const SocialProgramsQuery = {
    queryKey: ['SocialProgramsDetails', id],
    queryFn: async () => {
      const response = await customFetch.get(`/social_programs`);
      console.log(`SocialPrograms response.data`, response.data)
      return response.data;
    },
  };

  try {
    const [SocialPrograms] = await Promise.all([
      queryClient.ensureQueryData(SocialProgramsQuery)
    ]);
    console.log('Checkout SocialPrograms :', SocialPrograms)
    return { SocialPrograms };
  } catch (error: any) {
    console.error('Failed to load SocialPrograms data:', error);
    toast.error('Failed to load SocialPrograms data');
    return { allSocialPrograms: [] };
  }
};

const SocialPrograms = () => {
  const { SocialPrograms } = useLoaderData() as {
    SocialPrograms: SocialProgramResponse
  };
  console.log(`SocialPrograms SocialPrograms`, SocialPrograms)

  return (
    <div className='align-element text-black'>
      {SocialPrograms.data.map((program: SocialProgram) => {
        const { unit_no, street_no, address_line1, address_line2, city, region, zipcode } = program.address
        return (
          <div key={program.id}>
            <div>{program.title}</div>
            <div>{program.description}</div>
            <div>
                <div>Address:</div>
                <div>{unit_no}</div>
                <div>{street_no}</div>
                <div>{address_line1}</div>
                <div>{address_line2}</div>
                <div>{city}</div>
                <div>{region}</div>
                <div>{zipcode}</div>
            </div>
            <NavLink to={`${program.id}`}>More Info here</NavLink>
          </div>
        )
      })}
    </div>
  )
}

export default SocialPrograms