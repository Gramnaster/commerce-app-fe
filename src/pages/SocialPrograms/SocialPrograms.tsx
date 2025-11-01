import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import type { SocialProgramResponse, SocialProgram } from '../Cart/Checkout';
import { NavLink, useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PaginationControls } from '../../components';
import { IconLineDark, IconLineWhite, Social01, Social02, Social03, Social04 } from '../../assets/images';

// Map social program IDs to their respective images
const socialImages = [Social01, Social02, Social03, Social04];

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
        <div className="align-social flex-col mb-40">
          {socialProgramsData.data.map((program: SocialProgram, index: number) => {
            const { id, title, description } = program;
            // Use static images in order
            const img = socialImages[index % socialImages.length];
            // Truncate description to 280 characters
            const shortDescription = description.length > 280
              ? description.slice(0, 280) + '...'
              : description;

            return (
              <li
                key={id}
                className="li flex flex-row items-end h-[316px] mb-[60px]"
              >
                <div className="h-full flex flex-col justify-between max-w-[370px]">
                  <div>
                    <h3 className="uppercase font-secondary font-normal text-[32px] pb-4">
                      {title}
                    </h3>
                    <p className="font-secondary font-light ">{shortDescription}</p>
                  </div>
                  <div className="flex justify-end underline underline-offset-2 mt-4">
                    <NavLink to={`${id}`}>Read More... </NavLink>
                  </div>
                </div>
                <img
                  src={img}
                  alt={title}
                  style={{ width: '724px', height: '316px', objectFit: 'cover' }}
                  className="pl-[20px]"
                />
              </li>
            );
          })}
        </div>
        
        {/* Scroll to Top Section */}
        <div className='align-social text-center pb-[100px]'>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-secondary text-base-content font-normal text-base underline cursor-pointer bg-transparent border-none"
          >
            Scroll to Top
          </button>
          <div className="relative h-[11px] w-[67px] mx-auto mb-[20px]">
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
      </section>

      <PaginationControls
        pagination={socialProgramsData.pagination}
        onPageChange={handlePagination}
      />
    </>
  );
};

export default SocialPrograms;
