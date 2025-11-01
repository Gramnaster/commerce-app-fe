import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import type { SocialProgramResponse, SocialProgram } from '../Cart/Checkout';
import { NavLink, useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PaginationControls } from '../../components';
import { IconLineDark, IconLineWhite } from '../../assets/images';

export const loader = (queryClient: any) => async () => {
  const SocialProgramsQuery = {
    queryKey: ['SocialPrograms'],
    queryFn: async () => {
      const response = await customFetch.get(`/social_programs`);
      return response.data;
    },
  };

  try {
    const SocialPrograms = await queryClient.fetchQuery(SocialProgramsQuery);
    return { SocialPrograms };
  } catch (error: any) {
    console.error('Failed to load social programs data:', error);
    toast.error('Failed to load social programs data');
    return { SocialPrograms: { data: [], pagination: {} } };
  }
};

const SocialPrograms = () => {
  const { SocialPrograms: initialSocialPrograms } = useLoaderData() as {
    SocialPrograms: SocialProgramResponse;
  };
  const [loading, setLoading] = useState(false);
  const [socialProgramsData, setSocialProgramsData] = useState(
    initialSocialPrograms
  );

  // Update socialProgramsData when loader fetches new data
  useEffect(() => {
    setSocialProgramsData(initialSocialPrograms);
  }, [initialSocialPrograms]);

  // Add safety check for socialProgramsData.data
  if (!socialProgramsData?.data) {
    return (
      <div className="text-center py-10">No social programs available</div>
    );
  }

  const handlePagination = async (page: number | null) => {
    if (!page) return;
    setLoading(true);

    try {
      const response = await customFetch.get(
        `/social_programs?page=${page}&per_page=${socialProgramsData.pagination.per_page || 10}`
      );
      const data = response.data;
      setSocialProgramsData(data);
      setLoading(false);
    } catch (error: any) {
      console.error('Failed to load pagination data:', error);
      toast.error('Failed to load pagination data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-black">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <>
      <section className="align-element text-black">
        <div className="flex justify-center align-middle flex-col my-[85px]">
          <h2 className="font-primary text-base-content text-2xl text-center">
            SOCIAL PROGRAMS
          </h2>
          <div className="relative h-[11px] w-[67px] mx-auto">
            <img
              src={IconLineWhite}
              className="block dark:hidden h-[11px] w-[67px] mx-auto"
            />
            <img
              src={IconLineDark}
              className="hidden dark:block h-[11px] w-[67px] mx-auto"
            />
          </div>
        </div>
        {socialProgramsData.data.map((program: SocialProgram) => {
          const {
            unit_no,
            street_no,
            address_line1,
            address_line2,
            city,
            region,
            zipcode,
          } = program.address;

          // Format address as a single line
          const addressParts = [
            unit_no,
            street_no,
            address_line1,
            address_line2,
            city,
            region,
            zipcode,
          ].filter(Boolean); // Remove null/undefined values

          const formattedAddress = addressParts.join(', ');

          return (
            <section key={program.id}>
              <h2>{program.title}</h2>
              <p>{program.description}</p>
              <p>
                <strong>Address: </strong>
                {formattedAddress}
              </p>
              <NavLink to={`${program.id}`}>More Info here</NavLink>
            </section>
          );
        })}
      </section>

      <PaginationControls
        pagination={socialProgramsData.pagination}
        onPageChange={handlePagination}
      />
    </>
  );
};

export default SocialPrograms;
