import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import { useLoaderData } from 'react-router-dom';
import type { SocialProgram } from '../Dashboard/FeaturedSocials';
import { Social01, Social02, Social03, Social04 } from '../../assets/images';

// Map social program IDs to their respective images
const socialImages: { [key: number]: string } = {
  1: Social01,
  2: Social02,
  3: Social03,
  4: Social04,
};

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
    <div className="align-element text-black">
      {/* Header Image */}
      <div className="w-full mb-8">
        <img
          src={headerImage}
          alt={title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 uppercase">{title}</h1>
        <p className="text-lg mb-6">{description}</p>
        <div className="border-t pt-4">
          <p className="text-gray-600">
            <strong>Address: </strong>
            {formattedAddress}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SocialProgramView