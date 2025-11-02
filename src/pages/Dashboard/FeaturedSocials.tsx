import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '../../utils';
import { IconLineDark, IconLineWhite } from '../../assets/images';
import { Social01, Social02, Social03, Social04 } from '../../assets/images';

export interface Address {
  id: number;
  unit_no: string;
  street_no: string;
  address_line1: string | null;
  address_line2: string | null;
  barangay: string;
  city: string;
  region: string | null;
  zipcode: string;
  country_id: number;
  country: string;
}

export interface SocialProgram {
  id: number;
  title: string;
  description: string;
  address: Address;
  created_at: string;
  updated_at: string;
}

export interface SocialProgramResponse {
  status: {
    code: number;
    message: string;
  };
  pagination: {
    current_page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
    next_page: number | null;
    previous_page: number | null;
  };
  data: SocialProgram[];
}

const fetchSocialPrograms = async () => {
  const response = await customFetch.get('/social_programs');
  return response.data;
};

// Map social program IDs to their respective images
const socialImages = [Social01, Social02, Social03, Social04];

const FeaturedSocials = () => {
  const {
    data: socialProgramsResponse,
    isLoading,
    error,
  } = useQuery<SocialProgramResponse>({
    queryKey: ['socialPrograms'],
    queryFn: fetchSocialPrograms,
  });

  if (isLoading) {
    return (
      <section className="align-social text-base-content">
        <div className="flex justify-center align-middle my-[85px]">
          <p>Loading social programs...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="align-social text-base-content">
        <div className="flex justify-center align-middle my-[85px]">
          <p>Failed to load social programs</p>
        </div>
      </section>
    );
  }

  const socialPrograms = socialProgramsResponse?.data || [];
  // Limit to first 4 social programs
  const featuredPrograms = socialPrograms.slice(0, 4);
  
  return (
    <section className="align-social text-base-content">
      <div className="flex justify-center align-middle flex-col my-[85px] text-center">
        <h2 className="font-primary text-base-content text-2xl ">
          SOCIAL PROGRAMS
        </h2>
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
        <div className="align-social w-[575px] flex flex-col text-center font-secondary">
          <p className="my-[20px]">
            You decide where a portion of your money goes.
          </p>
          <p className="font-light">
            <span className="font-black">JP</span>
            <span className="font-medium">&</span>
            <span className="font-black">B</span> partners with over dozens of
            charities and social programs across the Philippines. A portion of
            your total cost will always go to a charity of your choosing. If you
            do not select a charity, we will find a partner near your shipping
            address and donate to them instead.
          </p>
        </div>
      </div>
      <div className="align-social flex-col">
        {featuredPrograms.map((program: SocialProgram, index: number) => {
          const { id, title, description } = program;
          // Use static images in order
          const img = socialImages[index % socialImages.length];
          // Truncate description to 280 characters
          const shortDescription = description.length > 280
            ? description.slice(0, 280) + '...'
            : description;
          if (index % 2 === 0) {
            return (
              <li
                key={id}
                className="li flex flex-row items-end h-[316px] mb-[120px]"
              >
                <img
                  src={img}
                  alt={title}
                  style={{ width: '724px', height: '316px', objectFit: 'cover' }}
                  className="pr-[20px]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="h-full flex flex-col justify-between max-w-[370px]">
                  <div>
                    <h3 className="uppercase font-secondary font-normal text-[32px] pb-4">
                      {title}
                    </h3>
                    <p className="font-secondary font-light ">{shortDescription}</p>
                  </div>
                  <div className="flex justify-end underline underline-offset-2 mt-4">
                    <NavLink to={`/social_programs/${id}`}>Read More... </NavLink>
                  </div>
                </div>
              </li>
            );
          } else if (index % 2 === 1) {
            return (
              <li
                key={id}
                className="li flex flex-row items-end h-[316px] mb-[120px]"
              >
                <div className="h-full flex flex-col justify-between max-w-[370px]">
                  <div>
                    <h3 className="uppercase font-secondary font-normal text-[32px] pb-4">
                      {title}
                    </h3>
                    <p className="font-secondary font-light ">{shortDescription}</p>
                  </div>
                  <div className="flex justify-end underline underline-offset-2 mt-4">
                    <NavLink to={`/social_programs/${id}`}>Read More... </NavLink>
                  </div>
                </div>
                <img
                  src={img}
                  alt={title}
                  style={{ width: '724px', height: '316px', objectFit: 'cover' }}
                  className="pl-[20px]"
                  loading="lazy"
                  decoding="async"
                />
              </li>
            );
          }
          return <div>Error, mate</div>;
        })}
      </div>
      <div className='align-social text-center pb-[100px]'>
        <NavLink to="/social_programs" >
          <h3 className="font-secondary text-base-content font-normal text-base underline ">
            and dozens of other social partners here...
          </h3>
        </NavLink>
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
  );
};
export default FeaturedSocials;
