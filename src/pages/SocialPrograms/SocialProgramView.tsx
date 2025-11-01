import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import { useLoaderData, NavLink } from 'react-router-dom';
import type { SocialProgram } from '../Dashboard/FeaturedSocials';
import {
  IconLineDark,
  IconLineWhite,
  Social01,
  Social02,
  Social03,
  Social04,
} from '../../assets/images';
import { socialPrograms } from '../../assets/data/socialPrograms';

// Map social program IDs to their respective images
const socialImages: { [key: number]: string } = {
  1: Social01,
  2: Social02,
  3: Social03,
  4: Social04,
};

// Create lookup objects from the imported data
const socialProgramsData = socialPrograms.reduce((acc, program) => {
  acc[program.id + 1] = program; // API uses 1-4, data uses 0-3
  return acc;
}, {} as { [key: number]: typeof socialPrograms[0] });

interface SocialProgramViewResponse {
  data: SocialProgram;
}

export const loader =
  (queryClient: any) =>
  async ({ params }: any) => {
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
    SocialProgramViewDetails: SocialProgramViewResponse;
  };
  const {
    id,
    title,
    description,
    address: {
      unit_no,
      street_no,
      address_line1,
      address_line2,
      city,
      region,
      zipcode,
    },
  } = SocialProgramViewDetails.data;

  // Get the corresponding image for this social program
  const headerImage = socialImages[id] || Social01; // Fallback to Social01 if ID not found

  // Get the corresponding contact number and website for this social program
  const programData = socialProgramsData[id];
  const contactNumber = programData?.contactNumber || '+63 2 8000-0000'; // Fallback contact number
  const website = programData?.website || 'https://example.com'; // Fallback website

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
    <div className="align-element text-black mb-20">
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
      {/* Header Image */}
      <div className="w-full mb-8">
        <img
          src={headerImage}
          alt={title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto font-secondary ">
        <h1 className="text-4xl font-bold mb-4 uppercase font-primary">
          {title}
        </h1>
        <p className="text-2xl mb-6">{description}</p>
        <p className="text-base mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="text-base mb-6">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
        </p>
        <p className="text-base mb-6">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
        </p>
        <div className="border-t pt-4">
          <p className="text-gray-600">
            <strong>Address: </strong>
            {formattedAddress}
          </p>
          <p className="text-gray-600">
            <strong>Contact Number: </strong>
            {contactNumber}
          </p>
          <p className="text-gray-600">
            <strong>Website: </strong>
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {website}
            </a>
          </p>
        </div>

        {/* Back to Social Programs Link */}
        <div className="mt-8">
          <NavLink to="/social_programs" className="btn btn-secondary">
            ← Back to Social Programs
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SocialProgramView;
