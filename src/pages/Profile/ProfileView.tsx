import { redirect, useLoaderData} from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../../utils";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import type { RootState } from "../../store";

// From action loader, we'll get the stored user id

export interface User {
  id: number;
  email: string;
}

export const loader = (queryClient: any, store: any) => async ({ params }: any) => {
  const storeState = store.getState();
  const user = storeState.userState?.user;

  const id = params.id;

  const userDetailsQuery = {
    queryKey: ['userDetails', id],
    queryFn: async () => {
      const response = await customFetch.get(`/users/${id}`, {
        headers: {
          Authorization: user.token,
        },
      });
      return response.data;
    },
  };

  try {
    const userDetails = await queryClient.ensureQueryData(userDetailsQuery);
    return { userDetails };
  } catch (error: any) {
    console.error('Failed to load user:', error);
    toast.error('Failed to load user details');
    return redirect('/admin');
  }
};

const ProfileView = () => {
    const { userDetails } = useLoaderData() as { 
    userDetails: User; 
  };

  const user = useSelector((state: RootState) => state.userState.user);
    console.log(`user`, user)

  return (
    <div className="text-black">
      <div className="flex flex-col items-center justify-center">
        <div>{user?.email}</div>
        <div>{userDetails.data.user_detail.first_name}</div>
        <div>{userDetails.data.user_detail.last_name}</div>
        <div>{userDetails.data.user_detail.dob}</div>
        <NavLink to={`/profile/edit/${user?.id}`}>
        Edit Profile
        </NavLink>
      </div>
    </div>
  )
}
export default ProfileView